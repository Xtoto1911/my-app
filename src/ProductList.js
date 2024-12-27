import React, { useState } from 'react';
import ProductCard from './ProductCard';
import useProducts from './useProducts';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

const ProductListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
`;

const PageSizeSelect = styled.select`
  margin-left: auto;
`;

const ProductList = () => {
  const { category } = useParams(); // Получаем категорию из маршрута
  const { products, loading, error } = useProducts(category);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(1);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const paginatedProducts = products.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="container">
      <ProductListContainer>
        {paginatedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ProductListContainer>
      <Pagination>
        <button className="btn btn-primary" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>{page}</span>
        <button className="btn btn-primary" onClick={() => handlePageChange(page + 1)} disabled={page * pageSize >= products.length}>
          Next
        </button>
      </Pagination>
      <PageSizeSelect className="form-select" value={pageSize} onChange={(e) => handlePageSizeChange(Number(e.target.value))}>
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
      </PageSizeSelect>
    </div>
  );
};

export default ProductList;
