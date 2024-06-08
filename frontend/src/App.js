import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import NotFound from './components/NotFound';
import Admin from './components/Admin';
import Home from './components/Home';
import Checkout from './components/Checkout';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import { CartProvider } from './components/CartContext';
import Model from './components/model'

import './App.css'; // Import your CSS for global styles

function App() {
  return (
    <Router>
      <CartProvider> {/* Wrap the entire application with CartProvider */}
        <div className="app">
          {/* Header component rendered on every page */}
          <Header />
          {/* Routes defined for different pages */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:productName" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/model" element={<Model />} />
            <Route path="*" element={<NotFound />} />

          </Routes>
          {/* Footer component rendered on every page */}
          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
