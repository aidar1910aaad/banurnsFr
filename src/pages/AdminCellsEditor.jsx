import React, { useState, useEffect } from 'react';
import NavState from '../contex/navState';
import MainMenuAdmin from '../components/MainMenuAdmin';
import axios from 'axios';
import baseURL from '../apiConfig/const';
import CellsData from '../components/CellsData';

function AdminCellsEditor() {
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
      await axios.post(baseURL + '/admin/addSection', userCreate, customConfig);

      console.log('addedFrozenStore');
    } catch (error) {
      console.log(error.resp);
    }
  };
  const [appState, setAppState] = useState({
    loading: false,
    cells: null,
  });
  useEffect(() => {
    setAppState({ loading: true });
    axios.get(baseURL + '/admin/getSections', customConfig).then((resp) => {
      const allcells = resp.data;
      console.log(allcells);
      setAppState({
        loading: false,
        cells: allcells,
      });
    });
  }, [setAppState]);

  const handleDelete = async (id) => {
    try {
      await axios.post(baseURL + `/admin/deleteSection/${id}`, null, customConfig);
      setAppState((prevState) => ({
        ...prevState,
        cells: prevState.cells.filter((person) => person.id !== id),
      }));
      console.log('deletedSection');
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
          <h1 className="h1-text">Управление типами секций</h1>
        </div>
        <div className="userAdd">
          <h2 className="descripword">Добавление нового типа секций</h2>
          <div className="span"></div>
          <div className="flexbox">
            <div className="left-side">
              <div className="left-text">Тип секции *</div>
            </div>
            <div className="centerout-side">
              <form className="form">
                <input
                  className="inputadm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Большая"></input>
                <button className="buttonadm" onClick={handleSubmit} type="submit">
                  Добавить новый тип секции
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
            <CellsData handleDelete={handleDelete} cells={appState.cells} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCellsEditor;
