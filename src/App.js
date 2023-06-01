import './App.css';
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login'; 

function Home() {
  return (
    <div className="App">
      <header>
        <h1>Welcome Back [Your Name]</h1>
      </header>
    </div>
  );
}

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
  );
}

export default App;
