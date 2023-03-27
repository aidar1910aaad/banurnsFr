import React, { useState, useEffect } from 'react';
import NavState from '../contex/navState';
import MainMenuAdmin from '../components/MainMenuAdmin';
import styled from 'styled-components';
import axios from 'axios';
import baseURL from '../apiConfig/const';
import UserData from '../components/UserData';

const Container = styled.div`
  background: #fff1;
  height: 800px;
  padding-top: 100px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-left: 50px;
`;

const Input = styled.input`
  height: 55px;
  min-width: 40%;
  width: 400px;
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

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

function AdminUserManage() {
  const [username, setName] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [roleId, setRole] = useState('');
  const token = localStorage.getItem('Token');
  const customConfig = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
      'X-Requested-With': 'XMLHttpRequest',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      Authorization: 'Bearer_' + token,
    },
  };
  const customConfig2 = {
    headers: {
      Authorization: 'Bearer_' + token,
    },
  };
  const userCreate = JSON.stringify({
    username: username,
    password: password,
    firstname: firstname,
    lastname: lastname,
    roleId: roleId,
  });
  const handleSubmit = async (e) => {
    console.log(userCreate);
    try {
      console.log(token);
      await axios.post(baseURL + '/admin/register', userCreate, customConfig);

      console.log('addedUser');
    } catch (error) {
      console.log(error.resp);
    }
  };
  const [appState, setAppState] = useState({
    loading: false,
    persons: null,
  });
  useEffect(() => {
    setAppState({ loading: true });
    axios.get(baseURL + '/admin/getAllUsers', customConfig).then((resp) => {
      const allPersons = resp.data;
      setAppState({
        loading: false,
        persons: allPersons,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAppState]);

  const handleDelete = async (id) => {
    try {
      await axios.post(baseURL + `/admin/deleteUser/${id}`, null, customConfig2);
      setAppState((prevState) => ({
        ...prevState,
        persons: prevState.persons.filter((person) => person.id !== id),
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
        <h1>Создать пользователя</h1>
        <Form>
          <Input
            value={username}
            onChange={(e) => setName(e.target.value)}
            placeholder="Имя пользователя"></Input>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            type="password"></Input>
          <Input
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            placeholder="Имя"
            type="text"></Input>
          <Input
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            placeholder="Фамилия"
            type="text"></Input>
          <label>
            <h2>Роль</h2>
            <select onChange={(e) => setRole(e.target.value)} type="text">
              <option value={3}>Обработчик</option>
              <option value={2}>Администратор</option>
              <option value={1}>Менеджер</option>
            </select>
          </label>
          <Button onClick={handleSubmit} type="submit">
            Создать
          </Button>
        </Form>
        <h1 className="h1">Список пользователей</h1>
        <div className="app">
          <UserData handleDelete={handleDelete} persons={appState.persons} />
        </div>
      </Container>
    </Wrapper>
  );
}

export default AdminUserManage;
