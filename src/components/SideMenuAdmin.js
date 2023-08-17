import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { MenuContext } from '../contex/navState';
import React, { useContext, useState } from 'react';

const SubMenu = styled.div`
  display: ${(props) => (props.open ? 'block' : 'none')};
  padding: 10px;
  background-color: #2a3f54;

  a {
    display: block;
    padding: 5px 10px;
    color: #333;
    border-bottom: 1px solid #111;
    font-size: 13px;
    &:hover {
      background-color: #ddd;
    }
  }
`;

const SubMenuItem = styled.div`
  a {
    display: block;
    padding: 5px 20px;

    color: #333;
    &:hover {
      background-color: #ddd;
    }
  }
`;

const MenuItem = styled.div`
  cursor: pointer;

  a {
    display: block;
    padding: 10px;
    text-decoration: none;
    color: #fff;
    border-bottom: 1px solid #111;
    &:hover {
      background-color: #374a5e;
    }
  }
`;

const Menu = styled.div`
  position: fixed;

  top: 0px;
  left: 0px;
  bottom: 0px;
  z-index: 293;
  width: 250px;
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

  const [subMenuStates, setSubMenuStates] = useState({
    users: false,
    outlets: false,
    refrigeratedWarehouses: false,
    dryWarehouses: false,
  });

  const handleSubMenuClick = (subMenuKey) => {
    setSubMenuStates((prevSubMenuStates) => ({
      ...prevSubMenuStates,
      [subMenuKey]: !prevSubMenuStates[subMenuKey],
    }));
  };

  return (
    <Menu open={isMenuOpen}>
      <MenuItem>
        <a onClick={() => handleSubMenuClick('users')}>Пользователи</a>
        <SubMenu open={subMenuStates.users}>
          <SubMenuItem>
            <a href="/Admin/UserManage">Управление пользователями</a>
          </SubMenuItem>
        </SubMenu>
      </MenuItem>
      <MenuItem>
        <a onClick={() => handleSubMenuClick('outlets')}>Торговые точки</a>
        <SubMenu open={subMenuStates.outlets}>
          <SubMenuItem>
            <a href="/Admin/Outlet">Управление</a>
          </SubMenuItem>
        </SubMenu>
      </MenuItem>
      <MenuItem>
        <a onClick={() => handleSubMenuClick('refrigeratedWarehouses')}>Холодильные склады</a>
        <SubMenu open={subMenuStates.refrigeratedWarehouses}>
          <MenuItem>
            <a href="/Admin/RefrigeratedWarehouse">Добавление складов</a>
          </MenuItem>
          <MenuItem>
            <a href="/Admin/Flavor">Вкусы мороженого</a>
          </MenuItem>
          <MenuItem>
            <a href="/Admin/RefrCellSections">Управление секциями</a>
          </MenuItem>
          <MenuItem>
            <a href="/Admin/CellsTypesEditor">Типы секций</a>
          </MenuItem>
        </SubMenu>
      </MenuItem>
      <MenuItem>
        <a onClick={() => handleSubMenuClick('dryWarehouses')}>Сухие склады</a>
        <SubMenu open={subMenuStates.dryWarehouses}>
          <MenuItem>
            <a href="/Admin/Misc">Товары</a>
          </MenuItem>
          <MenuItem>
            <a href="/Admin/DryWarehouse">Сухие склады</a>
          </MenuItem>
          <MenuItem>
            <a href="/Admin/DryCellsTypesEditor">Полки сухих складов</a>
          </MenuItem>
        </SubMenu>
      </MenuItem>
      {children}
    </Menu>
  );
};

SideMenuAdmin.propTypes = {
  children: PropTypes.node,
};
