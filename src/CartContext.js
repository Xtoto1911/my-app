import React, { createContext, useState, useEffect } from 'react';

// Создаем контекст для корзины покупок
const CartContext = createContext();

// Провайдер для корзины, который будет оборачивать компоненты и передавать данные о корзине и функции управления корзиной
const CartProvider = ({ children }) => {
  // Состояние для хранения товаров в корзине. Изначально пытаемся получить данные из localStorage
  const [cartItems, setCartItems] = useState(() => {
    // Получаем сохраненную корзину из localStorage, если она есть
    const savedCart = localStorage.getItem('cart');
    // Если корзина найдена, парсим ее в объект, если нет, инициализируем пустым массивом
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Эффект для синхронизации состояния корзины с localStorage
  useEffect(() => {
    // Сохраняем корзину в localStorage при каждом изменении состояния корзины
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]); // Этот эффект срабатывает только когда cartItems изменяется

  // Функция для добавления товара в корзину
  const addToCart = (id, quantity, name, image, price) => {
    setCartItems(prevItems => {
      // Проверяем, есть ли товар с таким id в корзине
      const existingItem = prevItems.find(item => item.id === id);
      if (existingItem) {
        // Если товар уже в корзине, то просто ничего не делаем
        return prevItems;
      } else {
        // Если товара нет в корзине, добавляем его в корзину
        const newItems = [...prevItems, { id, quantity, name, image, price }];
        // После добавления товара обновляем счетчик корзины
        updateCartCount(newItems.length);
        return newItems;
      }
    });
  };

  // Функция для обновления количества товара в корзине
  const updateCartItem = (id, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Функция для удаления товара из корзины
  const removeFromCart = (id) => {
    setCartItems(prevItems => {
      // Убираем товар с заданным id из корзины
      const newItems = prevItems.filter(item => item.id !== id);
      // После удаления товара обновляем счетчик корзины
      updateCartCount(newItems.length);
      return newItems;
    });
  };

  // Функция для очистки всей корзины
  const clearCart = () => {
    setCartItems([]); // Очищаем корзину
    updateCartCount(0); // Обновляем счетчик корзины
  };

  // Функция для обновления счетчика количества товаров в корзине
  const updateCartCount = (count) => {
    // Генерируем кастомное событие, которое будет уведомлять другие компоненты о новом количестве товаров в корзине
    document.dispatchEvent(new CustomEvent('cartUpdate', { detail: count }));
  };

  // Функция для расчета общей суммы товаров в корзине
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    // Провайдер, который предоставляет данные и функции корзины всему дереву компонентов, обернутому в CartProvider
    <CartContext.Provider value={{ cartItems, addToCart, updateCartItem, removeFromCart, clearCart, calculateTotal }}>
      {children} {/* Все дочерние компоненты будут иметь доступ к контексту корзины */}
    </CartContext.Provider>
  );
};

// Экспортируем CartContext и CartProvider для использования в других компонентах
export { CartContext, CartProvider };
