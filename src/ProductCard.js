import React, { useState, useContext } from 'react';
import { CartContext } from './CartContext';  // Импортируем контекст корзины для добавления товаров
import styled from 'styled-components';  // Для стилизации компонентов с использованием styled-components
import { Link } from 'react-router-dom';  // Для создания ссылок на другие страницы

// Стилизация контейнера карточки продукта
const CardContainer = styled.div`
  border: 1px solid #dee2e6;  // Граница карточки
  border-radius: 8px;  // Скругление углов
  padding: 1rem;  // Отступы внутри карточки
  text-align: center;  // Выравнивание текста по центру
  width: 200px;  // Фиксированная ширина для карточки
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);  // Тень для карточки
  position: relative;  // Позиционирование для кнопки быстрого просмотра

  @media (max-width: 600px) {
    width: 100%;  // Карточка растягивается на всю ширину на мобильных устройствах
  }
`;

// Стилизация изображения продукта
const Image = styled.img`
  max-width: 100%;  // Изображение не выходит за пределы контейнера
  height: auto;  // Автоматическая высота для сохранения пропорций
`;

// Стилизация модального окна для быстрого просмотра
const QuickViewContainer = styled.div`
  display: ${props => (props.visible ? 'block' : 'none')};  // Показываем окно, если visible = true
  position: fixed;
  top: 50%;  // Центрирование окна по вертикали
  left: 50%;  // Центрирование окна по горизонтали
  transform: translate(-50%, -50%);  // Центрирование через трансформацию
  background: white;  // Белый фон
  padding: 2rem;  // Отступы внутри модального окна
  border: 1px solid #dee2e6;  // Граница для модального окна
  border-radius: 8px;  // Скругление углов
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);  // Тень
  z-index: 1000;  // Устанавливаем на верхний слой

  @media (max-width: 600px) {
    width: 90%;  // Модальное окно занимает 90% ширины на мобильных устройствах
  }
`;

// Стилизация оверлея для модального окна
const QuickViewOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;  // Оверлей на весь экран
  height: 100%;
  background: rgba(0, 0, 0, 0.5);  // Полупрозрачный черный фон
  z-index: 999;  // Слой ниже модального окна
`;

// Стилизация панели управления количеством
const QuantityControls = styled.div`
  display: flex;
  align-items: center;  // Выравнивание по вертикали
  gap: 0.5rem;  // Отступы между кнопками
`;

// Стилизация цены
const Price = styled.div`
  font-weight: bold;  // Жирный шрифт для цены
  margin-top: 0.5rem;  // Отступ сверху
`;

// Основной компонент карточки продукта
const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);  // Состояние для отслеживания количества
  const [showQuickView, setShowQuickView] = useState(false);  // Состояние для отображения модального окна быстрого просмотра
  const { addToCart, clearCart } = useContext(CartContext);  // Используем контекст корзины

  // Функция добавления товара в корзину
  const handleAddToCart = (quantity) => {
    addToCart(product.id, quantity, product.name, product.image, product.price);  // Добавляем товар в корзину
    setShowQuickView(false);  // Закрываем модальное окно после добавления
  };

  // Функция для перехода к оформлению заказа
  const handleCheckout = () => {
    clearCart();  // Очищаем корзину
    setShowQuickView(false);  // Закрываем модальное окно
  };

  return (
    <CardContainer className="card">
      {/* Ссылка на страницу с подробным описанием продукта */}
      <Link to={`/product/${product.id}`} className="card-link">
        <Image src={product.image} alt={product.name} className="card-img-top" />
        <div className="card-body">
          <h5 className="card-title">{product.name}</h5>
        </div>
      </Link>
      {/* Отображение цены продукта */}
      <Price className="card-text">${product.price.toFixed(2)}</Price>
      {/* Кнопка добавления в корзину */}
      <button className="btn btn-primary" onClick={() => handleAddToCart(1)}>Add to Cart</button>
      {/* Кнопка для быстрого просмотра товара */}
      <button className="btn btn-secondary" onClick={() => setShowQuickView(true)}>Quick View</button>

      {/* Модальное окно быстрого просмотра товара */}
      {showQuickView && (
        <>
          {/* Оверлей для затемнения фона */}
          <QuickViewOverlay onClick={() => setShowQuickView(false)} />
          {/* Модальное окно с подробностями товара */}
          <QuickViewContainer visible={showQuickView ? 'true' : undefined}>
            <Image src={product.image} alt={product.name} className="card-img-top" />
            <h5 className="card-title">{product.name}</h5>
            <Price className="card-text">${product.price.toFixed(2)}</Price>

            {/* Панель управления количеством товара */}
            <QuantityControls>
              <button className="btn btn-secondary" onClick={() => setQuantity(quantity - 1)} disabled={quantity <= 1}>-</button>
              <span>{quantity}</span>
              <button className="btn btn-secondary" onClick={() => setQuantity(quantity + 1)}>+</button>
            </QuantityControls>

            {/* Кнопка добавления в корзину с выбранным количеством */}
            <button className="btn btn-primary" onClick={() => handleAddToCart(quantity)}>Add to Cart</button>
            {/* Кнопка оформления заказа */}
            <button className="btn btn-danger" onClick={handleCheckout}>Checkout</button>
          </QuickViewContainer>
        </>
      )}
    </CardContainer>
  );
};

export default ProductCard;
