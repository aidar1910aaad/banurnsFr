import React, { useState } from 'react';
import '../css/style.css';
import Pagination from './Pagination';
import JsBarcode from 'jsbarcode';
import baseURL from '../apiConfig/const';
import axios from 'axios';

function FlavorData(props) {
  const { flavors } = props;
  const [popularitySortOrder, setPopularitySortOrder] = useState('asc');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);

  const [sortDirection, setSortDirection] = useState('asc');
  const [sortCriteria, setSortCriteria] = useState('popularity');
  const [storesMap, setStoresMap] = useState({});
  const [itemsPerPage, setItemsPerPage] = useState(60);
  const [editedPopularity, setEditedPopularity] = useState({ id: null, value: '' });

  if (!flavors || flavors.length === 0) return <p>Нет данных.</p>;

  function SortArrow({ sortOrder }) {
    if (sortOrder === 'asc') {
      return <span>&uarr;</span>;
    } else if (sortOrder === 'desc') {
      return <span>&darr;</span>;
    } else {
      return null;
    }
  }

  const handleSort = (criteria) => {
    if (sortCriteria === criteria) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCriteria(criteria);
      setSortDirection('asc');
    }
  };

  const handlePopularitySort = () => {
    setPopularitySortOrder(popularitySortOrder === 'asc' ? 'desc' : 'asc');
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
  const currentStores = flavors.slice(startIndex, endIndex);
  const totalPages = Math.ceil(flavors.length / itemsPerPage);

  const handlePopularityChange = (event, id) => {
    setEditedPopularity({ id, value: event.target.value });
  };

  const handleSavePopularity = (id) => {
    const { value } = editedPopularity;
    const data = { id, popularity: value };
    console.log(sortedFlavors);
    const token = localStorage.getItem('Token');
    const role = localStorage.getItem('Role');
    const customConfig = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer_' + token,
      },
    };

    let requestURL = baseURL + '/admin/modifyPopularity';
    if (role === 'ROLE_REQUESTMANAGER') {
      requestURL = baseURL + '/reqprocessor/modifyPopularity';
    }

    axios
      .post(requestURL, data, customConfig)
      .then((response) => {
        console.log('Popularity updated successfully');
        setEditedPopularity({ id: null, value: '' });
        window.location.reload();
      })
      .catch((error) => {
        console.error('Failed to update popularity', error);
      });
  };

  const sortedFlavors = [...currentStores].sort((a, b) => {
    let sortValue = 0;

    if (sortCriteria === 'name') {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      sortValue = nameA.localeCompare(nameB);
    } else if (sortCriteria === 'popularity') {
      const popularityA = parseInt(a.popularity, 10);
      const popularityB = parseInt(b.popularity, 10);
      sortValue = popularityA - popularityB;
    }

    return sortDirection === 'asc' ? sortValue : -sortValue;
  });

  return (
    <div className="flex">
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>
              Название вкуса <SortArrow sortOrder={sortOrder} />
              {sortCriteria === 'name' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('popularity')}>
              Популярность <SortArrow sortOrder={popularitySortOrder} />
              {sortCriteria === 'popularity' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th>Тип</th>
            <th>Числовой код</th>
            <th>Изображение</th>
            <th>Управление</th>
          </tr>
        </thead>
        <tbody>
          {sortedFlavors.map((flavor) => (
            <tr key={flavor.id}>
              <td>{flavor.name}</td>
              <td>
                {editedPopularity.id === flavor.id ? (
                  <input
                    type="text"
                    value={editedPopularity.value}
                    onChange={(event) => handlePopularityChange(event, flavor.id)}
                  />
                ) : (
                  flavor.popularity
                )}
              </td>
              <td>{flavor.narrow ? 'узкий' : 'широкий'}</td>
              <td>{flavor.barcode}</td>
              <td>
                <img
                  style={{ width: '120px', height: '50px' }}
                  className="barcode"
                  alt={flavor.barcode}
                  ref={(element) =>
                    element && JsBarcode(element, flavor.barcode, { width: 5, format: 'CODE128' })
                  }
                />
              </td>
              <td>
                {editedPopularity.id === flavor.id ? (
                  <button className="button-data" onClick={() => handleSavePopularity(flavor.id)}>
                    Сохранить
                  </button>
                ) : (
                  <button
                    className="button-data"
                    onClick={() =>
                      setEditedPopularity({ id: flavor.id, value: flavor.popularity })
                    }>
                    Редактировать
                  </button>
                )}
              </td>
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
