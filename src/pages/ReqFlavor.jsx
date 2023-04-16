import React, { useState, useEffect } from 'react';
import NavState from '../contex/navState';
import MainMenuReqManager from '../components/MainMenuReqManager';
import axios from 'axios';
import baseURL from '../apiConfig/const';
import FlavorData from '../components/FlavorData';

function ReqFlavor() {
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
      await axios.post(baseURL + '/reqprocessor/addFlavor', userCreate, customConfig);

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
    axios.get(baseURL + '/reqprocessor/getFlavors', customConfig).then((resp) => {
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
      await axios.post(baseURL + `/reqprocessor/deleteFlavor/${id}`, null, customConfig);
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
    <div className="wrapper">
      <NavState>
        <MainMenuReqManager />
      </NavState>
      <div className="container">
        <div>
          <h1 className="h1-text">Управление вкусами мороженного</h1>
        </div>
        <div className="userAdd">
          <h2 className="descripword">Добавление нового вкуса</h2>
          <div className="span"></div>
          <div className="flexbox">
            <div className="left-side">
              <div className="left-text">Название вкуса*</div>
              <div className="left-text">Числовой код вкуса*</div>
            </div>
            <div className="centerout-side">
              <form className="form">
                <input
                  className="inputadm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Банан"></input>
                <input
                  className="inputadm"
                  value={barcode}
                  onChange={(e) => setBarCode(e.target.value)}
                  placeholder="123456789"></input>
                <button className="buttonadm" onClick={handleSubmit} type="submit">
                  Добавить новый вкус
                </button>
              </form>
            </div>
            <div className="right-side"></div>
          </div>
        </div>
        <div className="userAdd">
          <h2 className="descripword">Перечень вкусов</h2>
          <div className="span"></div>
          <div className="app">
            <FlavorData handleDelete={handleDelete} flavors={appState.flavors} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReqFlavor;
