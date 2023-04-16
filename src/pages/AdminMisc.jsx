import React, { useState, useEffect } from 'react';
import NavState from '../contex/navState';
import MainMenuAdmin from '../components/MainMenuAdmin';
import axios from 'axios';
import baseURL from '../apiConfig/const';
import MiscData from '../components/MiscData';

function AdminMisc() {
  const [name, setName] = useState('');
  const [description] = useState('');
  const [quantity] = useState('');
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
    <div className="wrapper">
      <NavState>
        <MainMenuAdmin />
      </NavState>
      <div className="container">
        <div>
          <h1 className="h1-text">Управление товарами</h1>
        </div>
        <div className="userAdd">
          <h2 className="descripword">Добавление нового пользователя</h2>
          <div className="span"></div>
          <div className="flexbox">
            <div className="left-side">
              <div className="left-text">Название товара*</div>
              <div className="left-text">Числовой код товара*</div>
            </div>
            <div className="centerout-side">
              <form className="form">
                <input
                  className="inputadm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Салфетка"></input>
                <input
                  className="inputadm"
                  value={barcode}
                  onChange={(e) => setBarCode(e.target.value)}
                  placeholder="123456789"></input>
                <button className="buttonadm" onClick={handleSubmit} type="submit">
                  Добавить новый товар
                </button>
              </form>
            </div>
            <div className="right-side"></div>
          </div>
        </div>
        <div className="userAdd">
          <h2 className="descripword">Список товаров</h2>
          <div className="app">
            <MiscData handleDelete={handleDelete} miscs={appState.miscs} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminMisc;
