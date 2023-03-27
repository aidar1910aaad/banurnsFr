import React from 'react';
import '../css/style.css';
import { Link } from 'react-router-dom';

function ClosedReqData(props, handleShow) {
  const { closed } = props;
  if (!closed || closed.length === 0) return <p>Нет данных.</p>;
  return (
    <div>
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
          {closed.map((person) => {
            if (person.status === 'NOT_ACTIVE') {
              return (
                <tr key={person.id}>
                  <td>{person.id}</td>
                  <td>{person.creationuserid}</td>
                  <td>{person.status}</td>
                  <td>{person.created}</td>
                  <td>{person.updated}</td>
                  <td>{person.storeid}</td>
                  <Link to={'/ReqManager/Show'} target="_blank">
                    <button onClick={() => props.handleShow(person.id)}>Посмотреть заявку</button>
                  </Link>
                </tr>
              );
            } else {
              return null; // не отображаем элементы с другим статусом
            }
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ClosedReqData;
