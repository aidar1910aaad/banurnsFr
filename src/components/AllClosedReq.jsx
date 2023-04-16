import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import baseURL from '../apiConfig/const';
import axios from 'axios';
import ShowedReq from './ShowedReq';

function AllClosedReq() {
  const token = localStorage.getItem('Token');
  const customConfig = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer_' + token,
    },
  };
  const [appState, setAppState] = useState({
    loading: false,
    closed: null,
  });

  useEffect(() => {
    setAppState({ loading: true });
    axios.get(baseURL + '/reqprocessor/getAllRequests', customConfig).then((resp) => {
      const allstores = resp.data.filter((req) => req.status === 'ACTIVE');

      console.log(allstores);
      setAppState({
        loading: false,
        closed: allstores,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAppState]);

  return (
    <div>
      {appState.closed &&
        appState.closed.map((person) => (
          <div key={person.id}>
            <ShowedReq showed={person}></ShowedReq>
          </div>
        ))}
    </div>
  );
}

export default AllClosedReq;
