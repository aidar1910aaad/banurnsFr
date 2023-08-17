import React, { useRef, useState, useEffect } from 'react';
import '../css/style.css';
import Pagination from './Pagination';
import JsBarcode from 'jsbarcode';
function MiscData(props, handleDelete) {
  const { miscs } = props;
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  if (!miscs || miscs.length === 0) return <p>Нет данных.</p>;

  const sortedStores = miscs.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (nameA > nameB) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setPage(1);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStores = sortedStores.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedStores.length / itemsPerPage);

  return (
    <div className="flex">
      <table>
        <thead>
          <tr>
            <th onClick={handleSort}>Название товара</th>
            <th>Числовой код</th>
            <th>Изображение</th>
            <th>Управление</th>
          </tr>
        </thead>
        <tbody>
          {currentStores.map((person) => (
            <tr key={person.id}>
              <td>{person.name}</td>
              <td>{person.barcode}</td>
              <td>
                <img
                  style={{ width: '230px', height: '80px' }}
                  className="barcode"
                  alt={person.barcode}
                  ref={(element) =>
                    element && JsBarcode(element, person.barcode, { width: 5, format: 'CODE128' })
                  }
                />
              </td>

              <td>
                <button className="button-data" onClick={() => props.handleDelete(person.id)}>
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <Pagination
          page={page}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          handlePageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          handleItemsPerPageChange={handleItemsPerPageChange}
        />
      </table>
    </div>
  );
}

export default MiscData;
