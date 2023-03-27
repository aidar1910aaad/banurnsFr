import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { MenuContext } from '../contex/navState';

const Menu = styled.div`
  position: fixed;

  top: 0px;
  left: 0px;
  bottom: 0px;
  z-index: 293;
  width: 300px;
  max-width: 100%;
  margin-top: 0px;
  padding-top: 70px;
  padding-right: 0px;
  align-items: stretch;
  border: 10px #000;
  background-color: #2a3f54;
  transform: translateX(-100%);
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

  ${(props) =>
    props.open &&
    css`
      transform: translateX(0);
    `}
`;

export const MenuLink = styled.a`
  position: relative;
  display: flex;
  text-align: left;
  max-width: 100%;
  width: 95%;
  padding-left: 5%;
  height: 30px;
  padding-top: 15px;
  padding-bottom: 8px;
  background-position: 88% 50%;
  background-size: 36px;
  background-repeat: no-repeat;
  transition: background-position 300ms cubic-bezier(0.455, 0.03, 0.515, 0.955);
  text-decoration: none;
  color: #fff;
  cursor: default;
  font-size: 22px;
  line-height: 120%;
  font-weight: 50;
  background-color: #2a3f54;
  border: none;
  outline: none;
  border-size: 10px;
  border-color: #000;

  :hover {
    background-position: 90% 50%;
    color: #fff;
    border-bottom: 10px #fff;
    opacity: 0.9;
    background: #222;
    transition: 0.2s;
  }
`;

export const SideMenuManager = ({ children }) => {
  const { isMenuOpen } = useContext(MenuContext);

  return <Menu open={isMenuOpen}>{children}</Menu>;
};

SideMenuManager.propTypes = {
  children: PropTypes.node,
};

SideMenuManager.defaultProps = {
  children: (
    <>
      <MenuLink href="/SalesManager/Req">Создать заявку</MenuLink>
      <MenuLink href="/SalesManager/Sended">Отправленные заявки</MenuLink>
    </>
  ),
};
