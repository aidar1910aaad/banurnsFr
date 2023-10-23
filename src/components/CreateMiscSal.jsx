import React, { useState, useEffect } from 'react';
import '../css/style.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseURL from '../apiConfig/const';
import CreateFlavors from '../components/CreateFlavors';

function CreateMiscSal(props) {
  const { setResultMisc, miscss, miscssF, miscsDataArray } = props;
  const [categoryVisibility, setCategoryVisibility] = useState({});
  const [name, setName] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');
  let filteredData;
  if (miscssF && miscssF.length > 0) {
    filteredData = miscssF.filter(
      (item, index, self) => index === self.findIndex((t) => t.nameMisc === item.nameMisc),
    );
  } else {
    filteredData = miscssF || []; // Set an empty array if data is null
  }

  useEffect(() => {
    const inputs = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    setName(inputs);
  }, []);

  // Update localStorage when inputs change
  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(name));
  }, [name]);

  // Handle user input changes and update name

  const handleMiscInputChange = (e, id) => {
    const value = e.target.value;
    setResultMisc((prevMiscs) => {
      if (!Array.isArray(prevMiscs)) {
        return prevMiscs;
      }

      return prevMiscs.map((misc) => {
        if (misc.id === id) {
          misc.quantity = value;
        }
        return misc;
      });
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const localStorageKey = 'miscInputs';

  // Load inputs from localStorage when component is mounted
  useEffect(() => {
    const inputs = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    setName(inputs);
  }, []);

  // Update localStorage when inputs change
  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(name));
  }, [name]);

  const filteredMiscs = filteredData
    ? filteredData.filter((misc) => {
        return misc.nameMisc && misc.nameMisc.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMiscs ? filteredMiscs.slice(indexOfFirstItem, indexOfLastItem) : [];

  const groupedItems = {};
  currentItems.forEach((item) => {
    if (!groupedItems[item.nameStorage]) {
      groupedItems[item.nameStorage] = [];
    }
    groupedItems[item.nameStorage].push(item);
  });

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredMiscs.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    const result = name
      .filter((value) => value && value[1] !== '' && value[1] !== '0')
      .map((value, index) => `${value[0]}:${value[1]}`)
      .join('&');
    setResultMisc(result);
  }, [name, setResultMisc, currentPage]);
  const toggleCategoryVisibility = (category) => {
    setCategoryVisibility((prevVisibility) => ({
      ...prevVisibility,
      [category]: !prevVisibility[category],
    }));
  };
  const handleInputChange = (event, index) => {
    const newInputs = [...name];
    newInputs[index] = [index, event.target.value];
    setName(newInputs);
  };
  const [flavorsVisible, setFlavorsVisible] = useState(true);
  const toggleFlavorsVisibility = () => {
    setFlavorsVisible(!flavorsVisible);
  };

  return (
    <div className="h2">
      <h2>Дополнительное</h2>
      <button
        type="button"
        style={{
          backgroundColor: '#f5f5f5',
          border: 'none',
          width: '100%',
          borderRadius: '4px',
          padding: '8px 10px',
          color: '#333',
          cursor: 'pointer',
          outline: 'none',
          marginTop: '15px',
          marginBottom: '15px',
          transition: 'background-color 0.3s ease',
        }}
        onClick={toggleFlavorsVisibility}>
        {flavorsVisible ? 'Свернуть' : 'Показать'}
      </button>

      <div className="searchbar">
        <input
          style={{
            marginTop: '10px',
            marginBottom: '5px',
          }}
          type="text"
          placeholder="Поиск по названию"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
      </div>
      {flavorsVisible && (
        <>
          {Object.entries(groupedItems).map(([nameStorage, items]) => (
            <div key={nameStorage}>
              <h2 onClick={() => toggleCategoryVisibility(nameStorage)}>{nameStorage}</h2>
              {categoryVisibility[nameStorage] && (
                <div>
                  {items.map((item) => (
                    <div className="h3" key={item.miscId}>
                      <div className="flexxe">
                        <p className="fulll">{item.nameMisc}</p>
                        <input
                          className="inputttt"
                          onChange={(e) => handleInputChange(e, item.miscId)}
                          type="number"
                          value={item.quantity}></input>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </>
      )}
      <div className="pagination">
        <select onChange={handleItemsPerPageChange}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="25">25</option>
        </select>
        <ul>
          {pageNumbers.map((number) => (
            <li key={number}>
              <a href="#" onClick={() => handlePageChange(number)}>
                {number}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CreateMiscSal;
