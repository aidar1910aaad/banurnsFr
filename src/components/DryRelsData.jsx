import React, { useEffect, useState } from 'react';
import '../css/style.css';
import axios from 'axios';
import baseURL from '../apiConfig/const';
import DryModal from './DryModal';

function DryRelsData(props) {
  const { rels } = props;
  const [stores, setStores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRel, setSelectedRel] = useState(null);
  const [flavors, setFlavors] = useState([]);

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

  useEffect(() => {
    const getFlavors = async () => {
      try {
        const response = await axios.get(baseURL + '/admin/getAllMisc', {
          headers: {
            Authorization: 'Bearer_' + token,
          },
        });
        setFlavors(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getFlavors();
  }, [token]);
  console.log(flavors);

  const handleRelClick = (rel) => {
    setSelectedRel(rel);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (!rels || rels.length === 0) return <p>Нет данных.</p>;

  return (
    <div className="flex wrap">
      {rels.map((rel) => (
        <div className="square" key={rel.id} onClick={() => handleRelClick(rel)}>
          <div className="relQuantity">
            <div className="rel">{rel.quantity}</div>
          </div>
          <div className="rel2">{flavors.name}</div>
        </div>
      ))}
      {showModal && <DryModal rel={selectedRel} stores={stores} handleClose={handleCloseModal} />}
    </div>
  );
}

export default DryRelsData;
