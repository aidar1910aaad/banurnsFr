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
  const [arrMisc, setarrMisc] = useState([]);
  const [username, setUsername] = useState('');

  console.log(idMisc);

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
        const response = await axios.get(
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
      if (showed && showed.storeid) {
        try {
          // Ждем 1000 миллисекунд (1 секунда) перед отправкой запроса
          setTimeout(async () => {
            const response = await axios.get(
              baseURL + `/reqprocessor/getMiscListStoreId/${showed.storeid}`,
              customConfig,
            );
            const storesData = response.data;
            setarrMisc(storesData);
          });
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchData();
  }, [showed]);

  const [updatedFormattedArray, setUpdatedFormattedArray] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (showed && showed.miscs) {
        const inputString = showed.miscs;
        const counts = {};

        inputString.split('&').forEach((pair) => {
          const [id, amount] = pair.split(':');
          counts[id] = (counts[id] || 0) + parseInt(amount, 10);
        });

        const formattedArray = Object.keys(counts).map((id) => {
          const numericId = parseInt(id, 10);
          const item = arrMisc.find((item) => item.miscId === numericId);
          console.log(`miscId: ${id}, item:`, item);
          return {
            miscId: numericId,
            amount: counts[id],
            nameStorage: item ? item.nameStorage : 'Unknown',
          };
        });

        const updatedArray = formattedArray.map((item) => {
          const idMiscItem = idMisc[item.miscId];
          if (idMiscItem) {
            return {
              ...item,
              barcode: idMiscItem.barcode,
              itemName: idMiscItem.name,
            };
          }
          return item;
        });
        console.log(updatedArray);
        setUpdatedFormattedArray(updatedArray); // Обновляем состояние
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [showed, arrMisc]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(baseURL + '/reqprocessor/getFullMisc', customConfig);
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
  if (!showed) {
    return <p>Нет данных.</p>;
  }
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
              <h4 className="margintop">Комментарий к заявке:</h4>
              <p className="margintop">{showed.description}</p>

              <p className="margintop">
                Дата создания заявки: {moment(showed.created).format('DD.MM.YYYY в HH:mm:ss')}
              </p>
              <div className="margintop"></div>
              <div className="margintop"></div>
              <h4 className="margintop">
                Создано пользователем: {usersMap[showed.creationuserid]?.username}
              </h4>
              <div className="spanew"></div>

              {showed.flavors &&
                showed.flavors.split('&').some((flavor) => {
                  const [id] = flavor.split(':');
                  const flavorData = idFlav[parseInt(id)];
                  return flavorData?.narrow === false; // Отобразить блок, если есть хотя бы одно узкое мороженое
                }) && (
                  <>
                    <h3 className="margintop">Холодный склад</h3>
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
                  </>
                )}

              {showed.flavors &&
                showed.flavors.split('&').some((flavor) => {
                  const [id] = flavor.split(':');
                  const flavorData = idFlav[parseInt(id)];
                  return flavorData?.narrow === true; // Отобразить блок, если есть хотя бы одно узкое мороженое
                }) && (
                  <>
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
                  </>
                )}

              {updatedFormattedArray && updatedFormattedArray.length > 0 ? (
                Object.entries(
                  updatedFormattedArray.reduce((groups, item) => {
                    if (!groups[item.nameStorage]) {
                      groups[item.nameStorage] = [];
                    }
                    groups[item.nameStorage].push(item);
                    return groups;
                  }, {}),
                ).map(([groupName, group], index) => (
                  <div key={index}>
                    <h3 className="margintop">{groupName}</h3>
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
                            {group.map((item, index) => (
                              <tr key={index}>
                                <td className="tdd">{index + 1}</td>
                                <td className="tdd">{item.itemName}</td>
                                <td className="tdd">
                                  {item?.barcode !== '-' ? (
                                    <img
                                      style={{ width: '130px', height: '40px' }}
                                      className="barcode"
                                      alt={item?.barcode}
                                      ref={(element) =>
                                        element &&
                                        JsBarcode(element, item?.barcode, {
                                          width: 5,
                                          format: 'CODE128',
                                        })
                                      }
                                    />
                                  ) : null}
                                </td>
                                <td className="tdd">{item.amount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Данные не доступны</p>
              )}
              <p className="margintop">Общее количество товаров: {totalQuantityy}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowedReq;
