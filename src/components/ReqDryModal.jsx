import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseURL from '../apiConfig/const';

function ReqDryModal(props) {
  const { rel, handleClose } = props;
  const [sectionid, setSectionId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [flavid, setFlavId] = useState('');
  const [flavors, setFlavors] = useState([]);
  const [sections, setSections] = useState([]);
  const [data, setData] = useState(null);
  const [visibleStores, setVisibleStores] = useState([]);
  const [changed, setChanged] = useState(false);
  const [existingVisibleStores, setExistingVisibleStores] = useState([]);

  const token = localStorage.getItem('Token');
  const storageid = localStorage.getItem('selectedStore');
  const customConfig = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer_' + token,
    },
  };
  console.log(storageid);
  const usersName = JSON.stringify({
    id: rel.id,
    miscid: flavid,
    storageid: storageid,
    sectionid: sectionid,
    quantity: quantity,
  });
  console.log(usersName);
  const handleSave2 = () => {
    axios
      .post(baseURL + '/reqprocessor/modifyDryRel', usersName, customConfig)
      .then((response) => {
        console.log(response);
        setChanged(false);
      })
      .catch((error) => {
        console.error(error);
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
  const handleSave = () => {
    const requests = [];
    const relStores = props.stores.filter((store) => visibleStores.includes(store.id));

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
      let promise = Promise.resolve();
      requests.forEach((requestBody) => {
        if (requestBody.id !== undefined) {
          // If the store was previously visible and is now not visible, send a delete request
          promise = promise.then(() => {
            console.log('Sending delete request', requestBody);
            return axios.post(
              baseURL + '/reqprocessor/deleteDryVisibleById/' + requestBody.id,
              null,
              customConfig,
            );
          });
        } else {
          // If the store was not previously visible and is now visible, send a create request
          promise = promise.then(() => {
            console.log('Sending create request', requestBody);
            return axios.post(
              baseURL + '/reqprocessor/addDryVisible',
              JSON.stringify(requestBody),
              customConfig,
            );
          });
        }
      });

      // Add a finally function to the Promise to update data after all requests have been executed
      promise.finally(() => {
        axios
          .get(baseURL + `/reqprocessor/getDryVisibleByRelId/${rel.id}`, customConfig)
          .then((response) => {
            console.log(response.data);
            setVisibleStores(response.data.map((item) => item.storeid));
            setExistingVisibleStores(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
        setChanged(false);
      });
    }
  };
  useEffect(() => {
    const getFlavors = async () => {
      try {
        const response = await axios.get(baseURL + '/reqprocessor/getMisc', {
          headers: {
            Authorization: 'Bearer_' + token,
          },
        });
        setFlavors(response.data);
        console.log(flavors);
      } catch (error) {
        console.log(error);
      }
    };

    getFlavors();
  }, [token]);

  useEffect(() => {
    const getSections = async () => {
      try {
        const response = await axios.get(baseURL + '/reqprocessor/getSections', {
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
      .get(baseURL + `/reqprocessor/getDryVisibleByRelId/${rel.id}`, customConfig)
      .then((response) => {
        console.log(response.data);
        setVisibleStores(response.data.map((item) => item.storeid));
        setExistingVisibleStores(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [rel.id]);
  useEffect(() => {
    axios
      .get(baseURL + `/reqprocessor/getDryRel/${rel.id}`, customConfig)
      .then((response) => {
        console.log(response.data);
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [rel.id]);

  const handleDelete = async (id) => {
    try {
      await axios.post(baseURL + `/reqprocessor/deleteDryRel/${rel.id}`, null, customConfig);

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
            <div className="left-textCreate">Тип полки *</div>
            <div className="left-textCreate">Товары *</div>
          </div>
          <div className="center-sideCreate">
            <form>
              <input
                className="inputadmCreate"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={data && data.quantity}
              />
              <select
                className="inputadmCreate"
                value={data && data.sectionid}
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
                value={data && data.miscid}
                onChange={(e) => setFlavId(e.target.value)}>
                <option value="">Выберите тип секции</option>
                {flavors.map((flavor) => (
                  <option key={flavor.id} value={flavor.id}>
                    {flavor.name}
                  </option>
                ))}
              </select>
              <button className="inputadm" onClick={handleSave2}>
                Сохранить изменения
              </button>
            </form>
          </div>
        </div>
        <h2>{rel.name}</h2>
        <p>{rel.description}</p>
        <div>
          <h2>Торговые точки</h2>
          <div className="flexbox">
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
        <button className="buttonadmMod" onClick={handleSave} disabled={!changed}>
          Сохранить
        </button>
        <button className="buttonadmModd" onClick={handleDelete}>
          Удалить
        </button>
      </div>
    </div>
  );
}

export default ReqDryModal;
