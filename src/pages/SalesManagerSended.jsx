import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MainMenuManager from '../components/MainMenuManager';
import NavState from '../contex/navState';
import baseURL from '../apiConfig/const';
import axios from 'axios';
import OpenedManData from '../components/OpenedManData';

function SalesManagerSended() {
  const token = localStorage.getItem('Token');
  const customConfig = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer_' + token,
    },
  };
  const [appState, setAppState] = useState({
    loading: false,
    opened: null,
  });

  useEffect(() => {
    setAppState({ loading: true });
    axios.get(baseURL + '/salesmanager/getUserRequests', customConfig).then((resp) => {
      const allstores = resp.data;
      setAppState({
        loading: false,
        opened: allstores,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAppState]);

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
  const handleSubmit = async (id) => {
    try {
      await axios.post(baseURL + `/salesmanager/closeActive`, null, customConfig);
      console.log('deletedUser');
      window.location.reload();
    } catch (error) {
      console.log(error.resp);
    }
  };

  const handleShow = async (id) => {
    localStorage.setItem('ReqId', id);
  };

  return (
    <div className="wrapper">
      <NavState>
        <MainMenuManager />
      </NavState>
      <div className="container">
        <div>
          <h1 className="h1-text">Отправленные заявки</h1>
        </div>
        <div className="userAdd">
          <div className="app">
            <OpenedManData
              handleShow={handleShow}
              handleDelete={handleDelete}
              opened={appState.opened}
            />
          </div>
          <div className="flexbox">
            <div className="center-side">
              <button className="buttonadm" onClick={handleSubmit} type="submit">
                Закрыть все заявки
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesManagerSended;
