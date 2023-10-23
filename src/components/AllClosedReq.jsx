import React, { useState, useEffect } from 'react';
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
    loading: true,
    closed: null,
  });

  useEffect(() => {
    // Добавьте ссылку на CSS для печати внутри useEffect
    const link = document.createElement('link');
    link.href = '/src/css/print.css'; // Замените на путь к вашему файлу CSS для печати
    link.rel = 'stylesheet';
    link.type = 'text/css';
    document.head.appendChild(link);

    setTimeout(() => {
      axios.get(baseURL + '/reqprocessor/getReqs', customConfig).then((resp) => {
        const allstores = resp.data.filter((req) => req.status === 'ACTIVE');

        setAppState({
          loading: false,
          closed: allstores,
        });
      });
    }, 3000);
  }, []); // Удалите setAppState из зависимостей

  if (appState.loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {appState.closed &&
        appState.closed.map((person, index) => (
          <div
            key={person.id}
            className="showed-req" // Добавьте класс showed-req
          >
            <ShowedReq className="showed-req" showed={person}></ShowedReq>
          </div>
        ))}
    </div>
  );
}

// Функция для вычисления динамических стилей на основе индекса и высоты в vh
function calculateDynamicStyles(index, heightVH) {
  const viewportHeight = window.innerHeight;
  const calculatedHeight = viewportHeight * (heightVH / 100); // Преобразовать vh в пиксели
  const styles = {
    height: `${calculatedHeight}px`, // Задать высоту динамически в пикселях
    // Добавьте любые другие динамические стили, если нужно
  };
  return styles;
}

export default AllClosedReq;
