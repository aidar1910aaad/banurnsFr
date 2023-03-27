import React, { useState, useEffect } from 'react';
import '../css/style.css';

function CreateMisc(props) {
  const { setResultMisc } = props;
  const [name, setName] = useState([]);

  useEffect(() => {
    const result = name
      .filter((value) => value && value[1] !== '' && value[1] !== '0')
      .map((value, index) => `${value[0]}:${value[1]}`)
      .join('&');
    setResultMisc(result);
  }, [name, setResultMisc]);

  function handleInputChange(event, index) {
    const newInputs = [...name];
    newInputs[index] = [index, event.target.value];
    setName(newInputs);
  }

  const { misc } = props;
  if (!misc || misc.length === 0) return <p>Нет данных.</p>;

  return (
    <div className="h2">
      <h2>Дополнительное</h2>
      {misc.map((miss) => (
        <div className="h3" key={miss.id}>
          <p> {miss.name}</p>
          <div className="h2">
            количество упаковки: <p>{miss.description}шт</p>
          </div>
          <input onChange={(e) => handleInputChange(e, miss.id)} type="number"></input>
        </div>
      ))}
    </div>
  );
}

export default CreateMisc;
