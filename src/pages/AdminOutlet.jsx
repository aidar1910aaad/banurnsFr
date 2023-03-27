import React, { useState, useEffect } from 'react';
import NavState from '../contex/navState';
import MainMenuAdmin from '../components/MainMenuAdmin';
import styled from 'styled-components';
import axios from 'axios';
import baseURL from '../apiConfig/const';
import StoreData from '../components/StoreData';

const Container = styled.div`
  background: #fff5;
  height: 800px;
  padding-top: 70px;
  padding-left: 300px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-left: 50px;
`;

const Input = styled.input`
  height: 55px;
  min-width: 40%;
  width: 200px;
  border-radius: 5px;
  background: #3b4148;
  margin-top: 15px;
  font-size: 20px;
  padding: 5px 5px;
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

const Wrapper = styled.div``;

function AdminOutlet() {
  const [name, setName] = useState('');
  const token = localStorage.getItem('Token');
  const customConfig = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer_' + token,
    },
  };
  const userCreate = JSON.stringify({
    name: name,
  });
  const handleSubmit = async (e) => {
    console.log(userCreate);
    try {
      console.log(token);
      await axios.post(baseURL + '/admin/addStore', userCreate, customConfig);

      console.log('addedStore');
    } catch (error) {
      console.log(error.resp);
    }
  };

  const [appState, setAppState] = useState({
    loading: false,
    stores: null,
  });
  useEffect(() => {
    setAppState({ loading: true });
    axios.get(baseURL + '/admin/getAllStores', customConfig).then((resp) => {
      const allstores = resp.data;
      console.log(allstores);
      setAppState({
        loading: false,
        stores: allstores,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAppState]);
  const handleDelete = async (id) => {
    try {
      await axios.post(baseURL + `/admin/deleteStore/${id}`, null, customConfig);
      setAppState((prevState) => ({
        ...prevState,
        stores: prevState.stores.filter((person) => person.id !== id),
      }));
      console.log('deletedUser');
    } catch (error) {
      console.log(error.resp);
    }
  };
  return (
    <Wrapper>
      <NavState>
        <MainMenuAdmin />
      </NavState>
      <Container>
        <h1>Создать точку</h1>
        <Form>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Имя пользователя"></Input>

          <Button onClick={handleSubmit} type="submit">
            Создать
          </Button>
        </Form>
        <h1 className="h1">Список точек</h1>
        <div className="app">
          <StoreData handleDelete={handleDelete} stores={appState.stores} />
        </div>
      </Container>
    </Wrapper>
  );
}

export default AdminOutlet;
