import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MainMenuReqManager from '../components/MainMenuReqManager';
import NavState from '../contex/navState';
import baseURL from '../apiConfig/const';
import axios from 'axios';
import OpenedReqData from '../components/OpenedReqData';

const Container = styled.div`
  background: #fff5;
  height: 800px;
  padding-top: 70px;
  padding-left: 300px;
`;
const Wrapper = styled.div``;

function ReqManagerReq() {
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
    axios.get(baseURL + '/reqprocessor/getAllRequests', customConfig).then((resp) => {
      const allstores = resp.data;
      console.log(allstores);
      setAppState({
        loading: false,
        opened: allstores,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAppState]);

  const handleDelete = async (id) => {
    try {
      await axios.post(baseURL + `/reqprocessor/closeRequest/${id}`, null, customConfig);
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
      await axios.post(baseURL + `/reqprocessor/closeActive`, null, customConfig);
      console.log('deletedUser');
    } catch (error) {
      console.log(error.resp);
    }
  };

  const handleShow = async (id) => {
    localStorage.setItem('ReqId', id);
  };

  return (
    <Wrapper>
      <NavState>
        <MainMenuReqManager />
      </NavState>
      <Container>
        <h1>Поступившие заявки</h1>
        <div className="app">
          <OpenedReqData
            handleShow={handleShow}
            handleDelete={handleDelete}
            opened={appState.opened}
          />
        </div>
        <button onClick={handleSubmit} type="submit">
          Закрыть все заявки
        </button>
      </Container>
    </Wrapper>
  );
}

export default ReqManagerReq;
