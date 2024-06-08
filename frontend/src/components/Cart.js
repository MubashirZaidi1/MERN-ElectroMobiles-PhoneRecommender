// Cart.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import './css/Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();

  const getTotalBill = () => {
    const totalBill = cartItems.reduce((total, item) => {
      const quantity = item.quantity || 1; // Default to 1 if quantity is not set
      const price = parseFloat(item.price) || 0;
      return total + price * quantity;
    }, 0);

    const formattedTotalBill = totalBill.toFixed(2);
    return formattedTotalBill;
  };

  return (
    <section className="cart-container">
      <h2 className="cart-title">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => {
            const quantity = parseInt(item.quantity, 10) || 0;
            const price = parseFloat(item.price) || 0;
            console.log(`Item: ${item.name}, Quantity: ${quantity}, Price: ${price}`);

            return (
              <div key={item.name} className="cart-item"> {/* Use item.name as key */}
                <div className="item-image">
                  <img
                    src={`data:image/jpeg;base64,${item.imageBase64}`}
                    alt={item.name}
                    className="product-image"
                  />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  {/* Display other item details */}
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${price}</p>
                  <button onClick={() => removeFromCart(item.name)}>Remove</button> {/* Pass item.name to removeFromCart */}
                </div>
              </div>
            );
          })}
          <div className="cart-summary">
            <p>Total Items: {cartItems.length}</p>
            <p>Total Bill: ${getTotalBill()}</p>
            <Link to="/checkout" className="checkout-button">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default Cart;
