import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import NavState from '../contex/navState';
import MainMenuManager from '../components/MainMenuManager';
import axios from 'axios';
import baseURL from '../apiConfig/const';
import StoreManData from '../components/StoreManData';
import { useNavigate } from 'react-router-dom';
import MainMenuReqManager from '../components/MainMenuReqManager';
import OpenedReqData from '../components/OpenedReqData';
import OpenedReqDataEdit from '../components/OpenedReqDataEdit';
import OpenedManDataEdit from '../components/OpenedManDataEdit';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-left: 50px;
`;

const Button = styled.button`
  height: 55px;
  border: none;
  padding: 15px 20px;
  width: 150px;
  background-color: #3b4148;
  color: #fff;
  cursor: pointer;
  margin-top: 15px;
  border-radius: 5px;
  font-size: 20px;
`;

function SalesManagerReq() {
  const navigate = useNavigate();
  const [selectedStore, setSelectedStore] = useState(localStorage.getItem('selectedStore'));
  const token = localStorage.getItem('Token');
  const [activeApp, setActiveApp] = useState({
    app: null,
  });

  const customConfig = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer_' + token,
    },
  };

  const handleSelectStore = (storeId) => {
    setSelectedStore(storeId);
    localStorage.setItem('selectedStore', storeId);
  };

  const [appState, setAppState] = useState({
    loading: false,
    stores: null,
  });
  useEffect(() => {
    setAppState({ loading: true });
    axios.get(baseURL + '/salesmanager/getAllStores', customConfig).then((resp) => {
      const allstores = resp.data;
      setAppState({
        loading: false,
        stores: allstores,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAppState]);
  useEffect(() => {
    axios
      .get(baseURL + `/salesmanager/getActiveRequests/${selectedStore}`, customConfig)
      .then((resp) => {
        const activeApp = resp.data;
        setActiveApp({ app: activeApp });
      })
      .catch((error) => {
        console.error('Ошибка при выполнении GET-запроса:', error);
      });
  }, [selectedStore]);

  console.log(activeApp);
  const handleShow = async (id) => {
    localStorage.setItem('ReqId', id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.post(baseURL + `/salesmanager/closeRequest/${id}`, null, customConfig);
      setAppState((prevState) => ({
        ...prevState,
        opened: prevState.opened.filter((person) => person.id !== id),
      }));
      console.log('deletedUser');
    } catch (error) {
      console.log(error.resp);
    }
  };

  const handleSubmit = async (e) => {
    navigate('/SalesManager/Req/Create');
  };
  return (
    <div className="wrapper">
      <NavState>
        <MainMenuManager />
      </NavState>
      <div className="container">
        <div className="userAdd">
          <div className="flexbox mgdown">
            <h1 className="Hadapt">Выбрать торговую точку</h1>
            <Form>
              <StoreManData onSelectStore={handleSelectStore} stores={appState.stores} />
              <Button onClick={handleSubmit}>Создать</Button>
            </Form>
          </div>
          <div className="flexbox">
            <h1 className="Hadapt full">Изменить торговую точку</h1>
            <OpenedManDataEdit opened={activeApp.app} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesManagerReq;
