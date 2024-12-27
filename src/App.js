import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';
import Cart from './Cart';
import { CartProvider } from './CartContext';
import styled from 'styled-components';

const MainContainer = styled.div`
  padding-bottom: 60px; /* Высота подвала */
`;

const App = () => {
  return (
    <CartProvider>
      <Router>
        <Header />
        <MainContainer className="container">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/catalog/:category" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </MainContainer>
        <Footer />
      </Router>
    </CartProvider>
  );
};

export default App;
