import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';  // Компонент для отображения отдельного продукта
import useProducts from './useProducts';  // Пользовательский хук для загрузки продуктов
import styled from 'styled-components';  // Для стилизации с использованием styled-components
import { useParams, useNavigate } from 'react-router-dom';  // Хуки для работы с параметрами маршрута и навигацией

// Стилизация контейнера для списка продуктов с использованием grid
const ProductListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); // Автоматическая сетка для продуктов
  gap: 1rem; // Отступы между карточками
  padding: 1rem; // Отступы вокруг контейнера

  @media (max-width: 600px) { // Для маленьких экранов
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); // Меньше колонок на маленьких экранах
  }
`;

// Стилизация блока для пагинации
const Pagination = styled.div`
  display: flex;
  justify-content: center;  // Выравнивание по центру
  gap: 1rem;  // Отступы между кнопками
  margin: 1rem 0; // Отступы сверху и снизу
`;

// Стилизация выпадающего списка для выбора размера страницы
const PageSizeSelect = styled.select`
  margin-left: auto; // Сдвигаем выпадающий список вправо
`;

const ProductList = () => {
  const { category } = useParams(); // Получаем категорию из URL
  const navigate = useNavigate(); // Хук для навигации между страницами
  const { products, loading, error } = useProducts(category); // Используем хук для загрузки продуктов
  const [page, setPage] = useState(1); // Состояние для текущей страницы
  const [pageSize, setPageSize] = useState(10); // Состояние для размера страницы (количество продуктов на странице)

  // useEffect для сброса на первую страницу при изменении категории
  useEffect(() => {
    setPage(1); // Сбрасываем на первую страницу при изменении категории
  }, [category]);

  // useEffect для редиректа на главную страницу (пустую категорию), если категория не указана
  useEffect(() => {
    if (!category) {
      navigate('');  // Редирект на главную страницу, если категория не указана
    }
  }, [category, navigate]);

  // Функция для изменения страницы
  const handlePageChange = (newPage) => {
    setPage(newPage); // Устанавливаем новую страницу
  };

  // Функция для изменения размера страницы
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);  // Устанавливаем новый размер страницы
    setPage(1); // Сбрасываем на первую страницу при изменении размера
  };

  // Если данные загружаются, показываем индикатор загрузки
  if (loading) return <p>Loading...</p>;
  // Если возникла ошибка при загрузке, показываем сообщение об ошибке
  if (error) return <p>Error: {error.message}</p>;

  // Разбиваем список продуктов на страницы
  const paginatedProducts = products.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="container">
      {/* Контейнер для списка продуктов */}
      <ProductListContainer>
        {paginatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} /> // Рендерим каждую карточку продукта
        ))}
      </ProductListContainer>

      {/* Пагинация */}
      <Pagination>
        {/* Кнопка "Предыдущая страница" */}
        <button
          className="btn btn-primary"
          onClick={() => handlePageChange(page - 1)}  // Переход на предыдущую страницу
          disabled={page === 1}  // Деактивируем кнопку, если находимся на первой странице
        >
          Previous
        </button>

        {/* Отображение текущей страницы */}
        <span>{page}</span>

        {/* Кнопка "Следующая страница" */}
        <button
          className="btn btn-primary"
          onClick={() => handlePageChange(page + 1)}  // Переход на следующую страницу
          disabled={page * pageSize >= products.length}  // Деактивируем кнопку, если следующая страница не существует
        >
          Next
        </button>
      </Pagination>

      {/* Выпадающий список для выбора размера страницы */}
      <PageSizeSelect
        className="form-select"
        value={pageSize}  // Текущее значение размера страницы
        onChange={(e) => handlePageSizeChange(Number(e.target.value))} // Обработка изменения размера страницы
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
      </PageSizeSelect>
    </div>
  );
};

export default ProductList;
