import React from 'react';
import '../css/style.css';
function UserData(props, handleDelete) {
  const { stores } = props;

  if (!stores || stores.length === 0) return <p>Нет данных.</p>;

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Номер</th>
            <th>Название точки</th>
            <th>Статус</th>
            <th>Дата создания</th>
            <th>Управление</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((person) => (
            <tr key={person.id}>
              <td>{person.id}</td>
              <td>{person.name}</td>
              <td>{person.status}</td>
              <td>{person.created}</td>
              <button onClick={() => props.handleDelete(person.id)}>Удалить</button>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserData;
