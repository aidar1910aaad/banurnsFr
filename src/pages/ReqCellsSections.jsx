import React, { useState, useEffect } from 'react';
import NavState from '../contex/navState';
import MainMenuReqManager from '../components/MainMenuReqManager';
import axios from 'axios';
import baseURL from '../apiConfig/const';
import '../css/style.css';
import StoreManData from '../components/StoreManData';
import ReqRelsData from '../components/ReqRelsData';

function AdminCellsSections() {
  const [sectionid, setSectionId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [flavid, setFlavId] = useState('');
  const [flavors, setFlavors] = useState([]);
  const [sections, setSections] = useState([]);
  const token = localStorage.getItem('Token');
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  const customConfig = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer_' + token,
    },
  };
  const [appState, setAppState] = useState({
    loading: false,
    stores: null,
  });
  const [appRels, setAppRels] = useState({
    loading: false,
    rels: null,
  });
  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      axios.post(baseURL + '/reqprocessor/addColdRel', userCreate, customConfig);
      console.log('addedUser');
      window.location.reload();
    } catch (error) {
      console.log(error.resp);
    }
  };
  useEffect(() => {
    setAppState({ loading: true });
    axios.get(baseURL + '/reqprocessor/getAllColdStorages', customConfig).then((resp) => {
      const allstores = resp.data;
      setAppState({
        loading: false,
        stores: allstores,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAppState]);

  console.log(selectedStoreId + '  fdfdfsdfsdf');

  useEffect(() => {
    if (selectedStoreId !== null) {
      axios
        .get(baseURL + `/reqprocessor/getAllColdRelsByStorageId/${selectedStoreId}`, customConfig)
        .then((resp) => {
          const allstores = resp.data;
          console.log(allstores);
          setAppRels({
            loading: false,
            rels: allstores,
          });
        });
    }
  }, [selectedStoreId]);

  const userCreate = JSON.stringify({
    flavid: flavid,
    storageid: selectedStoreId,
    quantity: quantity,
    sectionid: sectionid,
  });
  console.log(userCreate);

  useEffect(() => {
    const getFlavors = async () => {
      try {
        const response = await axios.get(baseURL + '/reqprocessor/getFlavors', {
          headers: {
            Authorization: 'Bearer_' + token,
          },
        });
        setFlavors(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getFlavors();
  }, [token]);

  useEffect(() => {
    const getSections = async () => {
      try {
        const response = await axios.get(baseURL + '/reqprocessor/getSections', {
          headers: {
            Authorization: 'Bearer_' + token,
          },
        });
        setSections(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getSections();
  }, [token]);

  return (
    <div className="wrapper">
      <NavState>
        <MainMenuReqManager />
      </NavState>
      <div className="container">
        <div>
          <h1 className="h1-text">Управление секциями</h1>
        </div>
        <div className="userAdd">
          <h2 className="descripword">Выбор склада</h2>
          <div className="span"></div>

          <div className="flexbox">
            <div className="left-side">
              <div className="left-text">Выбор скалада *</div>
            </div>
            <div className="center-side">
              <form className="form">
                <StoreManData
                  stores={appState.stores}
                  onSelectStore={setSelectedStoreId}></StoreManData>
              </form>
            </div>
            <div className="right-side"></div>
          </div>
        </div>
        <div className="userAdd">
          <h2 className="descripword">Секции</h2>
          <div className="span"></div>
          <div className="app">
            <ReqRelsData rels={appRels.rels} />
          </div>
        </div>
        <div className="userAdd">
          <h2 className="descripword">Создание полки</h2>
          <div className="span"></div>
          <div className="app">
            <form className="form">
              <div className="flexbox">
                <div className="center-side">
                  <input
                    className="inputadmCreate"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Количество"
                  />
                  <select
                    className="inputadmCreate"
                    value={sectionid}
                    onChange={(e) => setSectionId(e.target.value)}>
                    <option value="">Выберите тип секции</option>
                    {sections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.name}
                      </option>
                    ))}
                  </select>
                  <select
                    className="inputadmCreate"
                    value={flavid}
                    onChange={(e) => setFlavId(e.target.value)}>
                    <option value="">Выберите вкус</option>
                    {flavors.map((flav) => (
                      <option key={flav.id} value={flav.id}>
                        {flav.name}
                      </option>
                    ))}
                  </select>
                  <button className="buttonadm" type="button" onClick={handleSubmit}>
                    Создать
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCellsSections;
