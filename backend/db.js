const AWS = require('aws-sdk');
const { Pool } = require('pg');
const path = require('path');

// Configure AWS SDK
AWS.config.loadFromPath(path.join(__dirname, './aws-config.json'));

const secretsManager = new AWS.SecretsManager();

// Function to fetch the secret from AWS Secrets Manager
async function getSecretValue(secretName) {
  try {
    const data = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
    if (data.SecretString) {
      return JSON.parse(data.SecretString);  // Parse the secret string into an object
    } else {
      const buff = Buffer.from(data.SecretBinary, 'base64');
      return JSON.parse(buff.toString('ascii'));
    }
  } catch (err) {
    console.error("Error fetching secret", err);
    throw err;
  }
}

// Create the pool once at the start of the application
let pool;

async function getPool() {
  if (!pool) {
    const secret = await getSecretValue("dev/asterra-io/taskbd-postgres");

    pool = new Pool({
      host: secret.host,
      user: secret.username,
      password: secret.password,
      database: secret.dbname,
      port: secret.port,
      ssl: { rejectUnauthorized: false },
      max: 20, // Maximum number of connections in the pool
      idleTimeoutMillis: 5000, // Close idle connections after 5 seconds
    });
  }

  return pool;
}

// This function returns a pooled connection
async function connectToDatabase() {
  const pool = await getPool();
  return pool.connect();
}

module.exports = connectToDatabase;
