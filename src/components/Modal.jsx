import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseURL from '../apiConfig/const';
import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

function Modal(props) {
  const { rel, handleClose } = props;
  const [sectionid, setSectionId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [flavid, setFlavId] = useState('');
  const [flavors, setFlavors] = useState([]);
  const [sections, setSections] = useState([]);
  const [data, setData] = useState(null);
  const [visibleStores, setVisibleStores] = useState([]);
  const [changed, setChanged] = useState(false);
  const [isError, setIsError] = useState(false);
  const [existingVisibleStores, setExistingVisibleStores] = useState([]);
  const [formData, setFormData] = useState({
    sectionid: (data && data.sectionid) || '',
    quantity: (data && data.quantity) || '',
    flavid: (data && data.flavid) || '',
  });
  const usersName = JSON.stringify({
    id: rel.id, //base
    flavid: formData.flavid !== '' ? formData.flavid : rel.flavid,
    storageid: rel.storageid, //base
    sectionid: formData.sectionid !== '' ? formData.sectionid : rel.sectionid,
    quantity: formData.quantity !== '' ? formData.quantity : rel.quantity,
  });

  console.log(rel);

  console.log(usersName);
  const ErrorMessage = styled.div`
    color: red;
    margin-top: 10px;
  `;
  const token = localStorage.getItem('Token');
  const storageid = localStorage.getItem('selectedStore');

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

  useEffect(() => {
    axios
      .get(baseURL + `/admin/getColdVisibleByRelId/${rel.id}`, customConfig)
      .then((response) => {
        setVisibleStores(response.data.map((item) => item.storeid));
        setExistingVisibleStores(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [rel.id]);
  useEffect(() => {
    axios
      .get(baseURL + `/admin/getColdRel/${rel.id}`, customConfig)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [rel.id]);
  console.log(data);

  const customConfig = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer_' + token,
    },
  };
  const handleSave2 = () => {
    axios
      .post(baseURL + '/admin/modifyColdRel', usersName, customConfig)
      .then((response) => {
        setChanged(false);
        setIsError(false);
      })
      .catch((error) => {
        console.error(error);
        setIsError(true);
      });
  };

  const toggleStoreVisibility = (storeId) => {
    if (visibleStores.includes(storeId)) {
      setVisibleStores(visibleStores.filter((id) => id !== storeId));
    } else {
      setVisibleStores([...visibleStores, storeId]);
    }
    setChanged(true);
  };
  const handleSelectSectionChange = (e) => {
    const newSectionId = e.target.value;
    setFormData((prevFormData) => ({ ...prevFormData, sectionid: newSectionId }));
    setChanged(true);
  };

  const handleSelectFlavIdChange = (e) => {
    const newFlavId = e.target.value;
    setFormData((prevFormData) => ({ ...prevFormData, flavid: newFlavId }));
    setChanged(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    setChanged(true);
  };
  const handleSave = async () => {
    const requests = [];
    const relStores = props.stores.filter((store) => visibleStores.includes(store.id));
    const updatedUsersName = JSON.stringify({
      id: rel.id,
      flavid: formData.flavid !== '' ? formData.flavid : rel.flavorid,
      storageid: rel.storageid,
      sectionid: formData.sectionid !== '' ? formData.sectionid : rel.sectionid,
      quantity: formData.quantity !== '' ? formData.quantity : rel.quantity,
    });
    axios
      .post(baseURL + '/admin/modifyColdRel', usersName, customConfig)
      .then((response) => {
        setChanged(false);
        setIsError(false);
        toast.success('Изменения успешно сохранены.');
      })
      .catch((error) => {
        console.error(error);
        setIsError(true);
      });
    // Check if a store that was previously visible is no longer visible
    existingVisibleStores.forEach((existingStore) => {
      if (!relStores.some((store) => store.id === existingStore.storeid)) {
        requests.push({
          id: existingStore.id,
          relid: existingStore.relid,
        });
      }
    });

    // Check if a store that was not visible is now visible
    relStores.forEach((store) => {
      const existingStore = existingVisibleStores.find((item) => item.storeid === store.id);
      if (!existingStore) {
        requests.push({
          relid: rel.id,
          storeid: store.id,
        });
      }
    });

    if (requests.length > 0) {
      try {
        await Promise.all(
          requests.map(async (requestBody) => {
            if (requestBody.id !== undefined) {
              // If the store was previously visible and is now not visible, send a delete request
              console.log('Sending delete request', requestBody);
              await axios.post(
                baseURL + '/admin/deleteColdVisibleById/' + requestBody.id,
                null,
                customConfig,
              );
            } else {
              // If the store was not previously visible and is now visible, send a create request
              console.log('Sending create request', requestBody);
              await axios.post(
                baseURL + '/admin/addColdVisible',
                JSON.stringify(requestBody),
                customConfig,
              );
            }
          }),
        );

        // Both operations have been completed successfully
        setChanged(false);
        setIsError(false);

        // Показать уведомление
        toast.success('Торговые точки успешно сохранены.'); // Уведомление об успешном сохранении
      } catch (error) {
        console.error(error);
        setIsError(true);

        // Показать уведомление об ошибке
        toast.error('Произошла ошибка при сохранении торговых точек.');
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.post(baseURL + `/admin/deleteColdRel/${rel.id}`, null, customConfig);

      console.log('deletedRel');
      window.location.reload();
    } catch (error) {
      console.log(error.resp);
    }
  };
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={handleClose}>
          &times;
        </span>
        <div className="flex">
          <div className="left-sideCreate">
            <div className="left-textCreate">Количество вагонеток в секции *</div>
            <div className="left-textCreate">Тип секции *</div>
            <div className="left-textCreate">Вкусы *</div>
          </div>
          <div className="center-sideCreate">
            <form>
              <input
                className="inputadmCreate"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder={data && data.quantity}
              />
              <select
                className="inputadmCreate"
                // value={sectionid || (data && data.sectionid) || 'секция'}
                value={formData.sectionid || (data && data.sectionid) || ''}
                onChange={handleSelectSectionChange}>
                <option value="">Выберите тип секции</option>
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
              <select
                className="inputadmCreate"
                // value={flavid || (data && data.flavorid) || 'секция'}
                value={formData.flavid || (data && data.flavorid) || ''}
                onChange={handleSelectFlavIdChange}>
                <option value="">Выберите тип секции</option>
                {flavors.map((flavor) => (
                  <option key={flavor.id} value={flavor.id}>
                    {flavor.name}
                  </option>
                ))}
              </select>
              {/* {isError && <ErrorMessage>Неверное имя пользователя или пароль</ErrorMessage>}{' '} */}
            </form>
          </div>
        </div>
        <h2>{rel.name}</h2>
        <p>{rel.description}</p>
        <div>
          <h2>Торговые точки</h2>
          <div className="flexboxModal">
            {props.stores &&
              props.stores.map((store) => (
                <label className="marginleft" key={store.id}>
                  {store.name}
                  <input
                    className="marginleft"
                    type="checkbox"
                    checked={visibleStores.includes(store.id)}
                    onChange={() => toggleStoreVisibility(store.id)}
                  />
                </label>
              ))}
          </div>
        </div>

        <button className="inputadmin" onClick={handleSave}>
          Сохранить изменения
        </button>
        <button className="inputadmin" onClick={handleDelete}>
          Удалить
        </button>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Modal;
