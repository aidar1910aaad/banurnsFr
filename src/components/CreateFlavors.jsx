import React, { useState, useEffect } from 'react';
import '../css/style.css';

function CreateFlavors(props) {
  const { setResult } = props;
  const [name, setName] = useState([]);

  useEffect(() => {
    const result = name
      .filter((value) => value && value[1] !== '' && value[1] !== '0')
      .map((value, index) => `${value[0]}:${value[1]}`)
      .join('&');
    setResult(result);
  }, [name, setResult]);

  function handleInputChange(event, index) {
    const newInputs = [...name];
    newInputs[index] = [index, event.target.value];
    setName(newInputs);
  }

  //   function parseName(nameString) {
  //     const nameArray = nameString.split('&');
  //     const result = [];
  //     nameArray.forEach((nameItem) => {
  //       const [flavorId, inputValue] = nameItem.split(':');
  //       if (flavorId && inputValue) {
  //         result.push([flavorId, inputValue]);
  //       }
  //     });
  //     return result;
  //   }
  const { flavors } = props;
  if (!flavors || flavors.length === 0) return <p>Нет данных.</p>;

  return (
    <div>
      <h3>Мороженое в контейнерах</h3>
      <p>Введите количество в кг*</p>
      {flavors.map((flavor) => (
        <div key={flavor.id}>
          <p> {flavor.name}</p>
          <input onChange={(e) => handleInputChange(e, flavor.id)} type="number"></input>
        </div>
      ))}
    </div>
  );
}

export default CreateFlavors;
