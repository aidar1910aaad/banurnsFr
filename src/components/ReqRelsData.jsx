import React, { useEffect, useState } from 'react';
import '../css/style.css';
import Modal from './Modal';
import axios from 'axios';
import baseURL from '../apiConfig/const';
import ReqModal from './ReqModal';

function ReqRelsData(props) {
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
      .get(baseURL + '/reqprocessor/getAllStores', customConfig)
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
        const response = await axios.get(baseURL + '/reqprocessor/getFlavors', {
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

  const findFlavorByFlavorId = (flavorId) => {
    return flavors.find((flavor) => flavor.id === flavorId);
  };

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
      <h3>Широкие кюветы</h3>
      <div className="flex wrap">
        {rels.map((rel) => {
          const flavor = findFlavorByFlavorId(rel.flavorid);

          if (flavor && flavor.narrow === false) {
            return (
              <div className="square" key={rel.id} onClick={() => handleRelClick(rel)}>
                <div className="relQuantity">
                  <div className="rel">{rel.quantity}</div>
                </div>
                <div className="rel2">{flavor.name}</div>
              </div>
            );
          }

          return null;
        })}
      </div>
      <h3>Узкие кюветы</h3>
      <div className="flex wrap">
        {rels.map((rel) => {
          const flavor = findFlavorByFlavorId(rel.flavorid);

          if (flavor && flavor.narrow === true) {
            return (
              <div className="square" key={rel.id} onClick={() => handleRelClick(rel)}>
                <div className="relQuantity">
                  <div className="rel">{rel.quantity}</div>
                </div>
                <div className="rel2">{flavor.name}</div>
              </div>
            );
          }

          return null;
        })}
      </div>

      {showModal && <ReqModal rel={selectedRel} stores={stores} handleClose={handleCloseModal} />}
    </div>
  );
}

export default ReqRelsData;
