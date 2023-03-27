import React, { useState, useEffect } from 'react';

function StoreManData(props) {
  const [storeId, setStore] = useState(null);
  console.log(storeId);

  useEffect(() => {
    if (storeId !== null) {
      localStorage.setItem('storeId', storeId);
    }
  }, [storeId]);

  const { stores } = props;
  if (!stores || stores.length === 0) return <p>Нет данных.</p>;

  return (
    <div>
      <label>
        <select onChange={(e) => setStore(e.target.value)} type="text">
          <option hidden>Не выбрано</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default StoreManData;
