import React, { useState, useEffect } from 'react';
import NavState from '../contex/navState';
import MainMenuAdmin from '../components/MainMenuAdmin';
import styled from 'styled-components';
import axios from 'axios';
import baseURL from '../apiConfig/const';
import MiscData from '../components/MiscData';

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

function AdminMisc() {
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
      await axios.post(baseURL + '/admin/addMisc', userCreate, customConfig);

      console.log('addedFlavor');
    } catch (error) {
      console.log(error.resp);
    }
  };

  const [appState, setAppState] = useState({
    loading: false,
    miscs: null,
  });
  useEffect(() => {
    setAppState({ loading: true });
    axios.get(baseURL + '/admin/getAllMisc', customConfig).then((resp) => {
      const allMisc = resp.data;
      console.log(allMisc);
      setAppState({
        loading: false,
        miscs: allMisc,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAppState]);
  const handleDelete = async (id) => {
    try {
      await axios.post(baseURL + `/admin/deleteMisc/${id}`, userCreate, customConfig);
      setAppState((prevState) => ({
        ...prevState,
        miscs: prevState.miscs.filter((person) => person.id !== id),
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
        <h1>Добавить товар</h1>
        <Form>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Название товара"></Input>
          <Input
            value={description}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Количество в упаковке"></Input>
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
        <h1 className="h1">Список товаров</h1>
        <div className="app">
          <MiscData handleDelete={handleDelete} miscs={appState.miscs} />
        </div>
      </Container>
    </Wrapper>
  );
}

export default AdminMisc;
