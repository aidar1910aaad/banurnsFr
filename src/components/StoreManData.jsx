import React, { useState, useEffect } from 'react';

function StoreManData(props) {
  const { stores, onSelectStore } = props;
  const [selectedStore, setSelectedStore] = useState(localStorage.getItem('selectedStore'));

  const handleChange = (e) => {
    const selectedStoreId = e.target.value;
    setSelectedStore(selectedStoreId);
    localStorage.setItem('selectedStore', selectedStoreId);
    onSelectStore(selectedStoreId);
  };

  useEffect(() => {
    const storedStore = localStorage.getItem('selectedStore');
    if (storedStore) {
      setSelectedStore(storedStore);
      onSelectStore(storedStore);
    }
  }, [onSelectStore]);

  if (!stores || stores.length === 0) return <p>Нет данных.</p>;

  return (
    <div>
      <label>
        <select className="inputadm" onChange={handleChange} value={selectedStore}>
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
