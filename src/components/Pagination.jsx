import React from 'react';
import styles from '../css/Pagination.module.css';

function Pagination(props) {
  const { page, totalPages, handlePageChange, itemsPerPage, handleItemsPerPageChange } = props;

  return (
    <div className={styles.pagination}>
      <button
        className={styles.pageButton}
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}>
        Предыдущая
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => handlePageChange(pageNum)}
          className={`${styles.pageButton} ${pageNum === page ? styles.activePageButton : ''}`}>
          {pageNum}
        </button>
      ))}
      <button
        className={styles.pageButton}
        disabled={page === totalPages}
        onClick={() => handlePageChange(page + 1)}>
        Следующая
      </button>
      <select className={styles.selectt} value={itemsPerPage} onChange={handleItemsPerPageChange}>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>
  );
}

export default Pagination;

{
  /* <div className={styles.pagination}>
  <button
    className={styles.pageButton}
    disabled={page === 1}
    onClick={() => handlePageChange(page - 1)}>
    Предыдущая
  </button>
  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
    <button
      key={pageNum}
      onClick={() => handlePageChange(pageNum)}
      className={`${styles.pageButton} ${pageNum === page ? styles.activePageButton : ''}`}>
      {pageNum}
    </button>
  ))}
  <button
    className={styles.pageButton}
    disabled={page === totalPages}
    onClick={() => handlePageChange(page + 1)}>
    Следующая
  </button>
  <select className={styles.selectt} value={itemsPerPage} onChange={handleItemsPerPageChange}>
    <option value="5">5</option>
    <option value="10">10</option>
    <option value="20">20</option>
    <option value="20">50</option>
    <option value="20">100</option>
  </select>
</div>; */
}
