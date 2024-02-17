import ShowedMan from '../components/ShowedReq';
import React, { useState, useEffect } from 'react';
import '../css/print.css';
import baseURL from '../apiConfig/const';
import axios from 'axios';

function ReqManagerShowNow() {
  const token = localStorage.getItem('Token');
  const ReqId = localStorage.getItem('ReqId');
  const customConfig = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer_' + token,
    },
  };
  const [appState, setAppState] = useState({
    loading: false,
    showed: null,
  });

  const [appStateReq, setAppStateReq] = useState({
    loading: false,
    opened: null,
  });

  useEffect(() => {
    setAppState({ loading: true });
    axios.get(baseURL + '/salesmanager/getUserRequests', customConfig).then((resp) => {
      const allstores = resp.data;
      setAppStateReq({
        loading: false,
        opened: allstores,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAppState]);

  useEffect(() => {
    // Убедитесь, что appStateReq.opened не пустой
    if (appStateReq.opened && appStateReq.opened.length > 0) {
      const lastElement = appStateReq.opened[appStateReq.opened.length - 1];
      console.log(lastElement); // Логирование последнего элемента
    }
  }, [appStateReq.opened]);

  console.log(appStateReq.opened);

  useEffect(() => {
    if (appStateReq.opened && appStateReq.opened.length > 0) {
      const lastElementId = appStateReq.opened[appStateReq.opened.length - 1].id;

      setAppState({ loading: true });
      axios
        .get(baseURL + `/salesmanager/getRequestNew/${lastElementId}`, customConfig)
        .then((resp) => {
          const allstores = resp.data;
          console.log(allstores);
          setAppState({
            loading: false,
            showed: allstores,
          });
        });
    }
  }, [appStateReq.opened, setAppState]);
  console.log(appState.showed);
  return (
    <div className="paper">
      <ShowedMan showed={appState.showed}></ShowedMan>
    </div>
  );
}

export default ReqManagerShowNow;
