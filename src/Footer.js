import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #f8f9fa;
  padding: 1rem;
  text-align: center;
  border-top: 1px solid #dee2e6;
`;

const Footer = () => {
  return (
    <FooterContainer className="container">
      <p>&copy; 2024 My Shop. All rights reserved.</p>
    </FooterContainer>
  );
};

export default Footer;
