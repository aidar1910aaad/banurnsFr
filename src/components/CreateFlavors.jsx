import React, { useState, useEffect } from 'react';
import '../css/style.css';
import axios from 'axios';
import baseURL from '../apiConfig/const';

function CreateFlavors(props) {
  const { setResult } = props;
  const token = localStorage.getItem('Token');

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
      console.log(allMisc);

      setAppStateFlavors2({
        flavorsss: allMisc,
      });
    });
  }, [setAppStateFlavors2]);

  const { flavors } = props;
  const flav = appStateFlavors2.flavorsss ? appStateFlavors2.flavorsss : [];
  console.log(flav);
  console.log(flavors);

  const flavorsArray = flavors.map((flavor) => flavor.name);

  console.log(flavorsArray);
  const flavorsJson = flavorsArray.map((flavorr) => {
    const foundMisc =
      appStateFlavors2.flavorsss &&
      appStateFlavors2.flavorsss.find((name) => name.name === flavorr);
    if (foundMisc) {
      console.log(foundMisc);
      return { name: foundMisc.name, id: foundMisc.id };
    }
    // Возвращаем объект с id = null, так как у строки нет свойства id
    return { name: flavorr, id: null };
  });

  console.log(flavorsJson);
  if (!flavors || flavors.length === 0) return <p>Нет данных.</p>;

  return (
    <div>
      <h2>Мороженое в контейнерах</h2>
      <div className="span"></div>
      <p>Введите количество в кг*</p>
      <div className="margintop">
        {flavorsJson.map((flavor) => (
          <div key={flavor.id}>
            <p> {flavor.name}</p>
            <input onChange={(e) => handleInputChange(e, flavor.id)} type="number"></input>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CreateFlavors;
