import React, { useRef, useContext } from 'react';
import styled from 'styled-components';
import useOnClickOutside from '../hooks/onClickOutside';
import { MenuContext } from '../contex/navState';
import HamburgerButton from './HamburgerButton';
import { SideMenuAdmin } from './SideMenuAdmin';

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
  background: #222222 none repeat scroll 0% 0%;
  color: rgb(248, 248, 248);
  min-width: 0px;
  min-height: 0px;
  flex-direction: row;
  justify-content: flex-start;
  padding: 6px 20px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 8px 16px;
  z-index: 500;
`;

const Flexbox = styled.div`
  width: 100%;
  display: flex;
  justify-content: right;
`;

const Logoutbtn = styled.a`
  outline: none;
  text-decoration: none;
  color: #fff;
`;

const MainMenuAdmin = () => {
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
      <Navbar>
        <HamburgerButton />
        <h1>SkladBanurNs</h1>
        <Flexbox>
          <Logoutbtn onClick={handleSubmit} href="/login">
            Выйти
          </Logoutbtn>
        </Flexbox>
      </Navbar>
      <SideMenuAdmin />
    </header>
  );
};

export default MainMenuAdmin;
