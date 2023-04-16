import React, { useEffect, useState } from 'react';
import '../css/style.css';
import axios from 'axios';
import baseURL from '../apiConfig/const';
import ReqDryModal from './ReqDryModal';

function ReqDryRelsData(props) {
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
      .get(baseURL + '/reqprocessor/getAllStores', customConfig)
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
      {showModal && (
        <ReqDryModal rel={selectedRel} stores={stores} handleClose={handleCloseModal} />
      )}
    </div>
  );
}

export default ReqDryRelsData;
