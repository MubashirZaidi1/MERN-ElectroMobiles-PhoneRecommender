import React, { useState } from 'react';
import axios from 'axios';
import './css/Dashboard.css';


const Dashboard = () => {
  const [formData, setFormData] = useState({
    name: '',
    ratings: '',
    price: '',
    imageURL: '',
    corpus: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

 
 const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/mobilephones', formData);
      console.log('Mobile phone added:', response.data);
      setFormData({ name: '', ratings: '', price: '', imageURL: '', corpus: '' });
      alert('Mobile phone added successfully!');
    } catch (error) {
      console.error('Error adding mobile phone:', error);
      alert('Failed to add mobile phone. Please try again.');
    }
  };
  
  return (
    <div className="dashboard-wrapper">
      <h1>Welcome to the Dashboard!</h1>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <label>Ratings:</label>
        <input
          type="number"
          name="ratings"
          value={formData.ratings}
          onChange={handleChange}
          step="0.1"
          min="0"
          max="5"
          required
        />
        <label>Price:</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <label>Image URL:</label>
        <input
          type="url"
          name="imageURL"
          value={formData.imageURL}
          onChange={handleChange}
          required
        />
        <label>Corpus:</label>
        <textarea
          name="corpus"
          value={formData.corpus}
          onChange={handleChange}
          required
        />
        <button  type="submit">Add Mobile Phone</button>
      </form>
    </div>
  );
};

export default Dashboard;
