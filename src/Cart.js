import React, { useContext } from 'react';
import { CartContext } from './CartContext';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const CartContainer = styled.div`
  padding: 1rem;
`;

const CartItem = styled.div`
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  @media (min-width: 600px) {
    flex-direction: row;
    align-items: center;
  }
`;

const Image = styled.img`
  max-width: 100px;
  height: auto;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Price = styled.div`
  font-weight: bold;
  margin-top: 0.5rem;
`;

const Total = styled.div`
  font-weight: bold;
  margin-top: 1rem;
`;

const Cart = () => {
  const { cartItems, updateCartItem, removeFromCart, clearCart, calculateTotal } = useContext(CartContext);

  const handleQuantityChange = (id, newQuantity) => {
    updateCartItem(id, newQuantity);
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  const handleCheckout = () => {
    clearCart();
  };

  return (
    <CartContainer className="container">
      {cartItems.map(item => (
        <CartItem key={item.id} className="card">
          <div className="row">
            <div className="col-md-4">
              <Link to={`/product/${item.id}`}>
                <Image src={item.image} alt={item.name} className="img-fluid" />
              </Link>
            </div>
            <div className="col-md-8">
              <Link to={`/product/${item.id}`} className="card-link">
                <h5 className="card-title">{item.name}</h5>
              </Link>
              <Price className="card-text">${(item.price * item.quantity).toFixed(2)}</Price>
              <QuantityControls className="input-group mb-3">
                <button className="btn btn-secondary" onClick={() => handleQuantityChange(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                <span className="form-control">{item.quantity}</span>
                <button className="btn btn-secondary" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
              </QuantityControls>
              <button className="btn btn-danger" onClick={() => handleRemoveItem(item.id)}>Remove</button>
            </div>
          </div>
        </CartItem>
      ))}
      <Total className="h4">Total: ${calculateTotal().toFixed(2)}</Total>
      <button className="btn btn-primary" onClick={handleCheckout}>Checkout</button>
    </CartContainer>
  );
};

export default Cart;
