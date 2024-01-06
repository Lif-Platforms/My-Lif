import './App.css';
import React from 'react';
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login'; 
import Home from './pages/home';
import Settings from './pages/settings';
import CreateAccount from './pages/create_account';
import ForgetPassword from './pages/forget_password';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/settings/:section" element={<Settings />} />
        <Route path="/create_account" element={<CreateAccount />} />
        <Route path="/account_recovery" element={<ForgetPassword />} />
      </Routes>
  );
}

export default App;
