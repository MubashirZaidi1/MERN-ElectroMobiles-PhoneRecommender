import React from 'react';
import { useLocation } from 'react-router-dom';

const Confirmation = () => {
  const location = useLocation();
  const { orderId, orderDetails } = location.state || {};

  return (
    <div>
      <h2>Order Confirmation</h2>
      <p>Order ID: {orderId}</p>
      <h3>Order Details:</h3>
      <ul>
        {orderDetails.map((item) => (
          <li key={item._id}>
            <p>{item.name} - ${item.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Confirmation;
