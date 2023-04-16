import React from 'react';
import '../css/style.css';

function DryStoreData(props, handleDelete) {
  const { stores } = props;

  if (!stores || stores.length === 0) return <p>Нет данных.</p>;
  return (
    <div className="flex">
      <table>
        <thead>
          <tr>
            <th>Наименование</th>
            <th>Полок в ширину</th>
            <th>Полок в высоту</th>
            <th>Управление</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((person) => (
            <tr key={person.id}>
              <td>{person.name}</td>
              <td>{person.width}</td>
              <td>{person.height}</td>
              <td>
                <button className="button-data" onClick={() => props.handleDelete(person.id)}>
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DryStoreData;
