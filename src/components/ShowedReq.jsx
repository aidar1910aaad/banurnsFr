import React, { useEffect, useState } from 'react';
import '../css/style.css';
import { Link } from 'react-router-dom';
import moment from 'moment/moment';
import axios from 'axios';
import baseURL from '../apiConfig/const';
import '../css/style.css';

function ShowedReq(props) {
  const { showed } = props;
  console.log(showed);

  const [usersMap, setUsersMap] = useState({});
  const [stores, setStores] = useState([]);
  const [storesMap, setStoresMap] = useState({});
  const [idFlav, setIdFlav] = useState([]);
  const [idMisc, setIdMisc] = useState([]);
  const [username, setUsername] = useState('');

  // const { flavors } = showed;

  // const parsedFlavors = flavors.split('&').map((flavor) => {
  //   const [id, quantity] = flavor.split(':');
  //   return {
  //     id: parseInt(id) + 1,
  //     quantity: parseInt(quantity),
  //   };
  // });
  // console.log(parsedFlavors);

  const token = localStorage.getItem('Token');
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(baseURL + '/reqprocessor/getFlavors', customConfig);
        const storesData = response.data.reduce((acc, store) => {
          acc[store.id] = store;
          return acc;
        }, {});
        setIdFlav(storesData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          baseURL + `/reqprocessor/getUsernameById/${showed.creationuserid}`,
          null,
          customConfig,
        );
        const storesData = response.data;
        console.log(storesData);
        setIdFlav(storesData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(baseURL + '/reqprocessor/getMisc', customConfig);
        const storesData = response.data.reduce((acc, store) => {
          acc[store.id] = store;
          return acc;
        }, {});
        setIdMisc(storesData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const totalQuantityy =
    showed && showed.miscs
      ? showed.miscs
          .split('&')
          .map((flavor) => {
            const [id, quantity] = flavor.split(':');
            return parseInt(quantity);
          })
          .reduce((acc, curr) => acc + curr, 0)
      : 0;

  const totalQuantity =
    showed && showed.flavors
      ? showed.flavors
          .split('&')
          .map((flavor) => {
            const [id, quantity] = flavor.split(':');
            return parseInt(quantity);
          })
          .reduce((acc, curr) => acc + curr, 0)
      : 0;

  console.log(totalQuantity);
  const handlePrintClick = () => {
    window.print();
  };
  if (!showed || showed.length === 0) return <p>Нет данных.</p>;
  return (
    <div className="wrapper containerw">
      <div className="containerr  flexbox">
        <div className="  flex-boxx">
          <div className=" leftttt userAdd">
            <div>
              <button className=" right buttonadmm" onClick={handlePrintClick}>
                Печать
              </button>
              <h1>Создано торговой точкой: {storesMap[showed.storeid]?.name}</h1>
              <h2 className="margintop">
                Создано пользователем: {usersMap[showed.creationuserid]?.username}
              </h2>
              <div className="span"></div>
              <h2 className="margintop">Холодный склад</h2>
              <div className="userAdd">
                <div className="flex">
                  <table className="topmin">
                    <thead>
                      <tr>
                        <th>Номер</th>
                        <th>Название вкуса</th>
                        <th>Количество</th>
                      </tr>
                    </thead>
                    <tbody>
                      {showed.flavors &&
                        showed.flavors.split('&').map((flavor, index) => {
                          const [id, quantity] = flavor.split(':');
                          const flavorData = idFlav[parseInt(id)];
                          return (
                            <tr key={id}>
                              <td>{index + 1}</td>
                              <td>{flavorData?.name}</td>
                              <td>{parseInt(quantity)}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="margintop">Общее количество мороженого: {totalQuantity}</p>
              <h2 className="margintop">Сухой склад</h2>
              <div className="userAdd">
                <div className="flex">
                  <table className="topmin">
                    <thead>
                      <tr>
                        <th>Номер</th>
                        <th>Название вкуса</th>
                        <th>Количество</th>
                      </tr>
                    </thead>
                    <tbody>
                      {showed.miscs &&
                        showed.miscs.split('&').map((flavor, index) => {
                          const [id, quantity] = flavor.split(':');
                          const flavorData = idMisc[parseInt(id)];
                          return (
                            <tr key={id}>
                              <td>{index + 1}</td>
                              <td>{flavorData?.name}</td>
                              <td>{parseInt(quantity)}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="margintop">Общее количество товаров: {totalQuantityy}</p>
              <h2 className="margintop">Комментарий к заявке:</h2>
              <p className="margintop">{showed.description}</p>

              <p className="margintop">
                Дата создания заявки: {moment(showed.created).format('DD.MM.YYYY в HH:mm:ss')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowedReq;
