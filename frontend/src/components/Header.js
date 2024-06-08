import React from 'react';
import { AppBar, Toolbar, Button, IconButton, Badge, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import LogoImage from './img/logo.png';
import './css/Header.css';

const Header = ({ setSearchQuery }) => {
  const handleChange = (event) => {
    const searchText = event.target.value;
    setSearchQuery(searchText.trim().toLowerCase());
  };

  return (
    <AppBar position="static" style={{ backgroundColor: '#000000' }}>
      <Toolbar>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 'auto' }}>
          <img src={LogoImage} alt="Logo" style={{ height: 40, marginRight: 10 }} />
        </div>
        
        <Button component={Link} to="/" color="inherit">
          Home
        </Button>
        <Button component={Link} to="/products" color="inherit">
          Products
        </Button>
        <Button component={Link} to="/cart" color="inherit">
          Cart
          <IconButton size="small" color="inherit">
            <Badge color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Button>
        <Button component={Link} to="/checkout" color="inherit">
          Checkout
        </Button>
        <Button component={Link} to="/model" color="inherit">
          Recommend me a phone
        </Button>
        <Button component={Link} to="/admin" color="inherit">
          Admin
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
