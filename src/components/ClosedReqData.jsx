import React, { useEffect, useState } from 'react';
import '../css/style.css';
import { Link } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import baseURL from '../apiConfig/const';

function ClosedReqData(props, handleShow) {
  const { closed } = props;
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

  if (!closed || closed.length === 0) return <p>Нет данных.</p>;

  const sortedOpened = closed
    .filter((person) => person.status === 'NOT_ACTIVE')
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
      } else if (sortCriteria === 'updated') {
        sortValue = moment(a.updated).diff(moment(b.updated));
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
    <div className="flexbox">
      <table>
        <thead>
          <tr>
            <th>Номер</th>
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
            <th onClick={() => handleSortClick('updated')}>
              Дата закрытия заявки{' '}
              {sortCriteria === 'updated' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
            </th>

            <th onClick={() => handleSortClick('storeid')}>
              Создано торговой точкой{' '}
              {sortCriteria === 'storeid' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th>Посмотреть</th>
          </tr>
        </thead>
        <tbody>
          {sortedOpened.map((person, index) => {
            if (person.status === 'NOT_ACTIVE') {
              return (
                <tr key={person.id}>
                  <td>{index + 1}</td>
                  <td>{usersMap[person.creationuserid]?.username}</td>
                  <td>Закрыт</td>
                  <td>{moment(person.created).format('DD.MM.YYYY в HH:mm:ss')}</td>
                  <td>{moment(person.updated).format('DD.MM.YYYY в HH:mm:ss')}</td>

                  <td>{storesMap[person.storeid]?.name}</td>
                  <td>
                    <Link to={'/ReqManager/Show'} target="_blank">
                      <button className="button-data" onClick={() => props.handleShow(person.id)}>
                        Посмотреть заявку
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

export default ClosedReqData;
