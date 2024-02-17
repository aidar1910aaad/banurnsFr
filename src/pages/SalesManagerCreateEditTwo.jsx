import styled from 'styled-components';
import MainMenuManager from '../components/MainMenuManager';
import NavState from '../contex/navState';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseURL from '../apiConfig/const';
import CreateFlavors from '../components/CreateFlavors';
import CreateMisc from '../components/CreateMisc';
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
    axios.get(baseURL + `/salesmanager/getStoreName/${idStore}`, customConfig).then((resp) => {
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

  const flavorsArray = appStateFlavors.flavors ? appStateFlavors.flavors : [];
  const flavorsJson = flavorsArray.map((flavor, index) => {
    // создаем новый массив объектов
    return { name: flavor, id: index }; // каждый объект содержит свойства name и id
  });

  useEffect(() => {
    setAppStateMisc({ loading: true });
    axios.get(baseURL + '/salesmanager/getMisc', customConfig).then((resp) => {
      const allMisc = resp.data;
      setAppStateMisc({
        loading: false,
        miscss: allMisc,
      });
    });
  }, [setAppStateMisc]);

  useEffect(() => {
    axios.get(baseURL + `/salesmanager/getRequest/${reqId}`, customConfig).then((resp) => {
      const allMisc = resp.data;
      setStoreData({
        storeData: allMisc,
      });
    });
  }, [setStoreData]);

  useEffect(() => {
    setAppStateMisc({ loading: true });
    axios.get(baseURL + `/salesmanager/getMiscListStoreId/${id}`, customConfig).then((resp) => {
      const allMiscF = resp.data;
      console.log(allMiscF);
      setAppStateMiscF({
        loading: false,
        miscssF: allMiscF,
      });
    });
  }, [setAppStateMisc]);

  console.log(appStateFlavors);

  function handleResultChange(newResult) {
    setResult(newResult);
  }
  function handleResultChangeMisc(newResultMisc) {
    setResultMisc(newResultMisc);
  }

  console.log(resultFlavor);

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
          baseURL + '/salesmanager/updateRequest',
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
        <MainMenuManager />
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
              <CreateMisc
                setResultMisc={handleResultChangeMisc}
                miscss={appStateMisc.miscss}
                miscssF={appStateMiscF.miscssF}
                misc={1}></CreateMisc>
              <div className="margintop">
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
