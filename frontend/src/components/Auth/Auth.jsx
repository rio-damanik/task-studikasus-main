import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' // default role
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login
        const response = await axios.post('http://localhost:3001/api/auth/login', {
          email: formData.email,
          password: formData.password
        });

        console.log('Login response:', response.data);

        if (response.data && !response.data.error) {
          const { token, user } = response.data;
          login(token, user);
          // Redirect based on role
          if (user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/products');
          }
        } else {
          setError(response.data.message || 'Login failed. Please check your credentials.');
        }
      } else {
        // Register
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          setLoading(false);
          return;
        }

        console.log('Sending registration data:', {
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });

        const response = await axios.post('http://localhost:3001/api/auth/register', {
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });

        console.log('Registration response:', response.data);

        if (response.data && !response.data._id) {
          // If we get an error response from the server
          setError(response.data.message || 'Registration failed. Please check your information.');
        } else {
          // Successful registration
          setIsLogin(true);
          setFormData({
            full_name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'user'
          });
          setError('Registration successful! Please login.');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        setError(err.response.data.message || err.response.data.fields?.email || 'Registration failed. Please try again.');
      } else if (err.request) {
        console.error('Error request:', err.request);
        setError('Network error. Please check your connection.');
      } else {
        console.error('Error message:', err.message);
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      full_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user'
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Full Name:</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                disabled={loading}
                minLength={2}
                maxLength={100}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label>Confirm Password:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
              <div className="form-group">
                <label>Role:</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          )}

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? `${isLogin ? 'Logging in...' : 'Registering...'}` : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <div className="auth-links">
          <button 
            onClick={toggleAuthMode} 
            className="toggle-mode"
            disabled={loading}
          >
            {isLogin ? "Don't have an account? Register here" : 'Already have an account? Login here'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
