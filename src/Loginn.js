import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Loginn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token, user } = response.data; // Extract token and user data from the response

      if (token) {
        // Store the token in localStorage or any other state management solution
        localStorage.setItem('token', token);

        // Store user data in localStorage if needed
        localStorage.setItem('user', JSON.stringify(user));

        navigate('/dashboard');
      }
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  return (
    <div>
      <div className="auth-container">
        <h1>MilestoneMate</h1>
        <form>
          <h2>Welcome</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="auth-button" onClick={handleLogin}>
            Login
          </button>
          <br></br>
          <button className="auth-button" onClick={() => navigate('/register')}>
            Create account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Loginn;


