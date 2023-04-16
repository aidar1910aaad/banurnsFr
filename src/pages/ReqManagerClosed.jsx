import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MainMenuReqManager from '../components/MainMenuReqManager';
import NavState from '../contex/navState';
import baseURL from '../apiConfig/const';
import axios from 'axios';
import ClosedReqData from '../components/ClosedReqData';
import AllClosedReq from '../components/AllClosedReq';

function ReqManagerClosed() {
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
    closed: null,
  });

  useEffect(() => {
    setAppState({ loading: true });
    axios.get(baseURL + '/reqprocessor/getAllRequests', customConfig).then((resp) => {
      const allstores = resp.data;
      console.log(allstores);
      setAppState({
        loading: false,
        closed: allstores,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAppState]);

  const handleDelete = async (id) => {
    try {
      await axios.post(baseURL + `/admin/closeRequest/${id}`, null, customConfig);
      setAppState((prevState) => ({
        ...prevState,
        closed: prevState.closed.filter((person) => person.id !== id),
      }));
      console.log('deletedUser');
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
        <MainMenuReqManager />
      </NavState>
      <div className="container">
        <div>
          <h1 className="h1-text">Закрытые заявки</h1>
        </div>
        <div className="userAdd">
          <div className="app">
            <ClosedReqData
              handleShow={handleShow}
              handleDelete={handleDelete}
              closed={appState.closed}
            />
          </div>
          <div className="flexbox">
            <div className="left-side"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReqManagerClosed;
