import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import './AddUserForm.css';
import Button from "@mui/material/Button";
import Tooltip from '@mui/material/Tooltip';

const AddUserForm = ({
  firstName,
  lastName,
  address,
  phoneNumber,
  setFirstName,
  setLastName,
  setAddress,
  setPhoneNumber,
  handleSubmit,
  handleCancel,
}) => {
  // Error states for validation
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  const [firstNameHelperText, setFirstNameHelperText] = useState('');
  const [lastNameHelperText, setLastNameHelperText] = useState('');
  const [addressHelperText, setAddressHelperText] = useState('');
  const [phoneHelperText, setPhoneHelperText] = useState('');

  const onValueChange = (value, changeFunction, type) => {
    console.log("Changed Value: " + value);
    changeFunction(value);

    // Validate the fields based on type
    switch (type) {
      case 'firstName':
        if (value.trim() === "" || value === undefined) {
          setFirstNameError(true);
          setFirstNameHelperText("First name is required.");
        } else {
          setFirstNameError(false);
          setFirstNameHelperText('');
        }
        break;
      case 'lastName':
        if (value.trim() === "" || value === undefined) {
          setLastNameError(true);
          setLastNameHelperText("Last name is required.");
        } else {
          setLastNameError(false);
          setLastNameHelperText('');
        }
        break;
      case 'address':
        if (value.trim() === "" || value === undefined) {
          setAddressError(true);
          setAddressHelperText("Address is required.");
        } else {
          setAddressError(false);
          setAddressHelperText('');
        }
        break;
      case 'phone':
        const phoneRegex = /^[0-9]{10}$/; // Validates 10 digit phone number
        if (!phoneRegex.test(value)) {
          setPhoneError(true);
          setPhoneHelperText("Phone number must be 10 digits.");
        } else {
          setPhoneError(false);
          setPhoneHelperText('');
        }
        break;
      default:
        break;
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (firstNameError || lastNameError || addressError || phoneError) {
        console.log('Please fix the errors before submitting.');
        return;
    }
    handleSubmit();
  };

  return (
    <div className="main-user-container">
      <h2>Add New User</h2>
      <form>
        <TextField
          variant="outlined"
          label="First Name"
          className="text-field-all"
          value={firstName}
          onChange={(e) => onValueChange(e.target.value, setFirstName, 'firstName')}
          required
          error={firstNameError}
          helperText={firstNameHelperText}
        />

        <TextField
          variant="outlined"
          label="Last Name"
          className="text-field-all"
          value={lastName}
          onChange={(e) => onValueChange(e.target.value, setLastName, 'lastName')}
          required
          error={lastNameError}
          helperText={lastNameHelperText}
        />

        <TextField
          variant="outlined"
          label="Address"
          className="text-field-all"
          value={address}
          onChange={(e) => onValueChange(e.target.value, setAddress, 'address')}
          required
          error={addressError}
          helperText={addressHelperText}
        />

        <TextField
          variant="outlined"
          label="Phone Number"
          className="text-field-all"
          value={phoneNumber}
          onChange={(e) => onValueChange(e.target.value, setPhoneNumber, 'phone')}
          required
          error={phoneError}
          helperText={phoneHelperText}
        />
      </form>
      <div className="buttons-flex-container">
          <Tooltip title="Click to Add new User" arrow>
            <Button variant="contained" className="submit-btn" onClick={(e) => handleFormSubmit(e)}>Submit</Button>
          </Tooltip>
          <Tooltip title="Click to close the Add User Form" arrow>
            <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
          </Tooltip>
      </div>
    </div>
  );
};

export default AddUserForm;
