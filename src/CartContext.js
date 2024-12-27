import React, { createContext, useState, useEffect } from 'react';

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (id, quantity, name, image, price) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === id);
      if (existingItem) {
        return prevItems; // Если товар уже в корзине, ничего не делаем
      } else {
        const newItems = [...prevItems, { id, quantity, name, image, price }];
        updateCartCount(newItems.length);
        return newItems;
      }
    });
  };

  const updateCartItem = (id, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== id);
      updateCartCount(newItems.length);
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    updateCartCount(0);
  };

  const updateCartCount = (count) => {
    document.dispatchEvent(new CustomEvent('cartUpdate', { detail: count }));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateCartItem, removeFromCart, clearCart, calculateTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };
