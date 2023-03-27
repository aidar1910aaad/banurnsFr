import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseURL from '../apiConfig/const';

const Container = styled.div`
  margin: 0 auto;
  width: 100vw;
  height: 100vh;
  padding: 0 auto;
  background: #2c3338;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 330px;
  height: 200px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  height: 55px;
  min-width: 40%;
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
  background-color: #ea4c88;
  color: #fff;
  cursor: pointer;
  margin-top: 15px;
  border-radius: 5px;
  font-size: 20px;
`;

function Login() {
  const [username, setName] = useState('');
  const [password, setPassword] = useState('');
  const customConfig = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
      'X-Requested-With': 'XMLHttpRequest',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    },
  };

  const navigate = useNavigate();
  const usersName = JSON.stringify({ username: username, password: password });
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(usersName);
    try {
      const resp = await axios.post(baseURL + '/auth/login', usersName, customConfig);
      localStorage.setItem('Token', resp.data.token);
      console.log(resp.data.token); // '{"name":"John Doe"}'
      console.log(resp.data.username);
      console.log(resp.data.headers['Content-Type']);
      console.log(resp.status);
    } catch (error) {
      console.log(error.resp);
    }
    let str = localStorage.getItem('Token');
    // console.log(str.length);
    const customConfigUser = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        Authorization: 'Bearer_' + str,
      },
    };
    axios.get(baseURL + '/anyrole/getInfo', customConfigUser).then((resp) => {
      const UserRole = resp.data.role;
      console.log(UserRole);
      localStorage.setItem('Role', UserRole);
      if (UserRole === 'ROLE_ADMIN') {
        navigate('/Admin');
      } else if (UserRole === 'ROLE_SALESMANAGER') {
        navigate('/SalesManager');
      } else if (UserRole === 'ROLE_REQUESTMANAGER') {
        navigate('/ReqManager');
      } else {
        navigate('/Login');
      }
    });
  };

  return (
    <Container>
      <Wrapper>
        <Form>
          <Input
            value={username}
            onChange={(e) => setName(e.target.value)}
            placeholder="Имя пользователя"
            autocomplete="off"></Input>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            autocomplete="off"
            type="password"></Input>
          <Button onClick={handleSubmit} type="submit">
            Войти
          </Button>
        </Form>
      </Wrapper>
    </Container>
  );
}

export default Login;
