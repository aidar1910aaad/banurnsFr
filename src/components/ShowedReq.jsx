import React, { useEffect, useState } from 'react';
import '../css/style.css';
import { Link } from 'react-router-dom';
import moment from 'moment/moment';
import axios from 'axios';
import baseURL from '../apiConfig/const';
import JsBarcode from 'jsbarcode';
import '../css/style.css';

function ShowedReq(props) {
  const { showed } = props;

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
  const totalQuantityNarrow =
    showed && showed.flavors
      ? showed.flavors
          .split('&')
          .map((flavor) => {
            const [id, quantity] = flavor.split(':');
            const flavorData = idFlav[parseInt(id)];
            if (flavorData?.narrow === true) {
              return parseInt(quantity);
            }
            return 0;
          })
          .reduce((acc, curr) => acc + curr, 0)
      : 0;

  const totalQuantity =
    showed && showed.flavors
      ? showed.flavors
          .split('&')
          .map((flavor) => {
            const [id, quantity] = flavor.split(':');
            const flavorData = idFlav[parseInt(id)];
            if (flavorData?.narrow === false) {
              return parseInt(quantity);
            }
            return 0;
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
      <div className="containerrr">
        <div className="  flex-boxx">
          <div className=" leftttt userAddde">
            <div>
              <button className=" right buttonadmmin" onClick={handlePrintClick}>
                Печать
              </button>

              <h3 className="margintop">
                Создано торговой точкой: {storesMap[showed.storeid]?.name}
              </h3>
              <div className="margintop"></div>
              <div className="margintop"></div>
              <h4 className="margintop">
                Создано пользователем: {usersMap[showed.creationuserid]?.username}
              </h4>
              <div className="spanew"></div>

              <h3>Холодный склад</h3>
              <div className="userAdddd">
                <div className="flex">
                  <table className="topmin table">
                    <thead>
                      <tr>
                        <th className="ff">Номер</th>
                        <th className="ff">Название вкуса</th>
                        <th className="ff">Количество</th>
                      </tr>
                    </thead>
                    <tbody>
                      {showed.flavors &&
                        showed.flavors.split('&').map((flavor, index) => {
                          const [id, quantity] = flavor.split(':');
                          const flavorData = idFlav[parseInt(id)];
                          // Фильтрация для широких мороженых (narrow: false)
                          if (flavorData?.narrow === false) {
                            return (
                              <tr key={id}>
                                <td className="tdd ff">{index + 1}</td>
                                <td className="tdd ff">{flavorData?.name}</td>
                                <td className="tdd">{parseInt(quantity)}</td>
                              </tr>
                            );
                          }
                          return null;
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="margintop">Общее количество мороженого: {totalQuantity}</p>

              <h3 className="margintop">Холодный узкий склад</h3>
              <div className="userAdddd">
                <div className="flex">
                  <table className="topmin table">
                    <thead>
                      <tr className="ff">
                        <th className="ff">Номер</th>
                        <th className="ff">Название вкуса</th>
                        <th className="ff">Количество</th>
                      </tr>
                    </thead>
                    <tbody>
                      {showed.flavors &&
                        showed.flavors.split('&').map((flavor, index) => {
                          const [id, quantity] = flavor.split(':');
                          const flavorData = idFlav[parseInt(id)];
                          // Фильтрация для узких мороженых (narrow: true)
                          if (flavorData?.narrow === true) {
                            return (
                              <tr key={id}>
                                <td className="tdd">{index + 1}</td>
                                <td className="tdd">{flavorData?.name}</td>
                                <td className="tdd">{parseInt(quantity)}</td>
                              </tr>
                            );
                          }
                          return null;
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="margintop">Общее количество мороженого: {totalQuantityNarrow}</p>

              <h3 className="margintop">Сухой склад</h3>
              <div className="userAdddd">
                <div className="flex">
                  <table className="topmin tablew">
                    <thead>
                      <tr className="ff">
                        <th className="ff">Номер</th>
                        <th className="ff">Название товара</th>
                        <th className="ff">Товарный код</th>
                        <th className="ff">Количество</th>
                      </tr>
                    </thead>
                    <tbody>
                      {showed.miscs &&
                        showed.miscs.split('&').map((flavor, index) => {
                          const [id, quantity] = flavor.split(':');
                          const flavorData = idMisc[parseInt(id)];
                          return (
                            <tr key={id}>
                              <td className="tdd">{index + 1}</td>
                              <td className="tdd">{flavorData?.name}</td>
                              <td className="tdd">
                                <img
                                  style={{ width: '130px', height: '40px' }}
                                  className="barcode"
                                  alt={flavorData?.barcode}
                                  ref={(element) =>
                                    element &&
                                    JsBarcode(element, flavorData?.barcode, {
                                      width: 5,
                                      format: 'CODE128',
                                    })
                                  }
                                />
                              </td>
                              <td className="tdd">{parseInt(quantity)}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="margintop">Общее количество товаров: {totalQuantityy}</p>
              <h4 className="margintop">Комментарий к заявке:</h4>
              <p className="margintop">{showed.description}</p>

              <p className="margintop">
                Дата создания заявки: {moment(showed.created).format('DD.MM.YYYY в HH:mm:ss')}
              </p>
              <p className="margintope"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowedReq;
