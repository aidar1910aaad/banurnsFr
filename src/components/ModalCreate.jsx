import React, { useState, useEffect } from 'react';

import axios from 'axios';
import baseURL from '../apiConfig/const';

function ModalCreate({ handleSubmit }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sectionid, setSectionId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [flavid, setFlavId] = useState('');
  const [flavors, setFlavors] = useState([]);
  const [sections, setSections] = useState([]);
  const token = localStorage.getItem('Token');
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleCreate = (e) => {
    e.preventDefault();
    handleSubmit({ sectionid, quantity, flavid });
  };

  useEffect(() => {
    const getFlavors = async () => {
      try {
        const response = await axios.get(baseURL + '/admin/getFlavors', {
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

  useEffect(() => {
    const getSections = async () => {
      try {
        const response = await axios.get(baseURL + '/admin/getSections', {
          headers: {
            Authorization: 'Bearer_' + token,
          },
        });
        setSections(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getSections();
  }, [token]);

  return (
    <>
      <button className="buttonadm" onClick={handleOpen}>
        Создать новую секцию
      </button>
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="flex">
              <div className="left-sideCreate">
                <div className="left-textCreate">Количество вагонеток в секции *</div>
                <div className="left-textCreate">Тип секции *</div>
                <div className="left-textCreate">Вкусы *</div>
              </div>
              <div className="center-sideCreate">
                <form onSubmit={handleCreate}>
                  <input
                    className="inputadmCreate"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="куантити"
                  />
                  <select
                    className="inputadmCreate"
                    value={sectionid}
                    onChange={(e) => setSectionId(e.target.value)}>
                    <option value="">Выберите тип секции</option>
                    {sections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.name}
                      </option>
                    ))}
                  </select>
                  <select
                    className="inputadmCreate"
                    value={flavid}
                    onChange={(e) => setFlavId(e.target.value)}>
                    <option value="">Выберите вкус</option>
                    {flavors.map((flavor) => (
                      <option key={flavor.id} value={flavor.id}>
                        {flavor.name}
                      </option>
                    ))}
                  </select>
                  <button className="buttonadm" type="submit">
                    Создать новую секцию
                  </button>
                  <button className="buttonadmClose" onClick={handleClose}>
                    Закрыть
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ModalCreate;
