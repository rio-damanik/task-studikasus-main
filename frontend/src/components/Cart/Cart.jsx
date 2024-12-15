import React, { useState } from 'react';
import { FaShoppingCart, FaTimes, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import './Cart.css';

// Helper function to format numbers as Rupiah currency
const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(number);
};

const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    cart,
    customerName,
    setCustomerName,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice
  } = useCart();

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckout = () => {
    if (!customerName.trim()) {
      alert('Please enter your name before checking out');
      return;
    }
    
    const orderSummary = `
      Order Summary for ${customerName}:
      ${cart.map(item => `
        - ${item.product.name} x${item.quantity} = ${formatRupiah(item.product.price * item.quantity)}`).join('')}
      
      Total: ${formatRupiah(getTotalPrice())}
    `;
    
    alert(orderSummary);
    clearCart();
    setIsOpen(false);
  };

  return (
    <>
      <button className="cart-toggle" onClick={toggleCart}>
        <FaShoppingCart />
        <span>Cart</span>
        {cart.length > 0 && (
          <span className="cart-count">
            {cart.reduce((total, item) => total + item.quantity, 0)}
          </span>
        )}
      </button>

      <div className={`cart-section ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button className="close-cart" onClick={toggleCart}>
            <FaTimes />
          </button>
        </div>

        <input
          type="text"
          className="customer-name-input"
          placeholder="Enter your name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.product._id} className="cart-item">
                  <div className="cart-item-image">
                    {item.product.image_url ? (
                      <img
                        src={`http://localhost:3001/images/products/${item.product.image_url}`}
                        alt={item.product.name}
                      />
                    ) : (
                      <div className="placeholder-image">
                        {item.product.name[0]}
                      </div>
                    )}
                  </div>
                  <div className="cart-item-details">
                    <h4>{item.product.name}</h4>
                    <p className="cart-item-price">
                      {formatRupiah(item.product.price)}
                    </p>
                    <div className="quantity-selector">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                  <button
                    className="remove-item"
                    onClick={() => removeFromCart(item.product._id)}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-total">
              Total: {formatRupiah(getTotalPrice())}
            </div>

            <button
              className="checkout-button"
              onClick={handleCheckout}
              disabled={!customerName.trim()}
            >
              Checkout
            </button>
          </>
        )}
      </div>
    </>
import React, { useState } from "react";
import "./Cart.css";

// Helper function to format numbers as Rupiah currency
const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(number);
};

const Cart = () => {
  // Mock cart data
  const [cart, setCart] = useState({
    recipient_name: "Jane Doe", // Add recipient's name
    cartItems: [
      { id: "1", name: "Burger", price: 20000, quantity: 2 },
      { id: "2", name: "Cake", price: 15000, quantity: 1 },
      { id: "3", name: "Coffee", price: 10000, quantity: 3 },
    ],
  });

  const calculateTotal = () => {
    return cart.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>

      <div className="cart-details">
        {/* Displaying the recipient's name */}
        <div className="cart-recipient">
          <h3>Recipient</h3>
          <p>{cart.recipient_name}</p>
        </div>

        <div className="cart-items">
          {cart.cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="item-details">
                <span className="item-name">{item.name}</span>
                <span className="item-quantity">x{item.quantity}</span>
              </div>
              <div className="item-price">{formatRupiah(item.price * item.quantity)}</div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-item total">
            <span>Total:</span>
            <span>{formatRupiah(calculateTotal())}</span>
          </div>
        </div>

        <button className="cart-button">Checkout</button>
      </div>
    </div>
  );
};

export default Cart;
