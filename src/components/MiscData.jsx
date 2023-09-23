import React, { useState } from 'react';
import '../css/style.css';
import Pagination from './Pagination';
import JsBarcode from 'jsbarcode';
import axios from 'axios';
import baseURL from '../apiConfig/const';

function MiscData(props) {
  const { miscs } = props;
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [editedBarcode, setEditedBarcode] = useState({ id: null, value: '' });

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

  const handleBarcodeChange = (event, id) => {
    setEditedBarcode({ id, value: event.target.value });
  };

  const handleSaveBarcodeMisc = (id) => {
    const { value } = editedBarcode;
    const data = { id, barcode: value };
    const token = localStorage.getItem('Token');
    const role = localStorage.getItem('Role');
    const customConfig = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer_' + token,
      },
    };

    let requestURL = baseURL + '/admin/updateBarcodeMisc';
    if (role === 'ROLE_REQUESTMANAGER') {
      requestURL = baseURL + '/reqprocessor/updateBarcodeMisc';
    }

    axios
      .post(requestURL, data, customConfig)
      .then((response) => {
        console.log('Barcode updated successfully');
        setEditedBarcode({ id: null, value: '' });
        window.location.reload(); // Обновите страницу после успешного обновления
      })
      .catch((error) => {
        console.error('Failed to update barcode', error);
      });
  };

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
              <td>
                {editedBarcode.id === person.id ? (
                  <input
                    type="text"
                    value={editedBarcode.value}
                    onChange={(event) => handleBarcodeChange(event, person.id)}
                  />
                ) : (
                  person.barcode
                )}
              </td>
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
                {editedBarcode.id === person.id ? (
                  <button className="button-data" onClick={() => handleSaveBarcodeMisc(person.id)}>
                    Сохранить
                  </button>
                ) : (
                  <button
                    className="button-data"
                    onClick={() => setEditedBarcode({ id: person.id, value: person.barcode })}>
                    Редактировать
                  </button>
                )}
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
