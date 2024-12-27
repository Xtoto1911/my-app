import React, { useState, useContext } from 'react';
import { CartContext } from './CartContext';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const CardContainer = styled.div`
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  width: 200px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
`;

const QuickViewContainer = styled.div`
  display: ${props => (props.visible ? 'block' : 'none')};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  @media (max-width: 600px) {
    width: 90%;
  }
`;

const QuickViewOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
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

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [showQuickView, setShowQuickView] = useState(false);
  const { addToCart, clearCart } = useContext(CartContext);

  const handleAddToCart = (quantity) => {
    addToCart(product.id, quantity, product.name, product.image, product.price);
    setShowQuickView(false);
  };

  const handleCheckout = () => {
    clearCart();
    setShowQuickView(false);
  };

  return (
    <CardContainer className="card">
      <Link to={`/product/${product.id}`} className="card-link">
        <Image src={product.image} alt={product.name} className="card-img-top" />
        <div className="card-body">
          <h5 className="card-title">{product.name}</h5>
        </div>
      </Link>
      <Price className="card-text">${product.price.toFixed(2)}</Price>
      <button className="btn btn-primary" onClick={() => handleAddToCart(1)}>Add to Cart</button>
      <button className="btn btn-secondary" onClick={() => setShowQuickView(true)}>Quick View</button>
      {showQuickView && (
        <>
          <QuickViewOverlay onClick={() => setShowQuickView(false)} />
          <QuickViewContainer visible={showQuickView ? 'true' : undefined}>
            <Image src={product.image} alt={product.name} className="card-img-top" />
            <h5 className="card-title">{product.name}</h5>
            <Price className="card-text">${product.price.toFixed(2)}</Price>
            <QuantityControls>
              <button className="btn btn-secondary" onClick={() => setQuantity(quantity - 1)} disabled={quantity <= 1}>-</button>
              <span>{quantity}</span>
              <button className="btn btn-secondary" onClick={() => setQuantity(quantity + 1)}>+</button>
            </QuantityControls>
            <button className="btn btn-primary" onClick={() => handleAddToCart(quantity)}>Add to Cart</button>
            <button className="btn btn-danger" onClick={handleCheckout}>Checkout</button>
          </QuickViewContainer>
        </>
      )}
    </CardContainer>
  );
};

export default ProductCard;
