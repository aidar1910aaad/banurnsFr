import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import NavState from '../contex/navState';
import MainMenuManager from '../components/MainMenuManager';
import axios from 'axios';
import baseURL from '../apiConfig/const';
import StoreManData from '../components/StoreManData';
import { useNavigate } from 'react-router-dom';
import MainMenuReqManager from '../components/MainMenuReqManager';

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

function ReqManagerReqq() {
  const navigate = useNavigate();
  const token = localStorage.getItem('Token');

  const customConfig = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer_' + token,
    },
  };

  const [selectedStore, setSelectedStore] = useState(localStorage.getItem('selectedStore'));

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
    axios.get(baseURL + '/reqprocessor/getAllStores', customConfig).then((resp) => {
      const allstores = resp.data;
      setAppState({
        loading: false,
        stores: allstores,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAppState]);

  const handleSubmit = async (e) => {
    navigate('/ReqManager/Reqq/Create');
  };
  return (
    <div className="wrapper">
      <NavState>
        <MainMenuReqManager />
      </NavState>
      <div className="container">
        <div className="userAdd">
          <div className="flexbox">
            <h1>Выбрать торговую точку</h1>
            <Form>
              <StoreManData onSelectStore={handleSelectStore} stores={appState.stores} />
              <Button onClick={handleSubmit}>Создать</Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReqManagerReqq;
