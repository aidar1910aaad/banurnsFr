import styled from 'styled-components';
import MainMenuManager from '../components/MainMenuManager';
import NavState from '../contex/navState';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseURL from '../apiConfig/const';
import CreateFlavors from '../components/CreateFlavors';
import CreateMisc from '../components/CreateMisc';

const Button = styled.button`
  height: 55px;
  border: none;
  padding: 15px 20px;
  background-color: #3b4148;
  color: #fff;
  cursor: pointer;
  margin-top: 15px;
  border-radius: 5px;
  font-size: 20px;
`;

function SalesManagerCreate() {
  const resultStoreId = localStorage.getItem('storeId');
  console.log(resultStoreId);
  const [resultStoreId1, seetresultStoreId1] = useState(resultStoreId);
  const [resultDescription, setDescription] = useState('');
  console.log(resultDescription);
  const [resultFlavor, setResult] = useState('');
  const [resultMisc, setResultMisc] = useState('');

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
      .get(baseURL + `/salesmanager/getColdVisibiltyByStoreId/${id}`, customConfig)
      .then((resp) => {
        const allMisc = resp.data;
        console.log('1231231');
        console.log(allMisc);
        setAppColdrel({
          rels: allMisc,
        });

        // Получаем массив relid из объектов в allMisc
        const relIds = allMisc.map((misc) => misc.relid);

        // Отправляем запрос на сервер для каждого relid
        const allFlavors = []; // инициализируем пустой массив для названий вкусов
        relIds.forEach((relId) => {
          axios
            .get(baseURL + `/salesmanager/getFlavNameByRelId/${relId}`, customConfig)
            .then((resp) => {
              const flavors = resp.data;
              console.log(flavors);
              if (!allFlavors.includes(flavors)) {
                // проверяем, есть ли элемент уже в массиве
                allFlavors.push(flavors); // добавляем названия вкусов в массив, если его нет
                setAppStateFlavors({
                  flavors: allFlavors,
                });
              }
            });
        });
      });
  }, [setAppColdrel, setAppStateFlavors]);
  const flavorsArray = appStateFlavors.flavors ? appStateFlavors.flavors : [];
  const flavorsJson = flavorsArray.map((flavor, index) => {
    // создаем новый массив объектов
    return { name: flavor, id: index }; // каждый объект содержит свойства name и id
  });
  console.log(flavorsJson);

  const [appStateMisc, setAppStateMisc] = useState({
    loading: false,
    miscss: null,
  });
  useEffect(() => {
    setAppStateMisc({ loading: true });
    axios.get(baseURL + '/salesmanager/getMisc', customConfig).then((resp) => {
      const allMisc = resp.data;
      console.log(allMisc);
      setAppStateMisc({
        loading: false,
        miscss: allMisc,
      });
    });
  }, [setAppStateMisc]);

  useEffect(() => {
    setAppStateFlavors2({ loading: true });
    axios.get(baseURL + '/salesmanager/getFlavors', customConfig).then((resp) => {
      const allMisc = resp.data;
      console.log(allMisc);

      const flavorsMap = {}; // Создаем пустой объект для хранения соответствия айди и названия вкуса

      // Заполняем объект соответствия айди и названия вкуса из массива setAppStateFlavors2
      setAppStateFlavors2.misc.forEach((flavor) => {
        flavorsMap[flavor.id] = flavor.name;
      });

      // Заменяем айди на соответствующие названия вкусов из объекта соответствия
      const allFlavors = allMisc.map((misc) => ({
        ...misc,
        name: flavorsMap[misc.id],
      }));

      setAppStateFlavors({
        flavors: allFlavors,
      });
    });
  }, [setAppStateFlavors, setAppStateFlavors2]);

  console.log(appStateFlavors);

  function handleResultChange(newResult) {
    setResult(newResult);
  }
  function handleResultChangeMisc(newResultMisc) {
    setResultMisc(newResultMisc);
  }

  console.log(resultFlavor);
  console.log(resultMisc);
  const id = localStorage.getItem('selectedStore');
  const usersName = JSON.stringify({
    flavors: resultFlavor,
    miscs: resultMisc,
    storeid: id,
    description: resultDescription,
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(usersName);
    try {
      const resp = await axios.post(baseURL + '/salesmanager/addRequest', usersName, customConfig);
      console.log('Заявка успешно добавлена');
      navigate('/SalesManager');
    } catch (error) {
      console.log(error.resp);
    }
  };
  return (
    <div className="wrapper">
      <NavState>
        <MainMenuManager />
      </NavState>
      <div className="container">
        <div className="userAdd">
          <div>
            <h1 className="h1-text">Отправка заявки</h1>
          </div>
          <div className="span"></div>
          <div className="flexbox">
            <form onSubmit={handleSubmit}>
              <CreateFlavors setResult={handleResultChange} flavors={flavorsJson}></CreateFlavors>
              <CreateMisc
                setResultMisc={handleResultChangeMisc}
                miscss={appStateMisc.miscss}
                misc={1}></CreateMisc>
              <div className="margintop">
                <textarea
                  className="textarea"
                  placeholder="Комментарий к заявке"
                  onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>
              <Button onClick={handleSubmit} type="submit">
                Отправить
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesManagerCreate;
