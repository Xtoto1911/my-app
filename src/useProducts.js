import { useState, useEffect } from 'react';

// Создаем пользовательский хук useProducts, который принимает аргумент category.
const useProducts = (category) => {
  // products — состояние для хранения списка продуктов.
  // setProducts — функция для обновления состояния products.
  const [products, setProducts] = useState([]);
  
  // loading — состояние для отслеживания процесса загрузки.
  // setLoading — функция для обновления состояния loading.
  const [loading, setLoading] = useState(true);
  
  // error — состояние для хранения ошибок, которые могут возникнуть при загрузке данных.
  // setError — функция для обновления состояния error.
  const [error, setError] = useState(null);

  // useEffect используется для выполнения побочных эффектов.
  // Здесь он будет вызываться при изменении значения category.
  useEffect(() => {
    // Определяем асинхронную функцию fetchProducts для загрузки данных.
    const fetchProducts = async () => {
      try {
        // Устанавливаем состояние loading в true перед началом загрузки.
        setLoading(true);

        // Выполняем запрос на получение данных из файла '/products.json'.
        const response = await fetch('/products.json');

        // Парсим полученные данные в формате JSON.
        const data = await response.json();

        // Если передана категория, фильтруем продукты по этой категории.
        // В противном случае возвращаем все продукты.
        const filteredProducts = category ? data.filter(product => product.category === category) : data;

        // Обновляем состояние products отфильтрованными данными.
        setProducts(filteredProducts);
      } catch (error) {
        // Если произошла ошибка, обновляем состояние error.
        setError(error);
      } finally {
        // В любом случае, независимо от успешности или неуспешности запроса,
        // устанавливаем состояние loading в false.
        setLoading(false);
      }
    };

    // Вызываем функцию загрузки данных.
    fetchProducts();
  }, [category]); // useEffect будет срабатывать каждый раз, когда значение category изменяется.

  // Возвращаем объект с продуктами, состоянием загрузки и ошибками,
  // чтобы можно было использовать эти данные в компоненте.
  return { products, loading, error };
};

// Экспортируем пользовательский хук для использования в других частях приложения.
export default useProducts;
