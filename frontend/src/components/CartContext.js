// CartContext.js
import React, { createContext, useState, useContext } from 'react';

// Create context
const CartContext = createContext();

// Custom hook to use cart context
export const useCart = () => {
  return useContext(CartContext);
};

// Cart provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    const { name, price, imageBase64 } = product;
    const existingItem = cartItems.find((item) => item.name === name);

    if (existingItem) {
      // Item already exists in cart, update quantity
      const updatedCartItems = cartItems.map((item) =>
        item.name === name ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCartItems(updatedCartItems);
    } else {
      // Item does not exist in cart, add it with quantity = 1
      setCartItems([...cartItems, { name, price, imageBase64, quantity: 1 }]);
    }
  };

  const removeFromCart = (productName) => {
    const updatedCart = cartItems.filter((item) => item.name !== productName);
    setCartItems(updatedCart);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
