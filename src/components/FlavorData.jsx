import React from 'react';
import '../css/style.css';
function FlavorData(props, handleDelete) {
  const { flavors } = props;

  if (!flavors || flavors.length === 0) return <p>Нет данных.</p>;

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Номер</th>
            <th>Название вкуса</th>
            <th>Статус</th>
            <th>Описание</th>
            <th>Код товара</th>
            <th>Количество</th>
            <th>Управление</th>
          </tr>
        </thead>
        <tbody>
          {flavors.map((person) => (
            <tr key={person.id}>
              <td>{person.id}</td>
              <td>{person.name}</td>
              <td>{person.status}</td>
              <td>{person.description}</td>
              <td>{person.barcode}</td>
              <td>{person.quantity}</td>
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

export default FlavorData;
