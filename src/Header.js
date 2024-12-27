import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from './CartContext';
import styled from 'styled-components';

// Компонент для иконки "гамбургер" (три горизонтальные полоски)
const HamburgerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="5" width="18" height="2" fill="#333" /> {/* Верхняя полоса */}
    <rect x="3" y="11" width="18" height="2" fill="#333" /> {/* Средняя полоса */}
    <rect x="3" y="17" width="18" height="2" fill="#333" /> {/* Нижняя полоса */}
  </svg>
);

// Стили для контейнера шапки
const HeaderContainer = styled.header`
  display: flex; /* Выравнивание элементов по горизонтали */
  justify-content: space-between; /* Пространство между логотипом и навигацией */
  align-items: center; /* Выравнивание по вертикали */
  padding: 1rem 2rem; /* Отступы */
  background-color: #ffffff; /* Белый фон */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Тень */
  position: sticky; /* Шапка будет прикреплена к верху */
  top: 0; /* Приклеивание к верхней части экрана */
  z-index: 1000; /* Чтобы шапка была выше других элементов */
`;

// Стили для логотипа
const Logo = styled(Link)`
  font-size: 1.5rem; /* Размер шрифта */
  font-weight: bold; /* Жирное начертание */
  color: #007bff; /* Цвет текста */
  text-decoration: none; /* Убираем подчеркивание */
  &:hover {
    text-decoration: underline; /* Подчеркивание при наведении */
  }
`;

// Стили для навигации
const Nav = styled.nav`
  display: flex; /* Выравнивание элементов по горизонтали */
  align-items: center; /* Выравнивание по вертикали */
  gap: 1.5rem; /* Отступы между элементами */
`;

// Стили для выпадающего меню
const Dropdown = styled.div`
  position: relative; /* Для правильного позиционирования выпадающего меню */
`;

// Кнопка для открытия/закрытия выпадающего меню
const DropdownToggle = styled.button`
  background: none; /* Без фона */
  border: none; /* Без рамки */
  font-size: 1rem; /* Размер шрифта */
  font-weight: bold; /* Жирный текст */
  color: #333; /* Цвет текста */
  cursor: pointer; /* Курсор в виде указателя */
  display: flex; /* Чтобы элементы (текст и иконка) располагались в одну линию */
  align-items: center; /* Выравнивание по вертикали */
  gap: 0.5rem; /* Отступ между текстом и иконкой */
  
  &:hover {
    color: #007bff; /* Цвет текста при наведении */
    text-decoration: underline; /* Подчеркивание при наведении */
  }

  /* Мобильная версия: скрыть текст и показать иконку гамбургера */
  @media (max-width: 768px) {
    span {
      display: none; /* Скрыть текст "Categories" на мобильных */
    }

    svg {
      display: block; /* Показать иконку гамбургера */
      width: 24px; /* Размер иконки */
      height: 24px;
    }
  }
`;

// Стили для выпадающего меню с категориями
const DropdownMenu = styled.div`
  position: absolute; /* Позиционирование относительно родительского элемента */
  top: 110%; /* Сдвигаем меню вниз */
  left: 0; /* Выравнивание по левому краю */
  background: white; /* Белый фон */
  border: 1px solid #dee2e6; /* Граница */
  border-radius: 6px; /* Скругленные углы */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Тень */
  z-index: 1000; /* Чтобы меню было поверх других элементов */
  display: ${(props) => (props.visible ? 'block' : 'none')}; /* Показываем меню, если оно открыто */
  overflow: hidden; /* Прячем все, что выходит за пределы */
  animation: fadeIn 0.2s ease-in-out; /* Анимация появления */

  @keyframes fadeIn {
    from {
      opacity: 0; /* Начальная прозрачность */
      transform: translateY(-10px); /* Начальное положение снизу */
    }
    to {
      opacity: 1; /* Полная видимость */
      transform: translateY(0); /* Финальное положение */
    }
  }
`;

// Стили для каждого элемента в выпадающем меню
const DropdownItem = styled(Link)`
  display: block; /* Блок, чтобы каждый элемент занимал всю ширину */
  padding: 0.75rem 1.5rem; /* Отступы внутри элемента */
  color: #333; /* Цвет текста */
  font-size: 0.9rem; /* Размер шрифта */
  text-decoration: none; /* Убираем подчеркивание */
  transition: background 0.2s; /* Плавное изменение фона */
  
  &:hover {
    background: #f8f9fa; /* Цвет фона при наведении */
    color: #007bff; /* Цвет текста при наведении */
  }
`;

// Стили для ссылки на корзину
const CartLink = styled(Link)`
  position: relative;
  font-size: 1rem;
  font-weight: bold;
  color: #007bff;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }

  span {
    margin-left: 0.5rem; /* Отступ от текста */
    font-size: 0.9rem; /* Размер шрифта для счетчика */
    font-weight: bold;
    color: #ff5733; /* Цвет для счетчика */
  }
`;

const Header = () => {
  const { cartItems } = useContext(CartContext); /* Используем контекст для корзины */
  const [cartCount, setCartCount] = useState(cartItems.length); /* Считаем количество товаров в корзине */
  const [categories, setCategories] = useState([]); /* Массив для хранения категорий */
  const [dropdownVisible, setDropdownVisible] = useState(false); /* Состояние видимости выпадающего меню */

  // Эффект для загрузки категорий
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/products.json'); /* Получаем данные о товарах */
        const data = await response.json(); /* Преобразуем ответ в JSON */
        const uniqueCategories = [...new Set(data.map((item) => item.category))]; /* Извлекаем уникальные категории */
        setCategories(uniqueCategories); /* Сохраняем их в состояние */
      } catch (error) {
        console.error('Error fetching categories:', error); /* Обработка ошибок */
      }
    };

    fetchCategories(); /* Вызываем функцию загрузки */
  }, []); /* Загрузка при монтировании компонента */

  // Эффект для обновления количества товаров в корзине
  useEffect(() => {
    setCartCount(cartItems.length); /* Обновляем счетчик */
  }, [cartItems]); /* Следим за изменениями в корзине */

  return (
    <div className="container-fluid">
      <HeaderContainer>
        <Logo to="/">Logo</Logo> {/* Логотип */}
        <Nav>
          <Dropdown>
            <DropdownToggle onClick={() => setDropdownVisible(!dropdownVisible)}>
              {/* Показываем текст "Categories" на больших экранах */}
              <span>Categories</span>
              {/* Иконка гамбургера для мобильных */}
              <HamburgerIcon />
            </DropdownToggle>
            <DropdownMenu visible={dropdownVisible}>
              {categories.map((category) => (
                <DropdownItem
                  to={`/catalog/${category}`}
                  key={category}
                  onClick={() => setDropdownVisible(false)} /* Закрытие меню после выбора категории */
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)} {/* Форматируем первую букву категории в верхний регистр */}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </Nav>
        <CartLink to="/cart">
          Cart<span>{cartCount}</span> {/* Ссылка на корзину с отображением количества товаров */}
        </CartLink>
      </HeaderContainer>
    </div>
  );
};

export default Header;
