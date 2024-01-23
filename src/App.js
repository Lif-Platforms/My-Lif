import "./App.css";
import React from "react";
// eslint-disable-next-line
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login"; 
import Home from "./pages/home";
import Settings from "./pages/settings";
import CreateAccount from "./pages/create_account";
import ForgetPassword from "./pages/forget_password";

function App() {
  // Define variables for all route components
  const home_element = <Home />;
  const login_element = <Login />;
  const settings_element = <Settings />;
  const create_account_element = <CreateAccount />;
  const forget_password_element = <ForgetPassword />

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={home_element} />
        <Route path="/login" element={login_element} />
        <Route path="/settings/:section" element={settings_element} />
        <Route path="/create_account" element={create_account_element} />
        <Route path="/account_recovery" element={forget_password_element} />
      </Routes>
    </BrowserRouter>  
  );
}

export default App;
