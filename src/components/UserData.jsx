import React, { useState } from 'react';
import '../css/style.css';
import moment from 'moment';
import styles from '../css/Pagination.module.css';
import Pagination from './Pagination';

function UserData(props) {
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortBy, setSortBy] = useState('username');
  const { persons } = props;
  console.log(persons);

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  if (!persons || persons.length === 0) return <p>Нет данных.</p>;

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedPersons = persons.slice().sort((a, b) => {
    const fieldA = a[sortBy];
    const fieldB = b[sortBy];
    let comparison = 0;
    if (fieldA > fieldB) {
      comparison = 1;
    } else if (fieldA < fieldB) {
      comparison = -1;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setPage(1);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const totalPages = Math.ceil(sortedPersons.length / itemsPerPage);
  const currentPersons = sortedPersons.slice(startIndex, endIndex);

  return (
    <div className="flexbox">
      <table>
        {' '}
        <thead>
          <tr>
            <th onClick={() => handleSort('username')}>
              Имя пользователя {sortBy === 'username' && <SortArrow sortOrder={sortOrder} />}
            </th>
            <th onClick={() => handleSort('created')}>
              Создан {sortBy === 'created' && <SortArrow sortOrder={sortOrder} />}
            </th>
            <th onClick={() => handleSort('status')}>
              Роль {sortBy === 'status' && <SortArrow sortOrder={sortOrder} />}
            </th>
            <th>Управление</th>
          </tr>
        </thead>
        <tbody>
          {currentPersons.map((person) => (
            <tr key={person.id}>
              <td>{person.username}</td>

              <td>{moment(person.created).format('DD.MM.YYYY в HH:mm:ss')}</td>
              <td>
                {person.role === 'ROLE_ADMIN'
                  ? 'Администратор'
                  : person.role === 'ROLE_SALESMANAGER'
                  ? 'Менеджер'
                  : 'Обработчик'}
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

function SortArrow({ sortOrder }) {
  if (sortOrder === 'asc') {
    return <span>&uarr;</span>;
  } else {
    return <span>&darr;</span>;
  }
}

export default UserData;
