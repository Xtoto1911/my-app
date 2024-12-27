import { useState, useEffect } from 'react';

// Создаем пользовательский хук useProducts, который принимает категорию для фильтрации.
const useProducts = (category) => {
  // Инициализируем состояние для списка продуктов.
  const [products, setProducts] = useState([]);
  // Инициализируем состояние для отслеживания процесса загрузки.
  const [loading, setLoading] = useState(true);
  // Инициализируем состояние для хранения ошибок, если они возникнут.
  const [error, setError] = useState(null);

  // Используем useEffect, чтобы выполнять побочный эффект загрузки данных.
  // Эффект будет срабатывать при изменении значения category.
  useEffect(() => {
    // Определяем асинхронную функцию для загрузки продуктов.
    const fetchProducts = async () => {
      try {
        // Выполняем запрос на сервер для получения файла /products.json.
        const response = await fetch('/products.json');
        // Преобразуем ответ в JSON.
        const data = await response.json();
        // Если категория указана, фильтруем данные по этой категории.
        // Если нет, возвращаем все данные.
        const filteredProducts = category 
          ? data.filter(product => product.category === category) 
          : data;
        // Обновляем состояние products отфильтрованными данными.
        setProducts(filteredProducts);
      } catch (error) {
        // Если происходит ошибка, записываем её в состояние error.
        setError(error);
      } finally {
        // Независимо от успеха или ошибки запроса, обновляем состояние loading.
        setLoading(false);
      }
    };

    // Вызываем функцию загрузки данных.
    fetchProducts();
  }, [category]); // useEffect зависит от category: эффект сработает, если category изменится.

  // Возвращаем объект с продуктами, состоянием загрузки и ошибками,
  // чтобы они были доступны компонентам, использующим этот хук.
  return { products, loading, error };
};

// Экспортируем хук, чтобы его можно было использовать в других частях приложения.
export default useProducts;
