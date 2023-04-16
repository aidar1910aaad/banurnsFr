import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { MenuContext } from '../contex/navState';
import React, { useContext, useState } from 'react';

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
  font-size: 18px;
  line-height: 120%;
  font-weight: 50;
  background-color: #2a3f54;
  border-bottom: 1px solid #000;
  outline: none;

  border-size: 10px;

  :hover {
    background-position: 90% 50%;
    color: #fff;
    border-bottom: 1px solid #5a738e;
    opacity: 0.9;
    background: #374a5e;
    transition: 0.2s;
  }
`;

export const SideMenuAdmin = ({ children }) => {
  const { isMenuOpen } = useContext(MenuContext);

  return <Menu open={isMenuOpen}>{children}</Menu>;
};

SideMenuAdmin.propTypes = {
  children: PropTypes.node,
};

SideMenuAdmin.defaultProps = {
  children: (
    <>
      <MenuLink href="/Admin/UserManage">Управление пользователями</MenuLink>
      <MenuLink href="/Admin/Outlet">Торговые точки</MenuLink>
      <MenuLink href="/Admin/RefrigeratedWarehouse">Добавление складов хл</MenuLink>
      <MenuLink href="/Admin/Flavor">Вкусы мороженого</MenuLink>
      <MenuLink href="/Admin/RefrCellSections">Управление секциями</MenuLink>
      <MenuLink href="/Admin/CellsTypesEditor">Типы секций</MenuLink>
      <MenuLink href="/Admin/Misc">Товары</MenuLink>
      <MenuLink href="/Admin/DryWarehouse">Добавление сухих складов</MenuLink>
      <MenuLink href="/Admin/DryCellsTypesEditor">Содержимое полок</MenuLink>
    </>
  ),
};
