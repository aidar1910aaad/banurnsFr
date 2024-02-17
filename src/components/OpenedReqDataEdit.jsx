import React, { useEffect, useState } from 'react';
import '../css/style.css';
import { Link } from 'react-router-dom';

import axios from 'axios';
import baseURL from '../apiConfig/const';
import moment from 'moment';

function OpenedReqDataEdit(props, handleDelete, handleShow) {
  const { opened } = props;
  const [stores, setStores] = useState([]);
  const [storesMap, setStoresMap] = useState({});

  const [usersMap, setUsersMap] = useState({});
  const token = localStorage.getItem('Token');
  const [sortCriteria, setSortCriteria] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const customConfig = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer_' + token,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(baseURL + '/reqprocessor/getAllStores', customConfig);
        const storesData = response.data.reduce((acc, store) => {
          acc[store.id] = store;
          return acc;
        }, {});
        setStoresMap(storesData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(baseURL + `/reqprocessor/getAllUsers`, customConfig);
        const storesData = response.data.reduce((acc, username) => {
          acc[username.id] = username;
          return acc;
        }, {});
        setUsersMap(storesData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  if (!opened || opened.length === 0)
    return <p className="noData">Выберите другую торговую точку</p>;

  const sortedOpened = opened
    .filter((person) => person.status === 'ACTIVE')
    .sort((a, b) => {
      let sortValue = 0;
      if (sortCriteria === 'storeid') {
        sortValue = storesMap[a.storeid]?.name.localeCompare(storesMap[b.storeid]?.name);
      } else if (sortCriteria === 'creationuserid') {
        sortValue = a.creationuserid - b.creationuserid;
      } else if (sortCriteria === 'status') {
        sortValue = a.status.localeCompare(b.status);
      } else if (sortCriteria === 'created') {
        sortValue = moment(a.created).diff(moment(b.created));
      }

      return sortDirection === 'asc' ? sortValue : -sortValue;
    });

  const handleSortClick = (criteria) => {
    if (sortCriteria === criteria) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCriteria(criteria);
      setSortDirection('asc');
    }
  };

  return (
    <div className="flex">
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSortClick('storeid')}>
              Создано торговой точкой{' '}
              {sortCriteria === 'storeid' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSortClick('creationuserid')}>
              Создано пользователем{' '}
              {sortCriteria === 'creationuserid' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSortClick('status')}>
              Статус {sortCriteria === 'status' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSortClick('created')}>
              Дата создания{' '}
              {sortCriteria === 'created' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
            </th>

            <th>Изменить</th>
          </tr>
        </thead>
        <tbody>
          {sortedOpened.map((person) => {
            if (person.status === 'ACTIVE') {
              return (
                <tr key={person.id}>
                  <td>{storesMap[person.storeid]?.name}</td>
                  <td>{usersMap[person.creationuserid]?.username}</td>
                  <td>Не закрыт</td>
                  <td>{moment(person.created).format('DD.MM.YYYY в HH:mm:ss')}</td>

                  <td>
                    <Link to={'/ReqManager/Reqq/CreateEdit'}>
                      <button
                        className="button-data"
                        onClick={() => {
                          // Сохраните reqId в localStorage при нажатии на кнопку
                          localStorage.setItem('reqId', person.id);
                          localStorage.setItem('pId', person.creationuserid);
                        }}>
                        {' '}
                        Изменить заявку
                      </button>
                    </Link>
                  </td>
                </tr>
              );
            } else {
              return null; // не отображаем элементы с другим статусом
            }
          })}
        </tbody>
      </table>
    </div>
  );
}

export default OpenedReqDataEdit;
