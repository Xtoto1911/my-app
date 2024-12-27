import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from './CartContext';  // Контекст для управления корзиной
import styled from 'styled-components';  // Для стилизации с использованием styled-components

// Стилизация контейнера для отображения деталей продукта
const ProductDetailContainer = styled.div`
  display: flex;
  flex-direction: column; // Оформляем содержимое в колонку
  align-items: center; // Выравнивание по центру
  gap: 1.5rem; // Отступы между элементами
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem; // Уменьшаем отступы для мобильных устройств
  }
`;

// Стилизация изображения продукта
const Image = styled.img`
  max-width: 100%;  // Ограничиваем максимальную ширину изображения
  height: auto;  // Автоматическое изменение высоты для сохранения пропорций
  border-radius: 8px;  // Скругление углов
  object-fit: contain;  // Сохраняем соотношение сторон изображения
`;

// Стилизация заголовка с названием продукта
const Title = styled.h2`
  font-size: 1.8rem;  // Размер шрифта
  text-align: center;  // Выравнивание по центру
`;

// Стилизация цены продукта
const Price = styled.div`
  font-weight: bold;  // Жирный шрифт
  font-size: 1.5rem;  // Размер шрифта
  color: #007bff;  // Цвет текста (синий)
`;

// Стилизация описания продукта
const Description = styled.p`
  color: #555;  // Цвет текста (темно-серый)
  line-height: 1.5;  // Межстрочный интервал
  text-align: center;  // Выравнивание по центру
  max-width: 600px;  // Ограничиваем максимальную ширину для удобства чтения
`;

// Стилизация управления количеством товара
const QuantityControls = styled.div`
  display: flex;  // Выводим кнопки и количество в строку
  align-items: center;  // Выравниваем по вертикали
  gap: 0.5rem;  // Отступы между кнопками

  button {
    width: 40px;  // Ширина кнопок
    height: 40px;  // Высота кнопок
    font-size: 1.2rem;  // Размер шрифта
    background: #f8f9fa;  // Цвет фона (светло-серый)
    border: 1px solid #dee2e6;  // Светлая граница
    border-radius: 4px;  // Скругление углов
    cursor: pointer;  // Курсор в виде руки

    &:disabled {
      opacity: 0.6;  // Ожидаемая прозрачность для отключенной кнопки
      cursor: not-allowed;  // Курсор для отключенной кнопки
    }
  }

  span {
    width: 40px;  // Ширина отображаемого числа
    height: 40px;  // Высота отображаемого числа
    display: flex;  // Выравниваем число по центру
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    border: 1px solid #dee2e6;  // Граница для отображения числа
    border-radius: 4px;
    background: #f8f9fa;  // Цвет фона для числа
  }
`;

// Стилизация кнопки для добавления товара в корзину
const AddToCartButton = styled.button`
  padding: 0.75rem 1.5rem;  // Отступы внутри кнопки
  font-size: 1rem;  // Размер шрифта
  font-weight: bold;  // Жирный шрифт
  color: white;  // Цвет текста (белый)
  background: #007bff;  // Цвет фона (синий)
  border: none;  // Без границы
  border-radius: 4px;  // Скругление углов
  cursor: pointer;  // Курсор в виде руки

  &:hover {
    background: #0056b3;  // Темный синий цвет при наведении
  }
`;

const ProductDetail = () => {
  const { id } = useParams();  // Получаем id продукта из параметров маршрута
  const [product, setProduct] = useState(null);  // Состояние для хранения информации о продукте
  const [quantity, setQuantity] = useState(1);  // Состояние для количества продукта
  const { addToCart } = useContext(CartContext);  // Используем контекст корзины для добавления в корзину

  // useEffect для загрузки информации о продукте при изменении id
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/products.json');  // Запрашиваем данные о продуктах
        const data = await response.json();  // Получаем данные в формате JSON
        const product = data.find((item) => item.id === Number(id));  // Ищем продукт по id
        setProduct(product);  // Устанавливаем продукт в состояние
      } catch (error) {
        console.error('Error fetching product:', error);  // Обработка ошибки при запросе
      }
    };

    fetchProduct();  // Вызываем функцию загрузки данных
  }, [id]);  // Эффект срабатывает при изменении id

  // Функция для добавления товара в корзину
  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity, product.name, product.image, product.price);  // Добавляем продукт в корзину
    }
  };

  if (!product) return <p>Loading...</p>;  // Если продукт еще не загружен, отображаем индикатор загрузки

  return (
    <ProductDetailContainer>
      {/* Отображение изображения продукта */}
      <Image src={product.image} alt={product.name} />
      {/* Отображение названия продукта */}
      <Title>{product.name}</Title>
      {/* Отображение цены */}
      <Price>${product.price.toFixed(2)}</Price>
      {/* Отображение описания */}
      <Description>{product.description}</Description>
      {/* Управление количеством товара */}
      <QuantityControls>
        <button onClick={() => setQuantity(quantity - 1)} disabled={quantity <= 1}>-</button>  {/* Уменьшаем количество */}
        <span>{quantity}</span>  {/* Отображение текущего количества */}
        <button onClick={() => setQuantity(quantity + 1)}>+</button>  {/* Увеличиваем количество */}
      </QuantityControls>
      {/* Кнопка добавления товара в корзину */}
      <AddToCartButton onClick={handleAddToCart}>Add to Cart</AddToCartButton>
    </ProductDetailContainer>
  );
};

export default ProductDetail;
