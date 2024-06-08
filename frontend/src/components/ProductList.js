import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from './CartContext';
import { TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import './css/ProductList.css'; // Import custom CSS for Product component

const Product = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products/featured'); // Update with your API endpoint
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    const productWithQuantity = { ...product, quantity: 1 }; // Default quantity is 1
    addToCart(productWithQuantity);
    alert(`${product.name} added to cart!`);
  };
  


  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="product-container">
      <div style={{ display: 'flex', alignItems: 'left', marginBottom: '20px' }}>
        <TextField
          variant="outlined"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton color="inherit" size="large" onClick={() => setSearchQuery('')}>
                <SearchIcon />
              </IconButton>
            ),
            style: { color: 'white' },
          }}
          style={{ marginRight: 10, width: '100%' }}
        />
      </div>
      <h2 className="product-heading">All Products</h2>
      <div className="product-list">
        {filteredProducts.map((product) => (
          <div key={product._id} className="product-item">
            <div className="card">
              <img src={`data:image/jpeg;base64,${product.imageBase64}`} alt={product.name} className="product-image" />
              <div className="card__content">
                <h3 className="card__title">{product.name}</h3>
                <p className="card__info">Ratings: {product.ratings}</p>
                <p className="card__info">Price: ${product.price}</p>
                <p className="card__description">Description: {product.Description}</p>
                <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
