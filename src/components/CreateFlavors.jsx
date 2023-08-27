import React, { useState, useEffect } from 'react';
import '../css/style.css';
import axios from 'axios';
import baseURL from '../apiConfig/const';

function CreateFlavors(props) {
  const { setResult } = props;
  const token = localStorage.getItem('Token');
  const [flavorsJsonn, setFlavorsJson] = useState([]);
  const [sortOrder, setSortOrder] = useState('ascending'); // Инициализируйте состояние sortOrder

  const customConfig = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer_' + token,
    },
  };

  const [name, setName] = useState([]);
  const [appStateFlavors2, setAppStateFlavors2] = useState({
    loading: false,
    flavorsss: null,
  });
  const [flavorsVisible, setFlavorsVisible] = useState(true); // State for toggling visibility

  useEffect(() => {
    const result = name
      .filter((value) => value && value[1] !== '' && value[1] !== '0')
      .map((value, index) => `${value[0]}:${value[1]}`)
      .join('&');
    setResult(result);
  }, [name, setResult]);

  function handleInputChange(event, index) {
    const newInputs = [...name];
    newInputs[index] = [index, event.target.value];
    setName(newInputs);
  }

  useEffect(() => {
    setAppStateFlavors2({ loading: true });
    axios.get(baseURL + '/salesmanager/getFlavors', customConfig).then((resp) => {
      const allMisc = resp.data;

      setAppStateFlavors2({
        flavorsss: allMisc,
      });
    });
  }, [setAppStateFlavors2]);

  const { flavors } = props;
  const flav = appStateFlavors2.flavorsss ? appStateFlavors2.flavorsss : [];

  const flavorsArray = flavors.map((flavor) => flavor.name);

  const flavorsJson = flavorsArray.map((flavorr) => {
    const foundMisc =
      appStateFlavors2.flavorsss &&
      appStateFlavors2.flavorsss.find((name) => name.name === flavorr);
    if (foundMisc) {
      return { name: foundMisc.name, id: foundMisc.id, popularity: foundMisc.popularity };
    }
    // Return an object with id = null since the name doesn't have an associated id
    return { name: flavorr, id: null };
  });
  flavorsJson.sort((a, b) => b.popularity - a.popularity);
  const handleSortClick = () => {
    const sortedFlavorsJson = [...flavorsJson].sort((a, b) => {
      if (sortOrder === 'ascending') {
        return a.popularity - b.popularity;
      } else {
        return b.popularity - a.popularity;
      }
    });

    setFlavorsJson(sortedFlavorsJson);
    setSortOrder((prevSortOrder) => (prevSortOrder === 'ascending' ? 'descending' : 'ascending'));
  };

  if (!flavors || flavors.length === 0) return <p>Нет данных.</p>;

  const toggleFlavorsVisibility = () => {
    setFlavorsVisible(!flavorsVisible);
  };

  return (
    <div className="h2 ">
      <h2>Мороженое в контейнерах</h2>
      <div className="span"></div>
      <p
        style={{
          marginTop: '10px',
        }}>
        Введите количество в кг:{' '}
      </p>
      <div className="flexx space">
        <button
          type="button"
          style={{
            backgroundColor: '#f5f5f5',
            border: 'none',
            width: '70%',
            borderRadius: '4px',
            padding: '8px 10px',
            color: '#333',
            cursor: 'pointer',
            outline: 'none',
            marginTop: '20px',
            transition: 'background-color 0.3s ease',
          }}
          onClick={toggleFlavorsVisibility}>
          {flavorsVisible ? 'Свернуть' : 'Показать'}
        </button>
        <h5
          onClick={handleSortClick}
          style={{
            backgroundColor: '#f5f5f5',
            border: 'none',
            width: '30%',
            borderRadius: '4px',
            padding: '8px 10px',
            color: '#333',
            cursor: 'pointer',
            outline: 'none',
            marginTop: '20px',
            fontSize: '12px',
            transition: 'background-color 0.3s ease',
            marginLeft: '3px',
          }}>
          Популярность
        </h5>
      </div>
      {flavorsVisible && (
        <div className="margintop">
          {(flavorsJsonn.length === 0 ? flavorsJson : flavorsJsonn).map((flavor) => (
            <div className="flexx" key={flavor.id}>
              <div className="firstSide">
                <p className="">{flavor.name}</p>
              </div>
              <div className="secondSide">
                {' '}
                <input
                  className="inputtt"
                  onChange={(e) => handleInputChange(e, flavor.id)}
                  type="number"
                />
              </div>
              <div className="thirdSide">
                {' '}
                <p>{flavor.popularity}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CreateFlavors;
