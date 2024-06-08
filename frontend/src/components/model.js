import React, { useState } from 'react';
import { useCart } from './CartContext';
import './css/model.css'; // Import CSS file

const PhoneRecommendation = () => {
  const { addToCart } = useCart();
  const [company, setCompany] = useState('');
  const [model, setModel] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = { company, model };

    try {
      const response = await fetch('/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="phone-recommendation-form">
      <div className="form-title"><span>Dive in to the world of</span></div>
      <div className="title-2"><span>AI</span></div>
      <form onSubmit={handleFormSubmit}>
        <div className="input-container">
          <input
            className="input-mail"
            type="text"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </div>

        <section className="bg-stars">
          <span className="star"></span>
          <span className="star"></span>
          <span className="star"></span>
          <span className="star"></span>
        </section>

        <div className="input-container">
          <input
            className="input-pwd"
            type="text"
            placeholder="Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit">
          <span className="sign-text">Get Recommendations</span>
        </button>
      </form>

      <div>
        <h3>Recommendations:</h3>
        {recommendations.map((recommendation, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <h4>{recommendation.name}</h4>
            <p>Ratings: {recommendation.ratings}</p>
            <p>Price: ${recommendation.price}</p>
            <p>Description: {recommendation.description}</p>
            <img
              src={`data:image/jpeg;base64,${recommendation.imageBase64}`}
              alt={recommendation.name}
              style={{ maxWidth: '200px' }}
            />
            <button onClick={() => handleAddToCart(recommendation)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhoneRecommendation;
