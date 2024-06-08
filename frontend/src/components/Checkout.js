import React, { useState } from 'react';
import axios from 'axios';
import { useCart } from './CartContext';
import './css/Checkout.css';

const Checkout = () => {
  const { cartItems } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    paymentMethod: 'Credit Card', // Default payment method
  });
  const [orderInfo, setOrderInfo] = useState(null); // State to hold order info after submission
  const [trackingNumber, setTrackingNumber] = useState(null); // State to hold tracking number

  // Calculate total bill based on items in cart
  const getTotalBill = () => {
    const totalBill = cartItems.reduce((total, item) => total + parseFloat(item.price), 0);
    return totalBill.toFixed(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const generateTrackingNumber = () => {
    return Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Extract product names from cartItems
      const productNames = cartItems.map((item) => item.name);
  
      // Construct order data with buyerName, buyerEmail, address, paymentMethod, and products
      const orderData = {
        buyerName: formData.name, // Use formData.name for buyerName
        buyerEmail: formData.email, // Use formData.email for buyerEmail
        address: formData.address,
        paymentMethod: formData.paymentMethod,
        products: productNames, // Pass product names instead of IDs
      };
  
      // Send order data to backend API
      const response = await axios.post('/api/orders', orderData);
  
      // Generate random tracking number
      const newTrackingNumber = generateTrackingNumber();
      setTrackingNumber(newTrackingNumber);
  
      // Set the order info state with response data
      setOrderInfo({
        orderId: response.data._id,
        customerName: formData.name,
        customerEmail: formData.email,
        products: cartItems,
      });
  
      // Reset form data after successful submission
      setFormData({
        name: '',
        email: '',
        address: '',
        paymentMethod: 'Credit Card',
      });
    } catch (error) {
      console.error('Error submitting order:', error);
      // Handle error or show error message to the user
    }
  };

  return (
    <div className="container mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-4 text-center">Proceed to Checkout</h2>
      {orderInfo ? (
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Order Confirmation</h3>
          <p className="text-gray-700 mb-2">Order ID: {orderInfo.orderId}</p>
          <p className="text-gray-700 mb-4">Name: {orderInfo.customerName}</p>
          <p className="text-gray-700 mb-4">Email: {orderInfo.customerEmail}</p>
          <h4 className="text-lg font-semibold mb-2">Products:</h4>
          <ul className="order-list">
            {orderInfo.products.map((product, index) => (
              <li key={index} className="order-item">
                <div className="item-details">
                  <img src={product.imageUrl} alt={product.name} className="item-image" />
                  <div className="item-info">
                    <p className="item-name">{product.name}</p>
                    <p className="item-price">${product.price}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {/* Display tracking number */}
          {trackingNumber && (
            <p className="text-red-600 font-semibold mt-4">
              Order has been placed! Here's your tracking number: {trackingNumber}
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-4">
          {/* Name Input */}
          <div className="input-container">
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className="input w-full"
              required
            />
            <label htmlFor="name" className="label">
              Enter Your Name
            </label>
          </div>

          {/* Email Input */}
          <div className="input-container">
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input w-full"
              placeholder="Enter Your Email"
              required
            />
            <label htmlFor="email" className="label">
              Enter Your Email
            </label>
          </div>

          {/* Address Textarea */}
          <div className="input-container">
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="input w-full"
              placeholder="Address"
              required
            />
            <label htmlFor="address" className="label">
              Enter Your Address
            </label>
          </div>

          {/* Payment Method Select */}
          <div className="flex justify-center">
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="input w-full"
            >
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="button-place-order">
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded"
            >
              Place Order
            </button>
          </div>
        </form>
      )}
      {/* Display total bill if order is confirmed */}
      {orderInfo && (
        <p className="text-xl font-semibold mt-4 text-center">Total Bill: ${getTotalBill()}</p>
      )}
    </div>
  );
};

export default Checkout;
