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
  console.log(showed);
  const [usersMap, setUsersMap] = useState({});
  const [stores, setStores] = useState([]);
  const [storesMap, setStoresMap] = useState({});
  const [idFlav, setIdFlav] = useState([]);
  const [idMisc, setIdMisc] = useState([]);
  const [arrMisc, setarrMisc] = useState([]);
  const [username, setUsername] = useState('');

  console.log(idMisc);

  const [isLoading, setIsLoading] = useState(true);

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

  if (!showed) {
    return <p>Нет данных.</p>;
  }

  const flavors = showed.flavs || [];
  const miscs = showed.miscs || [];

  const groupedFlavors = groupBySectionName(flavors);
  if (!Array.isArray(flavors)) {
    return {}; // Return an empty object if flavors is not an array
  }

  function groupBySectionName(flavors) {
    return flavors.reduce((acc, flavor) => {
      const sectionName = flavor.sectionName;
      if (!acc[sectionName]) {
        acc[sectionName] = [];
      }
      acc[sectionName].push(flavor);
      return acc;
    }, {});
  }
  function groupByStoragename(items) {
    if (!Array.isArray(items)) {
      return {}; // Return an empty object if items is not an array
    }

    return items.reduce((acc, item) => {
      const storagename = item.storagename;
      if (!acc[storagename]) {
        acc[storagename] = [];
      }
      acc[storagename].push(item);
      return acc;
    }, {});
  }

  // Function to calculate the total quantity for a group of items
  function calculateTotalQuantity(group) {
    return group.reduce((total, item) => total + item.quantity, 0);
  }

  const groupedMiscs = groupByStoragename(miscs);

  const handlePrintClick = () => {
    window.print();
  };
  if (flavors.length === 0 && miscs.length === 0) {
    return <p>Нет данных о мороженом и товарах.</p>;
  }
  if (!showed || showed.length === 0) return <p>Нет данных.</p>;
  if (!showed) {
    return <p>Нет данных.</p>;
  }

  return (
    <div className="wrapper containerw">
      <div className="containerrr">
        <div className="flex-boxx">
          <div className="leftttt userAddde">
            <div>
              <button className=" right buttonadmmin" onClick={handlePrintClick}>
                Печать
              </button>

              <h3 className="margintop">Создано торговой точкой: {showed.storename}</h3>
              <h4 className="margintop">Комментарий к заявке:</h4>
              <p className="margintop">{showed.description}</p>

              <p className="margintop">
                Дата создания заявки: {moment(showed.created).format('DD.MM.YYYY в HH:mm:ss')}
              </p>
              <div className="margintop"></div>
              <div className="margintop"></div>
              <h4 className="margintop">Создано пользователем:{showed.username}</h4>
              <div className="spanew"></div>

              {/* Your existing code for store name, description, etc. */}

              {/* Display grouped flavors */}
              {Object.entries(groupedFlavors).map(([storagename, flavors]) => (
                <div key={storagename}>
                  <h3 className="margintop">{storagename}</h3>
                  <div className="userAdddd">
                    <div className="flex">
                      <table className="topmin table">
                        <thead>
                          <tr>
                            <th className="ff">Наименование</th>
                            <th className="ff">Количество</th>
                          </tr>
                        </thead>
                        <tbody>
                          {flavors.map((flavor) => (
                            <tr key={flavor.id}>
                              <td className="tdd faf">{flavor.flavorName}</td>
                              <td className="tdd tdleft">{flavor.quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* Calculate and display total quantity for flavors in this group */}
                  <p className="margintop">
                    Общее количество мороженого: {calculateTotalQuantity(flavors)}
                  </p>
                </div>
              ))}

              {/* Display grouped miscs */}
              {Object.entries(groupedMiscs).map(([storagename, miscs]) => (
                <div key={storagename}>
                  <h3 className="margintop">{storagename}</h3>
                  <div className="userAdddd">
                    <div className="flex">
                      <table className="topmin table">
                        <thead>
                          <tr className="ff">
                            <th className="ff">Номер</th>
                            <th className="ff">Наименование</th>
                            <th className="ff">Количество</th>
                            <th className="ff">Товарный код</th>
                          </tr>
                        </thead>
                        <tbody>
                          {miscs.map((misc, index) => (
                            <tr key={misc.id}>
                              <td className="tdd">{index + 1}</td>
                              <td className="tdd">{misc.miscName}</td>
                              <td className="tdd">{misc.quantity}</td>
                              <td className="tdd">
                                {misc?.barcode !== '-' ? (
                                  <img
                                    style={{ width: '130px', height: '40px' }}
                                    className="barcode"
                                    alt={misc?.barcode}
                                    ref={(element) =>
                                      element &&
                                      JsBarcode(element, misc?.barcode, {
                                        width: 5,
                                        format: 'CODE128',
                                      })
                                    }
                                  />
                                ) : null}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* Calculate and display total quantity for miscs in this group */}
                  <p className="margintop">
                    Общее количество товаров: {calculateTotalQuantity(miscs)}
                  </p>
                </div>
              ))}

              {/* Your existing code for total quantity of all items */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowedReq;
