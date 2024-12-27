import React, { useContext, useState } from 'react';
import { CartContext } from './CartContext'; // Импортируем контекст корзины для получения данных корзины
import styled from 'styled-components'; // Используем styled-components для стилизации компонентов
import { Link } from 'react-router-dom'; // Импортируем Link для создания ссылок на страницы товаров

// Контейнер для всей страницы корзины
const CartContainer = styled.div`
  padding: 1rem;
`;

// Стилизованный компонент для отображения каждого товара в корзине
const CartItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;

  // Для больших экранов не позволяет оборачивать элементы
  @media (min-width: 768px) {
    flex-wrap: nowrap;
  }
`;

// Стилизованный компонент для изображения товара
const ImageWrapper = styled.div`
  flex: 0 0 100px;
  max-width: 100px;
  margin-right: 1rem;

  img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }
`;

// Стилизованный компонент для информации о товаре
const InfoWrapper = styled.div`
  flex: 1;
  margin-right: 1rem;
  text-align: left;

  h5 {
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  .price {
    font-weight: bold;
    color: #555;
    margin-bottom: 0.5rem;
  }
`;

// Стилизованный компонент для управления количеством товаров
const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 1rem;

  button {
    min-width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #dee2e6;
    background: #f8f9fa;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  span {
    min-width: 40px;
    text-align: center;
    font-size: 1rem;
  }
`;

// Стилизованный компонент для кнопки удаления товара из корзины
const RemoveButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: #c82333;
  }
`;

// Стилизованный компонент для отображения общей суммы корзины
const Total = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: right;
  margin-top: 1rem;
`;

// Стилизованный компонент для кнопки оформления заказа
const CheckoutButton = styled.button`
  display: block;
  width: 100%;
  max-width: 300px;
  margin: 2rem auto 0;
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;

// Стилизованный компонент для сообщения благодарности после покупки
const ThankYouMessage = styled.div`
  font-size: 1.5rem;
  color: green;
  text-align: center;
  margin-top: 2rem;
`;

const Cart = () => {
  // Используем контекст корзины для получения данных и функций
  const { cartItems, updateCartItem, removeFromCart, clearCart, calculateTotal } = useContext(CartContext);
  const [purchased, setPurchased] = useState(false); // Состояние для отображения сообщения после оформления заказа

  // Функция для изменения количества товара
  const handleQuantityChange = (id, newQuantity) => {
    updateCartItem(id, newQuantity);
  };

  // Функция для удаления товара из корзины
  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  // Функция для оформления заказа
  const handleCheckout = () => {
    clearCart(); // Очищаем корзину после оформления заказа
    setPurchased(true); // Устанавливаем состояние purchased в true для отображения сообщения
  };

  // Если корзина пуста, выводим сообщение
  if (cartItems.length === 0) {
    return <CartContainer>Корзина пуста</CartContainer>;
  }

  return (
    <CartContainer className="container">
      {/* Перебираем все товары в корзине и отображаем их */}
      {cartItems.map((item) => (
        <CartItem key={item.id}>
          <ImageWrapper>
            {/* Ссылка на страницу товара с изображением */}
            <Link to={`/product/${item.id}`}>
              <img src={item.image} alt={item.name} />
            </Link>
          </ImageWrapper>
          <InfoWrapper>
            <Link to={`/product/${item.id}`}>
              {/* Название товара, которое ведет на страницу товара */}
              <h5>{item.name}</h5>
            </Link>
            <div className="price">${(item.price * item.quantity).toFixed(2)}</div>
            <QuantityControls>
              {/* Кнопки для изменения количества товара */}
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1} // Отключаем кнопку "-" если количество товара <= 1
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
            </QuantityControls>
          </InfoWrapper>
          {/* Кнопка для удаления товара из корзины */}
          <RemoveButton onClick={() => handleRemoveItem(item.id)}>Remove</RemoveButton>
        </CartItem>
      ))}

      {/* Если корзина не пуста, показываем итоговую сумму и кнопку оформления заказа */}
      {!purchased && (
        <>
          <Total>Total: ${calculateTotal().toFixed(2)}</Total> {/* Общая сумма товаров в корзине */}
          <CheckoutButton onClick={handleCheckout}>Checkout</CheckoutButton> {/* Кнопка оформления заказа */}
        </>
      )}

      {/* Если заказ оформлен, показываем сообщение благодарности */}
      {purchased && <ThankYouMessage>Спасибо за покупку!</ThankYouMessage>}
    </CartContainer>
  );
};

export default Cart;
