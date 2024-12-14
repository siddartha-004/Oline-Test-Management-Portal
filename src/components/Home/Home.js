import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; 

function HomePage() {
  return (
    <div className="home">
      <div className="left">
        <img
          src="https://img.freepik.com/premium-vector/t-letter-logo-design_600957-191.jpg" 
          alt="Logo"
          className="logo"
        />
        <div className='content'>
        <h1 className='heading'>Online Test Management Portal</h1>
        <div className="button-container">
          <Link to="/signin"><button className="btn login-btn">Login</button></Link>
          <button className="btn signup-btn">Signup</button>
        </div>
        </div>
      </div>

      <div className="right">
        <img
          src="https://guidetechy.com/image/articles/step-2-check-system-requirements-8268bff2-4bd7-4682-9991-63269db03e95.jpg?w=900" 
          alt="Developer pic"
          className="pic"
        />
      </div>
    </div>
  );
}

export default HomePage;
