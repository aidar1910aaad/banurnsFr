import React, { useState, useEffect } from 'react';
import NavState from '../contex/navState';
import MainMenuAdmin from '../components/MainMenuAdmin';
import axios from 'axios';
import baseURL from '../apiConfig/const';
import StoreData from '../components/StoreData';

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
    try {
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
    <div className="wrapper">
      <NavState>
        <MainMenuAdmin />
      </NavState>
      <div className="container">
        <div>
          <h1 className="h1-text">Управление торговыми точками</h1>
        </div>
        <div className="userAdd">
          <h2 className="descripword">Добавление новой торговой точки</h2>
          <div className="span"></div>
          <div className="flexbox">
            <div className="left-side">
              <div className="left-text">Наименование торговой точки*</div>
            </div>
            <div className="centerout-side">
              <form className="form">
                <input
                  className="inputadm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="хан шатыр"></input>
                <button className="buttonadm" onClick={handleSubmit} type="submit">
                  Добавить торговую точку
                </button>
              </form>
            </div>
            <div className="right-side"></div>
          </div>
        </div>
        <div className="userAdd">
          <h2 className="descripword">Список торговых точек</h2>
          <div className="span"></div>
          <div className="app">
            <StoreData handleDelete={handleDelete} stores={appState.stores} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOutlet;
