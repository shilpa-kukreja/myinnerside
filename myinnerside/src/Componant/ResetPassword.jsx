import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import prakritisaLogo from '../assets/Image/logo/my-inner-side1.png';
import '../assets/Css/AuthForms.css';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`https://myinnerside.com/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset successful');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Failed to reset password');
    }
  };

  return (
    <div className="signin_Cont reset-password-container">
      <div className="signin_cont_left">
        <div className="signin_inner_cont reset-password-inner">
          <Link to='/' className="logo-link">
            <img src={prakritisaLogo} alt="logo" width='110px' />
          </Link>

          <div className="login_title reset_title">Reset Password</div>

          <form onSubmit={handleSubmit} className="login_form">
            <div className="form_group password-group">
              <input
                className="form_control"
                type={showPassword ? 'text' : 'password'}
                placeholder='New Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="form_group password-group">
              <input
                className="form_control"
                type={showPassword ? 'text' : 'password'}
                placeholder='Confirm New Password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit" className="login_btn">Reset Password</button>
            {message && <p className='form_message'>{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
