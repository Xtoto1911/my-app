import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from './CartContext';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
`;

const Dropdown = styled.div`
  position: relative;
  margin-left: 1rem;
`;

const DropdownToggle = styled.button`
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: ${(props) => (props.visible ? 'block' : 'none')};
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 0.5rem 1rem;
  color: #333;
  text-decoration: none;
  &:hover {
    background: #f8f9fa;
  }
`;

const CartLink = styled(Link)`
  position: relative;
  &::after {
    content: '${props => props.count || 0}';
    position: absolute;
    top: -10px;
    right: -10px;
    background-color: #ff5733;
    color: white;
    border-radius: 50%;
    padding: 0.2rem 0.5rem;
    font-size: 0.8rem;
  }
`;

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const [cartCount, setCartCount] = useState(cartItems.length);
  const [categories, setCategories] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/products.json');
        const data = await response.json();
        const uniqueCategories = [...new Set(data.map(item => item.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setCartCount(cartItems.length);
  }, [cartItems]);

  return (
    <HeaderContainer>
      <Link to="/" className="navbar-brand">Logo</Link>
      <Nav>
        <Link to="/" className="nav-link">Catalog</Link>
        <Dropdown>
          <DropdownToggle onClick={() => setDropdownVisible(!dropdownVisible)}>
            Categories
          </DropdownToggle>
          <DropdownMenu visible={dropdownVisible}>
            {categories.map(category => (
              <DropdownItem to={`/catalog/${category}`} key={category} onClick={() => setDropdownVisible(false)}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </Nav>
      <CartLink to="/cart" count={cartCount}>Cart</CartLink>
    </HeaderContainer>
  );
};

export default Header;
