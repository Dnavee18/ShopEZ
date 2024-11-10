// src/pages/admin/SellerDashboard.js
import React, { useState, useEffect } from 'react';

const SellerDashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from the backend (replace with actual API call)
    setOrders([
      { orderId: '123', status: 'Pending' },
      { orderId: '124', status: 'Shipped' },
    ]);
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    // Handle order status change (send request to backend)
    console.log(`Order ${orderId} status changed to ${newStatus}`);
    // Update local state for now
    setOrders(orders.map(order => 
      order.orderId === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div className="seller-dashboard">
      <h2>Seller Dashboard</h2>
      <h3>Manage Your Orders</h3>
      <ul>
        {orders.map((order) => (
          <li key={order.orderId}>
            Order ID: {order.orderId} - Status: {order.status}
            <button onClick={() => handleStatusChange(order.orderId, 'Shipped')}>Ship</button>
            <button onClick={() => handleStatusChange(order.orderId, 'Delivered')}>Mark as Delivered</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SellerDashboard;
