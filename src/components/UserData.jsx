import React from 'react';
import '../css/style.css';
function UserData(props, handleDelete) {
  const { persons } = props;

  if (!persons || persons.length === 0) return <p>Нет данных.</p>;

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Номер</th>
            <th>Имя пользователя</th>
            <th>Имя</th>
            <th>Фамилия</th>
            <th>Создан</th>
            <th>Статус</th>
            <th>Удаление</th>
          </tr>
        </thead>
        <tbody>
          {persons.map((person) => (
            <tr key={person.id}>
              <td>{person.id}</td>
              <td>{person.username}</td>
              <td>{person.firstName}</td>
              <td>{person.lastName}</td>
              <td>{person.created}</td>
              <td>{person.status}</td>
              <td>
                <button onClick={() => props.handleDelete(person.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserData;
