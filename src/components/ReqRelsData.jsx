import React, { useEffect, useState } from 'react';
import '../css/style.css';
import Modal from './Modal';
import axios from 'axios';
import baseURL from '../apiConfig/const';
import ReqModal from './ReqModal';
import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

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

  // Check if rels is defined before using it
  if (!rels || rels.length === 0) return <p>Нет данных.</p>;
  const groupedFlavors = {};

  rels.forEach((rel) => {
    if (!groupedFlavors[rel.sectionName]) {
      groupedFlavors[rel.sectionName] = [];
    }
    groupedFlavors[rel.sectionName].push(rel);
  });

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
      {Object.keys(groupedFlavors).map((sectionName) => (
        <div className="flex wrap" key={sectionName}>
          <h3 className="onehun">{sectionName}</h3>
          <div className="flex wrap">
            {groupedFlavors[sectionName].map((rel) => {
              const flavor = findFlavorByFlavorId(rel.flavid);

              return (
                <div className="square" key={rel.id} onClick={() => handleRelClick(rel)}>
                  <div className="relQuantity">
                    <div className="rel">{rel.quantity}</div>
                  </div>
                  <div className="rel2">{flavor ? flavor.name : 'Нет данных'}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {showModal && <ReqModal rel={selectedRel} stores={stores} handleClose={handleCloseModal} />}
    </div>
  );
}

export default ReqRelsData;
