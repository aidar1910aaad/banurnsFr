import React from 'react';
import '../css/style.css';
function CellsData(props, handleDelete) {
  const { cells } = props;

  if (!cells || cells.length === 0) return <p>Нет данных.</p>;
  return (
    <div className="flex">
      <table>
        <thead>
          <tr>
            <th>Перечень</th>
            <th>Управление</th>
          </tr>
        </thead>
        <tbody>
          {cells.map((person) => (
            <tr key={person.id}>
              <td>{person.name}</td>
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

export default CellsData;
