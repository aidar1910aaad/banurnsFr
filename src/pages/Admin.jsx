import styled from 'styled-components';
import NavState from '../contex/navState';
import MainMenuAdmin from '../components/MainMenuAdmin';

const Container = styled.div`
  background-color: #000;
  padding-top: 70px;
  display: flex;
  justify-content: center;
  width: 1500px;
`;
const Wrapper = styled.div`
  background: #000;
`;

function Admin() {
  return (
    <div className="wrapper">
      <NavState>
        <MainMenuAdmin />
      </NavState>
    </div>
  );
}

export default Admin;
