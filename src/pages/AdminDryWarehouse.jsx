import React, { useState, useEffect } from 'react';
import NavState from '../contex/navState';
import MainMenuAdmin from '../components/MainMenuAdmin';
import axios from 'axios';
import baseURL from '../apiConfig/const';
import DryStoreData from '../components/DryStoreData';

function AdminDryWarehouse() {
  const [name, setName] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
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
    width: width,
    height: height,
  });
  const handleSubmit = async (e) => {
    console.log(userCreate);
    try {
      console.log(token);
      await axios.post(baseURL + '/admin/addDryStorage', userCreate, customConfig);

      console.log('addedDryStore');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
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
    axios.get(baseURL + '/admin/getAllDryStorages', customConfig).then((resp) => {
      const allstores = resp.data;
      setAppState({
        loading: false,
        stores: allstores,
      });
    });
  }, [setAppState]);

  const handleDelete = async (id) => {
    try {
      await axios.post(baseURL + `/admin/deleteDryStorageById/${id}`, null, customConfig);
      setAppState((prevState) => ({
        ...prevState,
        stores: prevState.stores.filter((person) => person.id !== id),
      }));
      console.log('deletedColdSt');
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
          <h1 className="h1-text">Добавление новых складов</h1>
        </div>
        <div className="userAdd">
          <h2 className="descripword">Создание нового сухого склада</h2>
          <div className="span"></div>
          <div className="flexbox">
            <div className="left-side">
              <div className="left-text">Наименование *</div>
              <div className="left-text">Полок в ширину *</div>
              <div className="left-text">Полок в высоту *</div>
            </div>
            <div className="centerout-side">
              <form className="form">
                <input
                  className="inputadm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Склад #1"></input>
                <input
                  className="inputadm"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="1"></input>
                <input
                  className="inputadm"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="1"></input>
                <button className="buttonadm" onClick={handleSubmit} type="submit">
                  Добавить новый склад
                </button>
              </form>
            </div>
            <div className="right-side"></div>
          </div>
        </div>
        <div className="userAdd">
          <h2 className="descripword">Список складов</h2>
          <div className="span"></div>
          <div className="app">
            <DryStoreData handleDelete={handleDelete} stores={appState.stores} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDryWarehouse;
