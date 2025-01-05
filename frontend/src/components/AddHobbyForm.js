import React, { useState } from 'react';
import './AddHobbyForm.css'; // Import the styles
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

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
      <div className="hobby-form-label-container">
        <FormLabel>Hobby Form</FormLabel>
      </div>
      <div className="hobby-form-helper-text-container">
        <FormHelperText>Associate a hobby to a user</FormHelperText>
      </div>
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
          <Tooltip title="Click to associate a hobby to a user" arrow>
            <Button variant="contained" className="submit-btn" onClick={(e) => handleFormSubmit(e)}>Submit</Button>
          </Tooltip>
          <Tooltip title="Click to close the Hobby Form" arrow>
            <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
          </Tooltip>
      </div>
      {status && <p className={`status-message ${status.includes('Error') ? 'error' : ''}`}>{status}</p>}
    </div>
  );
};

export default AddHobbyForm;
