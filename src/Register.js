import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState(''); // Added state for name
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      // Include name in the registration data
      await axios.post('http://localhost:5000/api/auth/register', { email, password, name });
      alert('Account created successfully');
      navigate('/login');
    } catch (error) {
      alert('Error creating account');
    }
  };

  return (
    <div className="auth-container">
      <h2>MilestoneMate</h2>
      <form>
        <h3>Create new account</h3>
        <input
          type="text" // Assuming name is a text input
          placeholder="Name" // Adjust placeholder text as needed
          value={name}
          onChange={(e) => setName(e.target.value)} // Update name state
        />
        <br></br>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br></br>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br></br>
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <br></br>
        <button onClick={handleRegister}>Create account</button>
      </form>
    </div>
  );
};

export default Register;



