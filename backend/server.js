const express = require('express');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const connectToDatabase = require('./db');


const app = express();
const wss = new WebSocket.Server({ port: 3001 });
app.use(cors());
app.use(bodyParser.json());

// Add new user
app.post('/users', async (req, res) => {
  let dbClient;
  const { firstName, lastName, address, phoneNumber } = req.body;
  try {
    dbClient = await connectToDatabase();
    const query = 'INSERT INTO yahav_hoffmann.users (first_name, last_name, address, phone_number) VALUES ($1, $2, $3, $4) RETURNING id';
    const values = [firstName, lastName, address, phoneNumber];
    const result = await dbClient.query(query, values);

    // New User response body
    const newUser = {
        id: result.rows[0].id, first_name: firstName,
        last_name: lastName, address: address,
        phone_number: phoneNumber
    }

    // Notify WebSocket clients about the new user
    broadcast({ type: 'new_user', data: newUser
    });

    res.send({ message: 'User added successfully', userId: newUser.id });
  } catch (err) {
    res.status(500).send(err);
  } finally {
    if (dbClient) dbClient.release(); // Make sure to release the client back to the pool
  }
});

// Add new hobby
app.post('/hobbies', async (req, res) => {
  let dbClient;
  const { userId, hobby } = req.body
  try {
    dbClient = await connectToDatabase();
    const query = 'INSERT INTO yahav_hoffmann.hobbies (user_id, hobby) VALUES ($1, $2)';
    const values = [userId, hobby];
    await dbClient.query(query, values);

    // Notify WebSocket clients about the new hobby
    broadcast({ type: 'new_hobby', data: { userId, hobby } });

    res.send({ message: 'Hobby added successfully' });
  } catch (err) {
    res.status(500).send(err);
  } finally {
    if (dbClient) dbClient.release(); // Make sure to release the client back to the pool
  }
});

app.delete('/users/:id', async (req, res) => {
  let dbClient;
  const { id } = req.params;
  try {
    dbClient = await connectToDatabase();
    const query = 'DELETE FROM yahav_hoffmann.users WHERE id = $1';
    const values = [id];

    await dbClient.query(query, values);
    res.send({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).send(err);
  } finally {
    if (dbClient) dbClient.release(); // Make sure to release the client back to the pool
  }
});


// WebSocket broadcast function
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Handle WebSocket connections
wss.on('connection', (ws) => {
  let dbClient;
  console.log('New WebSocket connection established.');
  try {
    ws.on('message', async (message) => {
      const parsed = JSON.parse(message);
      console.log("Received: " + message)
      if (parsed.type === 'get_users') {
        try {
          dbClient = await connectToDatabase();
          const query = `
            SELECT 
              users.id, users.first_name, users.last_name, 
              users.address, users.phone_number, hobbies.hobby 
            FROM yahav_hoffmann.users 
            LEFT JOIN yahav_hoffmann.hobbies ON users.id = hobbies.user_id
          `;
          const results = await dbClient.query(query);

          const aggregatedRows = Object.values(
            results.rows.reduce((acc, row) => {
              const { id, hobby, ...rest } = row;

              // If the ID is already in the accumulator, add the hobby to the list
              if (!acc[id]) {
                acc[id] = { ...rest, id, hobbies: [] };
              }
              acc[id].hobbies = [...new Set([...acc[id].hobbies, hobby])]; // Ensure unique hobbies
              return acc;
            }, {})
          );
          console.log(aggregatedRows);
          ws.send(JSON.stringify({ type: 'users_list', data: aggregatedRows }));
        } catch (err) {
          ws.send(JSON.stringify({ type: 'error', message: err.message }));
        }
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed.');
    });
  } finally {
    if (dbClient) dbClient.release(); // Make sure to release the client back to the pool
  }
});

// Catch-all handler for React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});