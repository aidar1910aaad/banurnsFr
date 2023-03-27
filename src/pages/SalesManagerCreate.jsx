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

const Container = styled.div`
  background: #fff5;
  height: 800px;
  padding-top: 100px;
`;
const Wrapper = styled.div``;

function SalesManagerCreate() {
  const resultStoreId = localStorage.getItem('storeId');
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
  useEffect(() => {
    setAppStateFlavors({ loading: true });
    axios.get(baseURL + '/salesmanager/getFlavors', customConfig).then((resp) => {
      const allFlavors = resp.data;
      console.log(allFlavors);
      setAppStateFlavors({
        loading: false,
        flavors: allFlavors,
      });
    });
  }, [setAppStateFlavors]);

  const [appStateMisc, setAppStateMisc] = useState({
    loading: false,
    misc: null,
  });
  useEffect(() => {
    setAppStateMisc({ loading: true });
    axios.get(baseURL + '/salesmanager/getMisc', customConfig).then((resp) => {
      const allMisc = resp.data;
      console.log(allMisc);
      setAppStateMisc({
        loading: false,
        misc: allMisc,
      });
    });
  }, [setAppStateMisc]);
  function handleResultChange(newResult) {
    setResult(newResult);
  }
  function handleResultChangeMisc(newResultMisc) {
    setResultMisc(newResultMisc);
  }
  console.log(resultFlavor);
  console.log(resultMisc);
  const usersName = JSON.stringify({
    flavors: resultFlavor,
    miscs: resultMisc,
    storeid: resultStoreId,
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
    <Wrapper className="flex">
      <NavState>
        <MainMenuManager />
      </NavState>
      <Container>
        <h1>Отправка заявки</h1>
        <CreateFlavors
          setResult={handleResultChange}
          flavors={appStateFlavors.flavors}></CreateFlavors>
        <CreateMisc setResultMisc={handleResultChangeMisc} misc={appStateMisc.misc}></CreateMisc>
        <div>
          <textarea
            className="textarea"
            placeholder="Комментарий к заявке"
            onChange={(e) => setDescription(e.target.value)}></textarea>
        </div>
        <Button onClick={handleSubmit} type="submit">
          Отправить
        </Button>
      </Container>
    </Wrapper>
  );
}

export default SalesManagerCreate;
