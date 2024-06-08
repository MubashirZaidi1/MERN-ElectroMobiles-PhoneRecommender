import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './css/ProductDetail.css';

const ProductDetail = () => {
  const { productName } = useParams(); // Get the product name from URL params
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`/api/products/${productName}`);
        setProduct(response.data); // Assuming response.data contains the product details
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };
    

    fetchProductDetails();
  }, [productName]);

  return (
    <div className="product-detail-container">
      {product ? (
        <div className="product-details">
          <h2>{product.name}</h2>
          <img src={`data:image/jpeg;base64,${product.imageBase64}`} alt={product.name} className="product-image" />
          <p>Description: {product.Description}</p>
          <p>Price: ${product.price.toFixed(2)}</p>
          <p>Ratings: {product.ratings}</p>
          {/* Additional details can be displayed here */}
        </div>
      ) : (
        <p>Loading product details...</p>
      )}
    </div>
  );
};

export default ProductDetail;
