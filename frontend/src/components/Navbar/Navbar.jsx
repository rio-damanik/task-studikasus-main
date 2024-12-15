// src/components/Navbar/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('token') !== null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-brand-link">
          <h1>POS System</h1>
        </Link>
      </div>
      <div className="navbar-menu">
        <Link to="/" className="navbar-item">
          <FaHome /> Home
        </Link>
        <Link to="/products" className="navbar-item">
          <FaShoppingCart /> Products
        </Link>
        {isLoggedIn ? (
          <>
            <Link to="/admin" className="navbar-item">
              <FaUser /> Admin Panel
            </Link>
            <button onClick={handleLogout} className="navbar-item logout-button">
              <FaSignOutAlt /> Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="navbar-item">
            <FaUser /> Login
          </Link>
        )}
        {totalItems > 0 && (
          <div className="cart-badge">
            {totalItems}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
