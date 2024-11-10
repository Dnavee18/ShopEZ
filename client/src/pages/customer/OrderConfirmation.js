// src/pages/customer/OrderConfirmation.js
import React from 'react';
import { Link } from 'react-router-dom';

const OrderConfirmation = () => {
  return (
    <div className="order-confirmation">
      <h2>Order Confirmation</h2>
      <p>Thank you for your order! Your order has been successfully placed.</p>
      <p>You will receive an email with your order details shortly.</p>
      <div>
        <h3>Order Summary:</h3>
        <ul>
          {/* Add dynamic order summary here */}
          <li>Product 1 - $20</li>
          <li>Product 2 - $15</li>
        </ul>
        <strong>Total: $35</strong>
      </div>
      <Link to="/">Return to Home</Link>
    </div>
  );
};

export default OrderConfirmation;
