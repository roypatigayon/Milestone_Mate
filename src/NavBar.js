import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar({ user, setUser }) { // Receive user and setUser from props
  const handleLogout = () => {
    // Clear user information
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">MilestoneMate</Link>
      </div>
      {user && (
        <div className="navbar-user">
          <span>Welcome, {user.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

export default NavBar;