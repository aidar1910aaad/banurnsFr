import styled from 'styled-components';
import MainMenuManager from '../components/MainMenuManager';
import NavState from '../contex/navState';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseURL from '../apiConfig/const';
import CreateFlavors from '../components/CreateFlavors';
import CreateMisc from '../components/CreateMisc';
import CreateFlavorss from '../components/CreateFlavorss';
import MainMenuReqManager from '../components/MainMenuReqManager';

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

function ReqManagerCreateEdit() {
  const [appStateMisc, setAppStateMisc] = useState({
    loading: false,
    miscss: null,
  });

  const [appStateMiscF, setAppStateMiscF] = useState({
    loading: false,
    miscssF: null,
  });
  const resultStoreId = localStorage.getItem('storeId');
  const [resultStoreId1, seetresultStoreId1] = useState(resultStoreId);
  const [resultDescription, setDescription] = useState('');
  console.log(resultDescription);
  const [resultFlavor, setResult] = useState('');
  const [resultMisc, setResultMisc] = useState('');
  const [storeData, setStoreData] = useState({});

  const navigate = useNavigate();
  const token = localStorage.getItem('Token');

  const reqId = localStorage.getItem('reqId');

  const [storeId, setStoreId] = useState({
    storeNm: null,
  });
  const idStore = localStorage.getItem('selectedStore');

  useEffect(() => {
    setAppStateMisc({ loading: true });
    axios.get(baseURL + `/reqprocessor/getStoreName/${idStore}`, customConfig).then((resp) => {
      const storeName = resp.data;
      setStoreId({
        storeNm: storeName,
      });
    });
  }, [setAppStateMisc]);

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
      .get(baseURL + `/reqprocessor/getColdVisibiltyByStoreId/${id}`, customConfig)
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
            .get(baseURL + `/reqprocessor/getFlavNameByRelId/${relId}`, customConfig)
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
        });
      });
  }, [setAppColdrel, setAppStateFlavors]);
  const flavorsArray = appStateFlavors.flavors ? appStateFlavors.flavors : [];
  const flavorsJson = flavorsArray.map((flavor, index) => {
    // создаем новый массив объектов
    return { name: flavor, id: index }; // каждый объект содержит свойства name и id
  });

  useEffect(() => {
    setAppStateMisc({ loading: true });
    axios.get(baseURL + '/reqprocessor/getMisc', customConfig).then((resp) => {
      const allMisc = resp.data;
      setAppStateMisc({
        loading: false,
        miscss: allMisc,
      });
    });
  }, [setAppStateMisc]);

  useEffect(() => {
    axios.get(baseURL + `/reqprocessor/getRequest/${reqId}`, customConfig).then((resp) => {
      const allMisc = resp.data;
      setStoreData({
        storeData: allMisc,
      });
    });
  }, [setStoreData]);

  console.log(storeData);

  const parseData = (dataString) => {
    const dataArray = dataString.split('&');
    const dataObject = {};
    dataArray.forEach((data) => {
      const [dataId, value] = data.split(':');
      dataObject[dataId] = parseInt(value, 10);
    });
    return dataObject;
  };

  const flavorDataString = storeData?.storeData?.flavors || '';
  const miscsDataString = storeData?.storeData?.miscs || '';

  const flavorDataArray = parseData(flavorDataString);
  const miscsDataArray = parseData(miscsDataString);

  console.log(flavorDataArray); // Для flavors
  console.log(miscsDataArray);

  useEffect(() => {
    setAppStateMisc({ loading: true });
    axios.get(baseURL + `/reqprocessor/getMiscListStoreId/${id}`, customConfig).then((resp) => {
      const allMiscF = resp.data;
      console.log(allMiscF);
      setAppStateMiscF({
        loading: false,
        miscssF: allMiscF,
      });
    });
  }, [setAppStateMisc]);

  useEffect(() => {
    console.log(usersName);
    setAppStateFlavors2({ loading: true });
    axios.get(baseURL + '/reqprocessor/getFlavors', customConfig).then((resp) => {
      const allMisc = resp.data;

      const flavorsMap = {}; // Создаем пустой объект для хранения соответствия айди и названия вкуса

      // Заполняем объект соответствия айди и названия вкуса из массива setAppStateFlavors2
      setAppStateFlavors2.misc.forEach((flavor) => {
        flavorsMap[flavor.id] = flavor.name;
      });
      if (setAppStateFlavors2.misc) {
        setAppStateFlavors2.misc.forEach((flavor) => {
          flavorsMap[flavor.id] = flavor.name;
        });
      }
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
  const pId = localStorage.getItem('pId');
  const usersName = JSON.stringify({
    flavors: resultFlavor,
    miscs: resultMisc,
    storeid: id,
    id: reqId,
    creationuserid: pId,
    description: resultDescription,
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (resultFlavor.length === 0 && resultMisc.length === 0) {
      setError('Пустая заявка');
      alert('Пустая заявка');
    } else {
      try {
        const resp = await axios.post(
          baseURL + '/reqprocessor/updateRequest',
          usersName,
          customConfig,
        );
        console.log('Заявка успешно добавлена');
        navigate('/ReqManager/Req');
      } catch (error) {
        console.log(error.resp);
      }
    }
  };

  return (
    <div className="wrapper">
      <NavState>
        <MainMenuReqManager />
      </NavState>
      <div className="container ">
        <div className="userAdd ">
          <div className="">
            <h1 className="h1-text ">Отправка заявки</h1>
          </div>
          <div className="span"></div>
          <h2 className="h1-text">{storeId.storeNm}</h2>
          <div className="flexbox">
            <form onSubmit={handleSubmit}>
              <CreateFlavorss
                setResult={handleResultChange}
                flavorDataArray={flavorDataArray}
                flavors={flavorsJson}></CreateFlavorss>
              <CreateMisc
                setResultMisc={handleResultChangeMisc}
                miscsDataArray={miscsDataArray}
                miscss={appStateMisc.miscss}
                miscssF={appStateMiscF.miscssF}
                misc={1}></CreateMisc>
              <div className="margintop mglft">
                <textarea
                  className="textarea"
                  placeholder="Комментарий к заявке"
                  onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>
              <Button onClick={handleSubmit} type="submit">
                Сохранить изменения
              </Button>
              {error && <div className="error">{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReqManagerCreateEdit;
