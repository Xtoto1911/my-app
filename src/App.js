import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';
import Cart from './Cart';
import { CartProvider } from './CartContext'; 

// Основной компонент приложения
const App = () => {
  return (
    // Оборачиваем все приложение в CartProvider, чтобы корзина была доступна в любом компоненте
    <CartProvider>
      {/* Настройка роутинга с использованием BrowserRouter */}
      <Router>
        {/* Главный контейнер страницы с гибким вертикальным расположением */}
        <div className="d-flex flex-column min-vh-100">
          {/* Шапка сайта */}
          <Header />
          {/* Основной контент страницы (будет меняться в зависимости от маршрута) */}
          <main className="container flex-grow-1 py-4">
            {/* Определяем маршруты с использованием компонента Routes */}
            <Routes>
              {/* Маршрут для главной страницы, которая отображает список товаров */}
              <Route path="/" element={<ProductList />} />
              {/* Маршрут для страницы с товарами по категориям */}
              <Route path="/catalog/:category" element={<ProductList />} />
              {/* Маршрут для страницы с деталями конкретного товара */}
              <Route path="/product/:id" element={<ProductDetail />} />
              {/* Маршрут для страницы корзины */}
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;
