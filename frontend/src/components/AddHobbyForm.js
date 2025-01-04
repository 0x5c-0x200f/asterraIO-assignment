import React, { useState } from 'react';
import './AddHobbyForm.css'; // Import the styles
import { Tooltip, Button, TextField, FormControl, InputLabel, MenuItem, Select, OutlinedInput } from '@mui/material';

const AddHobbyForm = ({
  users,
  userId,
  hobby,
  setHobby,
  setUserId,
  handleSubmit,
  handleCancel
}) => {
  const [status, setStatus] = useState('');
  const [userIdError, setUserIdError] = useState(false);
  const [userIdHelperText, setUserIdHelperText] = useState('');
  const [hobbyError, setHobbyError] = useState(false);
  const [hobbyHelperText, setHobbyHelperText] = useState('');

  const handleSelectedUserChange = (e) => {
    const selectedUserId = e.target.value;
    setUserId(selectedUserId);

    if (!selectedUserId) {
      setUserIdError(true);
      setUserIdHelperText('Please select a user.');
    } else {
      setUserIdError(false);
      setUserIdHelperText('');
    }
  };

  const handleHobbyChange = (e) => {
    const hobbyValue = e.target.value;
    setHobby(hobbyValue);

    if (hobbyValue.trim() === "" || !hobbyValue) {
      setHobbyError(true);
      setHobbyHelperText('Hobby is required.');
    } else {
      setHobbyError(false);
      setHobbyHelperText('');
    }
  };

  const handleFormSubmit = (e) => {
      e.preventDefault();
    // Check for validation errors before submitting
    if (userIdError || hobbyError) {
      console.log('Please fix the errors before submitting.');
      return;
    }
    // If no errors, call handleSubmit from props
    handleSubmit();
  };

  return (
    <div className="main-hobby-container">
      <h2>Add Hobby</h2>
      <form>
        <FormControl sx={{ m: 1, minWidth: 80 }} error={userIdError}>
          <InputLabel>Users</InputLabel>
          <Select
            value={userId}
            onChange={handleSelectedUserChange}
            label="Users"
            inputProps={{ 'aria-label': 'Without label' }}
          >
            {!users.length ? (
              <MenuItem disabled value="">
                <em>No Data</em>
              </MenuItem>
            ) : (
              users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.first_name + ' ' + user.last_name}
                </MenuItem>
              ))
            )}
          </Select>
          {userIdError && <div className="helper-text">{userIdHelperText}</div>}
        </FormControl>

        <div className="text-field-container">
          <TextField
            variant="outlined"
            label="My Hobby"
            value={hobby}
            onChange={handleHobbyChange}
            required
            error={hobbyError}
            helperText={hobbyHelperText}
          />
        </div>
      </form>
      <div className="buttons-flex-hobby-container">
          <Tooltip title="Click to Add new Hobby to User" arrow>
            <Button variant="contained" className="submit-btn" onClick={(e) => handleFormSubmit(e)}>Submit</Button>
          </Tooltip>
          <Tooltip title="Click to close the Add Hobby Form" arrow>
            <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
          </Tooltip>
      </div>
      {status && <p className={`status-message ${status.includes('Error') ? 'error' : ''}`}>{status}</p>}
    </div>
  );
};

export default AddHobbyForm;
