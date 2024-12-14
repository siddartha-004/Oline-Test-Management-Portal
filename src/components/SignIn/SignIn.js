
import React, { useState } from 'react';
import './SignIn.css';
import i from '../1.png';
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const [username1, setUsername1] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null); 

    const loginRequest = { username:username1, password };

    try {
      const response = await fetch('http://localhost:8080/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginRequest),
      });

      if (!response.ok) {
      
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Login failed');
      } else {
        const data = await response.json();
        console.log(data);

        console.log('Login successful:', data);
        if (data.isAdmin) {
           
            navigate('/admin');
          } else {
            
            const y=data.userDetails.userId;
            const x=data.userDetails.userName;
            console.log(x,y);
            localStorage.setItem('username',x);
            localStorage.setItem('userid',y);
            navigate('/user-dashboard');
          }
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="sign-in-container">
        <div className="image-container">
         <img src={i} alt="Illustration" className="illustration" />
       </div>
      <div className="sign-in-card">
        <h2>Sign In</h2>
        {errorMessage && (
  <div className="error-message">
    <span>{errorMessage}</span>
    <button className="close-btn" onClick={() => setErrorMessage(null)}>✖</button>
  </div>
)}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username1}
            onChange={(e) => setUsername1(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="submit-btn">➜</button>
        </form>
        

       

        <p className="sign-up-text">
          No Account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
