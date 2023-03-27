import React from 'react';
import '../css/style.css';
function MiscData(props, handleDelete) {
  const { miscs } = props;

  if (!miscs || miscs.length === 0) return <p>Нет данных.</p>;

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Номер</th>
            <th>Название вкуса</th>
            <th>Статус</th>
            <th>Дата создания</th>
            <th>Код товара</th>
            <th>Количество</th>
            <th>Управление</th>
          </tr>
        </thead>
        <tbody>
          {miscs.map((person) => (
            <tr key={person.id}>
              <td>{person.id}</td>
              <td>{person.name}</td>
              <td>{person.status}</td>
              <td>{person.description}</td>
              <td>{person.barcode}</td>
              <td>{person.quantity}</td>
              <button onClick={() => props.handleDelete(person.id)}>Удалить</button>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MiscData;
