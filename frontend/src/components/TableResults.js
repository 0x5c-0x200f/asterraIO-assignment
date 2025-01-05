import React, { useState, useEffect } from 'react';
import './TableResults.css'; // Optional: Add styles for the table
import AddUserForm from "./AddUserForm";
import AddHobbyForm from "./AddHobbyForm";
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    fontFamily: "Times New Roman, Times, serif"
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 2,
    fontSize: 14,
    fontFamily: "Times New Roman, Times, serif"
  },
}));

const TableResults = () => {
  const [data, setData] = useState([]);
  const [statusSuccess, setStatusSuccess] = useState('');
  const [statusError, setStatusError] = useState('');
  const [showUserForm, setShowUserForm] = useState(false);
  const [showHobbyForm, setShowHobbyForm] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [hobby, setHobby] = useState('');
  const [userId, setUserId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Function to handle error status and clear after timeout
  const handleErrorStatus = (message) => {
    setStatusError(message);
    setTimeout(() => {
      setStatusError('');
    }, 5000); // Clears the status after 5 seconds
  };

  // Function to handle success status and clear after timeout
  const handleSuccessStatus = (message) => {
    setStatusSuccess(message);
    setTimeout(() => {
      setStatusSuccess('');
    }, 5000); // Clears the status after 5 seconds
  };

  useEffect(() => {
    // Establish WebSocket connection
    const socket = new WebSocket(`ws://${window.location.hostname}:3001`);

    socket.onopen = () => {
      console.log('WebSocket connection established');
      socket.send(JSON.stringify({ type: 'get_users' })); // Fetch initial user data
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case 'users_list':
          setData(message.data); // Initialize table data
          break;
        case 'new_user':
          setData((prevData) => [...prevData, message.data]); // Add new user
          break;
        case 'new_hobby':
          setData((prevData) =>
            prevData.map((user) =>
              user.id === message.data.userId
                ? {
                    ...user,
                    hobby: [...(user.hobby ? [user.hobby] : []), message.data.hobby].join(', '),
                  }
                : user
            )
          ); // Add new hobby to the user
          break;
        default:
          console.warn('Unhandled WebSocket message type:', message.type);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      handleErrorStatus('WebSocket connection error');
    };

    // Cleanup WebSocket on component unmount
    return () => {
      socket.close();
    };
  }, []);

  const handleUserAndHobbyDelete = async (id) => {
    try {
      const response = await fetch(`${window.location.protocol}//${window.location.hostname}:3000/users/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setData((prevData) => prevData.filter((item) => item.id !== id));
        handleSuccessStatus('User deleted successfully.');
        console.log('User deleted successfully.');
      } else {
        handleErrorStatus('Failed to delete user.');
        console.error('Failed to delete user.');
      }
    } catch (error) {
      handleErrorStatus(`Error: ${error.message}`);
      console.error(`Error: ${error.message}`);
    }
  }
  const handleUserFormSubmit = async () => {

  const userData = {
    firstName,
    lastName,
    address,
    phoneNumber,
  };

  if (!firstName || !lastName || !address || !phoneNumber) {
    handleErrorStatus("User data is missing!");
    console.warn("User data is missing!")
    return
  }

  try {
      const response = await fetch(`${window.location.protocol}//${window.location.hostname}:3000/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        handleSuccessStatus('User added successfully!');
        console.log('User added successfully!');
        // Optionally reset the form fields
        setFirstName('');
        setLastName('');
        setAddress('');
        setPhoneNumber('');
      } else {
        const errorData = await response.json();
        handleErrorStatus(`Error: ${errorData.message}`);
        console.error(`Error: ${errorData.message}`)
      }
  } catch (error) {
      handleErrorStatus(`Error: ${error.message}`);
      console.error(`Error: ${error.message}`)
    }
  };
  const handleHobbyFormSubmit = async () => {

  const userData = {
    userId,
    hobby
  };

  if (!userId || !hobby) {
    handleErrorStatus("Hobby data is missing!")
    return
  }

  try {
      const response = await fetch(`${window.location.protocol}//${window.location.hostname}:3000/hobbies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        handleSuccessStatus('User added successfully!');
        console.log('User added successfully!');
        // Optionally reset the form fields
        setUserId('');
        setHobby('');
      } else {
        const errorData = await response.json();
        handleErrorStatus(`Error: ${errorData.message}`)
        console.error(`Error: ${errorData.message}`);
      }
  } catch (error) {
      handleErrorStatus(`Error: ${error.message}`)
      console.error(`Error: ${error.message}`);
    }
  };
  const handleAddUser = () => {
    setShowUserForm(true);
  };
  const handleAddHobby = () => {
    setShowHobbyForm(true);
  }
  const handleHobbyFormCancel = () => {
    setShowHobbyForm(false);
  }
  const handleUserFormCancel = () => {
    setShowUserForm(false);
  }

  return (
    <div className="table-container">
      <h2>User and Hobby Table</h2>
      {
        statusSuccess ?
            // Display Success Message
            <p className="status-message-success">{statusSuccess}</p>
          :
            // Possibly experiencing an error
            statusError ?
                // Display Error Message
                <p className="status-message-error">{statusError}</p>
              :
                // Idle State
                <p hidden></p>
      }
      <div className="container-flex-forms">
        <Tooltip title="Add a new User to the table" arrow>
          <Button className="open-user-form-btn" variant="outlined" onClick={handleAddUser}>Add User</Button>
        </Tooltip>
        <Tooltip title="Add a new Hobby to a given User" arrow>
          <Button className="open-hobby-form-btn" variant="outlined" onClick={handleAddHobby}>Add Hobby</Button>
        </Tooltip>
      </div>
      {
        showUserForm && (
            <div className="show-form-container">
              <AddUserForm
                firstName={firstName}
                lastName={lastName}
                address={address}
                phoneNumber={phoneNumber}
                setFirstName={setFirstName}
                setLastName={setLastName}
                setAddress={setAddress}
                setPhoneNumber={setPhoneNumber}
                handleSubmit={handleUserFormSubmit}
                handleCancel={handleUserFormCancel}
              />
            </div>
          )
      }
      {
        showHobbyForm && (
            <div className="show-form-container">
              <AddHobbyForm
                users={data}
                userId={userId}
                hobby={hobby}
                setHobby={setHobby}
                setUserId={setUserId}
                handleSubmit={handleHobbyFormSubmit}
                handleCancel={handleHobbyFormCancel}
              />
            </div>
          )
      }
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Full Name</StyledTableCell>
              <StyledTableCell align="right">Address</StyledTableCell>
              <StyledTableCell align="right">Phone Number</StyledTableCell>
              <StyledTableCell align="right">Hobbies</StyledTableCell>
              <StyledTableCell align="right"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              data.length === 0 ?
                  <StyledTableRow>
                    <StyledTableCell align="center">No Data</StyledTableCell>
                  </StyledTableRow>
                :
                  data.map((user) => (
                    <StyledTableRow key={user.id}>
                      <StyledTableCell component="th" scope="row">
                        {user.first_name + " " + user.last_name}
                      </StyledTableCell>
                      <StyledTableCell align="right">{user.address}</StyledTableCell>
                      <StyledTableCell align="right">{user.phone_number}</StyledTableCell>
                      <StyledTableCell align="right">
                        {

                          user.hobby ?
                              user.hobby
                            :
                              user.hobbies ?
                                  user.hobbies.join(', ')
                                :
                                  ""
                        }
                      </StyledTableCell>
                      <StyledTableCell component="td">
                        <div className="action-buttons-flex-container">
                          <Tooltip title={"Delete User " + user.first_name + " " + user.last_name} arrow>
                            <Button
                                variant="contained"
                                onClick={() => handleUserAndHobbyDelete(user.id)}
                            >
                              Delete
                            </Button>
                          </Tooltip>
                        </div>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TableResults;