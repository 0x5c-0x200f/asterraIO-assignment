import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AddUserForm from './AddUserForm';
import AddHobbyForm from './AddHobbyForm';
import TableResults from './TableResults';
import './AppContainer.css'; // Optional: Add styles

const AppContainer = () => {
  return (
      <div>
        <TableResults />
      </div>
  );
};

export default AppContainer;
