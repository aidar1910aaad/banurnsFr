import React, { useRef, useContext } from 'react';
import styled from 'styled-components';
import useOnClickOutside from '../hooks/onClickOutside';
import { MenuContext } from '../contex/navState';
import HamburgerButton from './HamburgerButton';
import { SideMenuReqManager } from './SideMenuReqManager';

const Navbar = styled.div`
  display: flex;
  position: fixed;
  left: 0;
  right: 0;
  box-sizing: border-box;
  outline: currentcolor none medium;
  max-width: 100%;
  margin: 0px;
  align-items: center;
  background: #ededed none repeat scroll 0% 0%;
  color: #5a738e;
  min-width: 0px;
  min-height: 0px;
  flex-direction: row;
  justify-content: flex-start;
  padding: 6px 20px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 8px 16px;
  z-index: 500;
  border-bottom: 1px #d9dee4;
`;

const Flexbox = styled.div`
  width: 100%;
  display: flex;
  justify-content: right;
`;

const Logoutbtn = styled.a`
  outline: none;
  text-decoration: none;
  color: #5a738e;
  margin-left: 20px;
`;

const MainMenuReqManager = () => {
  const node = useRef();
  const { isMenuOpen, toggleMenuMode } = useContext(MenuContext);
  useOnClickOutside(node, () => {
    // Only if menu is open
    if (isMenuOpen) {
      toggleMenuMode();
    }
  });
  const handleSubmit = function () {
    localStorage.clear('Token');
  };
  return (
    <header ref={node}>
      <Navbar className="Navvv">
        <HamburgerButton />
        <h1 className="BigT">SkladBanurNs</h1>
        <Flexbox className="Flexb">
          <Logoutbtn className="Logoutbtnn" href="/ReqManager/ShowAll">
            Посмотреть все заявки
          </Logoutbtn>
          <Logoutbtn className="Logoutbtnn" onClick={handleSubmit} href="/login">
            Выйти
          </Logoutbtn>
        </Flexbox>
      </Navbar>
      <SideMenuReqManager />
    </header>
  );
};

export default MainMenuReqManager;
