import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from './CartContext';
import styled from 'styled-components';

const ProductDetailContainer = styled.div`
  padding: 1rem;
  text-align: center;

  @media (max-width: 600px) {
    padding: 0.5rem;
  }
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
`;

const Price = styled.div`
  font-weight: bold;
  margin-top: 0.5rem;
`;

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/products.json');
        const data = await response.json();
        const product = data.find(item => item.id === Number(id));
        setProduct(product);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product.id, quantity, product.name, product.image, product.price);
  };

  if (!product) return <p>Loading...</p>;

  return (
    <ProductDetailContainer className="container">
      <div className="row">
        <div className="col-md-6">
          <Image src={product.image} alt={product.name} className="img-fluid" />
        </div>
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <Price>${product.price.toFixed(2)}</Price>
          <p>{product.description}</p>
          <div className="input-group mb-3">
            <button className="btn btn-secondary" onClick={() => setQuantity(quantity - 1)} disabled={quantity <= 1}>-</button>
            <input type="number" className="form-control" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
            <button className="btn btn-secondary" onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
          <button className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
    </ProductDetailContainer>
  );
};

export default ProductDetail;
