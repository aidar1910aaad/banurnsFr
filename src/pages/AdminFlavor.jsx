import React, { useState, useEffect } from 'react';
import NavState from '../contex/navState';
import MainMenuAdmin from '../components/MainMenuAdmin';
import styled from 'styled-components';
import axios from 'axios';
import baseURL from '../apiConfig/const';
import FlavorData from '../components/FlavorData';

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

function AdminFlavor() {
  const [name, setName] = useState('');
  const [description, setDesc] = useState('');
  const [quantity, setVal] = useState('');
  const [barcode, setBarCode] = useState('');
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
    description: description,
    barcode: barcode,
    quantity: quantity,
  });
  const handleSubmit = async (e) => {
    console.log(userCreate);
    try {
      console.log(token);
      await axios.post(baseURL + '/admin/addFlavor', userCreate, customConfig);

      console.log('addedFlavor');
    } catch (error) {
      console.log(error.resp);
    }
  };

  const [appState, setAppState] = useState({
    loading: false,
    flavors: null,
  });
  useEffect(() => {
    setAppState({ loading: true });
    axios.get(baseURL + '/admin/getFlavors', customConfig).then((resp) => {
      const allflavor = resp.data;
      console.log(allflavor);
      setAppState({
        loading: false,
        flavors: allflavor,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAppState]);

  const handleDelete = async (id) => {
    try {
      await axios.post(baseURL + `/admin/deleteFlavor/${id}`, null, customConfig);
      setAppState((prevState) => ({
        ...prevState,
        flavors: prevState.flavors.filter((person) => person.id !== id),
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
        <h1>Добавить вкус мороженого</h1>
        <Form>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Вкус мороженого"></Input>
          <Input
            value={description}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Описание"></Input>
          <Input
            value={quantity}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Количество"></Input>
          <Input
            value={barcode}
            onChange={(e) => setBarCode(e.target.value)}
            placeholder="Код товара"></Input>

          <Button onClick={handleSubmit} type="submit">
            Создать
          </Button>
        </Form>
        <h1 className="h1">Список вкусов</h1>
        <div className="app">
          <FlavorData handleDelete={handleDelete} flavors={appState.flavors} />
        </div>
      </Container>
    </Wrapper>
  );
}

export default AdminFlavor;
