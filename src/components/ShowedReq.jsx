import React from 'react';

import '../css/style.css';

function ShowedReq(props) {
  const { showed } = props;

  if (!showed || showed.length === 0) return <p>Нет данных.</p>;

  const handlePrintClick = () => {
    window.print();
  };
  return (
    <div className="flex">
      <table>
        <thead>
          <tr>
            <th>Номер</th>
            <th>Создано UserID</th>
            <th>Статус</th>
            <th>Дата создания</th>
            <th>Обновлено</th>
            <th>Создано торговой точкой</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr key={showed.id}>
            <td>{showed.id}</td>
            <td>{showed.creationuserid}</td>
            <td>{showed.status}</td>
            <td>{showed.created}</td>
            <td>{showed.updated}</td>
            <td>{showed.storeid}</td>
            <td>
              <button onClick={handlePrintClick}>Печать</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ShowedReq;
