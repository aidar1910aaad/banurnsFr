import React, { useEffect, useState } from 'react';
import '../css/style.css';
import Modal from './Modal';
import axios from 'axios';
import baseURL from '../apiConfig/const';

function RelsData(props) {
  const { rels } = props;
  const [stores, setStores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRel, setSelectedRel] = useState(null);

  const token = localStorage.getItem('Token');
  const customConfig = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer_' + token,
    },
  };

  useEffect(() => {
    axios
      .get(baseURL + '/admin/getAllStores', customConfig)
      .then((response) => {
        setStores(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleRelClick = (rel) => {
    setSelectedRel(rel);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (!rels || rels.length === 0) return <p>Нет данных.</p>;

  return (
    <div className="flex">
      {rels.map((rel) => (
        <div className="square" key={rel.id} onClick={() => handleRelClick(rel)}></div>
      ))}
      {showModal && <Modal rel={selectedRel} stores={stores} handleClose={handleCloseModal} />}
    </div>
  );
}

export default RelsData;
