import React, { useState } from 'react';
import '../css/style.css';
import Pagination from './Pagination';

function SortArrow({ sortOrder }) {
  if (sortOrder === 'asc') {
    return <span>&uarr;</span>;
  } else if (sortOrder === 'desc') {
    return <span>&darr;</span>;
  } else {
    return null;
  }
}

function FlavorData(props) {
  const { flavors } = props;
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  if (!flavors || flavors.length === 0) return <p>Нет данных.</p>;

  const sortedFlavors = flavors.sort((a, b) => {
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
  const currentStores = sortedFlavors.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedFlavors.length / itemsPerPage);

  return (
    <div className="flex">
      <table>
        <thead>
          <tr>
            <th onClick={handleSort}>
              Название вкуса <SortArrow sortOrder={sortOrder} />
            </th>
            <th>Управление</th>
          </tr>
        </thead>
        <tbody>
          {currentStores.map((flavor) => (
            <tr key={flavor.id}>
              <td>{flavor.name}</td>
              <td>
                <button className="button-data" onClick={() => props.handleDelete(flavor.id)}>
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

export default FlavorData;
