import React, { useState, useEffect } from 'react';
import NavState from '../contex/navState';
import MainMenuAdmin from '../components/MainMenuAdmin';
import axios from 'axios';
import baseURL from '../apiConfig/const';
import UserData from '../components/UserData';
import '../css/style.css';

function AdminUserManage() {
  const [username, setName] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [roleId, setRole] = useState(3);
  const token = localStorage.getItem('Token');
  const customConfig = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
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
    <div className="wrapper">
      <NavState>
        <MainMenuAdmin />
      </NavState>
      <div className="container">
        <div>
          <h1 className="h1-text">Управление пользователями</h1>
        </div>
        <div className="userAdd">
          <h2 className="descripword">Создать пользователя</h2>
          <div className="span"></div>

          <div className="flexbox">
            <div className="left-side">
              <div className="left-text">Имя пользователя*</div>
              <div className="left-text">Пароль*</div>
              <div className="left-text">Имя*</div>
              <div className="left-text">Фамилия*</div>
              <div className="left-text">Выбор роли*</div>
            </div>
            <div className="center-side">
              <form className="form">
                <input
                  className="inputadm"
                  value={username}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Имя пользователя"></input>
                <input
                  className="inputadm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Пароль"
                  type="password"></input>
                <input
                  className="inputadm"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  placeholder="Имя"
                  type="text"></input>
                <input
                  className="inputadm"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder="Фамилия"
                  type="text"></input>
                <label>
                  <select
                    className="inputadm"
                    onChange={(e) => setRole(e.target.value)}
                    type="text">
                    <option value={3}>Обработчик</option>
                    <option value={2}>Администратор</option>
                    <option value={1}>Менеджер</option>
                  </select>
                </label>
                <button className="buttonadm" onClick={handleSubmit} type="submit">
                  Создать нового пользователя
                </button>
              </form>
            </div>
            <div className="right-side"></div>
          </div>
        </div>
        <div className="userAdd">
          <h2 className="descripword">Список пользователей</h2>
          <div className="span"></div>
          <div className="app">
            <UserData handleDelete={handleDelete} persons={appState.persons} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUserManage;
