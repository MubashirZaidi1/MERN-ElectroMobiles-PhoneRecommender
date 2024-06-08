import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { useCart } from './CartContext'; // Import useCart hook
import './css/Home.css'; // Import custom CSS for Home component
import slugify from 'slugify'; // Import slugify library to generate URL-friendly slugs

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { addToCart } = useCart(); // Access addToCart function from CartContext

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get('/api/products/featured');
        setFeaturedProducts(response.data.slice(0, 6)); // Limit to first 6 featured products
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const truncateDescription = (description, maxLength) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + '...';
    }
    return description;
  };


  return (
    <div className="home">
      <header className="header">
        <Container>
          <Row>
            <Col className="header-text">
              <h1>Welcome to Electro Store</h1>
              <p>Discover amazing deals and shop your favorite mobile phones</p>
              <Link to="/products" className="btn btn-primary">
                Shop Now
              </Link>
            </Col>
          </Row>
        </Container>
      </header>

      <section className="featured-products">
        <Container>
          <h2 className="section-title">Featured Products</h2>
          <Row className="productslisting">
            {featuredProducts.map((product) => (
              <Col key={product._id} lg={4} md={6} className="product-item">
              <div className="card">
                <img
                  src={`data:image/jpeg;base64,${product.imageBase64}`}
                  alt={product.name}
                  className="product-image"
                />
                <div className="card__content">
                  <p className="card__title">{product.name}</p>
                  <p className="card__description">{product.description}</p>
                  <div className="product-details">
                    <p className="card__info">Price: ${product.price}</p>
                    <p className="card__info">Ratings: {product.ratings}</p>
                    <p className="card__description"> Description: {product.Description} </p>
                    <Button variant="dark" onClick={() => addToCart(product)}>
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;
