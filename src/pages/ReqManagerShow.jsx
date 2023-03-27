import ShowedReq from '../components/ShowedReq';
import React, { useState, useEffect } from 'react';

import baseURL from '../apiConfig/const';
import axios from 'axios';

function ReqManagerShow() {
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

  useEffect(() => {
    setAppState({ loading: true });
    axios.get(baseURL + `/reqprocessor/getRequest/${ReqId}`, customConfig).then((resp) => {
      const allstores = resp.data;
      console.log(allstores);
      setAppState({
        loading: false,
        showed: allstores,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAppState]);
  return (
    <div>
      <ShowedReq showed={appState.showed}></ShowedReq>
    </div>
  );
}

export default ReqManagerShow;
