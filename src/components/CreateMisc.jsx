import React, { useState, useEffect } from 'react';
import '../css/style.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseURL from '../apiConfig/const';
import CreateFlavors from '../components/CreateFlavors';

function CreateMisc(props) {
  const { setResultMisc, miscss } = props;
  const [name, setName] = useState([]);
  console.log(miscss);

  useEffect(() => {
    const result = name
      .filter((value) => value && value[1] !== '' && value[1] !== '0')
      .map((value, index) => `${value[0]}:${value[1]}`)
      .join('&');
    setResultMisc(result);
  }, [name, setResultMisc]);

  function handleInputChange(event, index) {
    const newInputs = [...name];
    newInputs[index] = [index, event.target.value];
    setName(newInputs);
  }

  const resultStoreId = localStorage.getItem('storeId');
  const [resultStoreId1, seetresultStoreId1] = useState(resultStoreId);
  const [resultDescription, setDescription] = useState('');
  const [resultFlavor, setResult] = useState('');
  const [resultMisc, setResultMisc2] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('Token');

  const customConfig = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer_' + token,
    },
  };
  const [appStateFlavors, setAppStateFlavors] = useState({
    loading: false,
    flavors: null,
  });
  const [appStateFlavors2, setAppStateFlavors2] = useState({
    loading: false,
    flavors: null,
  });
  const [appColdrel, setAppColdrel] = useState({ rels: null });

  useEffect(() => {
    const id = localStorage.getItem('selectedStore');
    axios
      .get(baseURL + `/salesmanager/getDryVisibiltyByStoreId/${id}`, customConfig)
      .then((resp) => {
        const allMisc = resp.data;
        setAppColdrel({
          rels: allMisc,
        });

        // Получаем массив relid из объектов в allMisc
        const relIds = allMisc.map((misc) => misc.relid);

        // Отправляем запрос на сервер для каждого relid
        const allFlavors = []; // инициализируем пустой массив для названий вкусов
        relIds.forEach((relId) => {
          axios
            .get(baseURL + `/salesmanager/getMiscNameByRelId/${relId}`, customConfig)
            .then((resp) => {
              const flavors = resp.data;
              if (!allFlavors.includes(flavors)) {
                // проверяем, есть ли элемент уже в массиве
                allFlavors.push(flavors); // добавляем названия вкусов в массив, если его нет
                setAppStateFlavors({
                  flavors: allFlavors,
                });
              }
            });
          const flavorsMap = {};
          if (miscss) {
            miscss.forEach((misc) => {
              flavorsMap[misc.name] = misc.id;
            });

            const allFlavors = setAppStateFlavors.flavors.map((flavor) => {
              if (flavorsMap[flavor.name]) {
                return { ...flavor, id: flavorsMap[flavor.name] };
              }
              return flavor;
            });

            setAppStateFlavors({
              flavors: allFlavors,
            });
          }
        });
      });
  }, [miscss, setAppColdrel, setAppStateFlavors]);
  console.log(appStateFlavors.flavors);
  const flavorsArray = appStateFlavors.flavors ? appStateFlavors.flavors : [];
  console.log(flavorsArray);
  const flavorsJson = flavorsArray.map((flavor, index) => {
    const foundMisc = miscss.find((misc) => misc.name === flavor);
    if (foundMisc) {
      return { name: foundMisc.name, id: foundMisc.id };
    }
    return { name: flavor, id: index };
  });
  console.log(flavorsJson);

  useEffect(() => {
    setAppStateFlavors2({ loading: true });
  }, [miscss, setAppStateFlavors, setAppStateFlavors2]);

  console.log(appStateFlavors.flavors + 'fdfsfsdf');
  const { misc } = props;
  if (!misc || misc.length === 0) return <p className="margintop">Нет данных.</p>;

  return (
    <div className="h2">
      <h2>Дополнительное</h2>
      {flavorsJson.map((miss) => (
        <div className="h3" key={miss.id}>
          <p> {miss.name}</p>

          <input onChange={(e) => handleInputChange(e, miss.id)} type="number"></input>
        </div>
      ))}
    </div>
  );
}

export default CreateMisc;
