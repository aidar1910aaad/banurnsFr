import styled from 'styled-components';
import NavState from '../contex/navState';
import MainMenuAdmin from '../components/MainMenuAdmin';

const Container = styled.div`
  background-color: #fff5;
  height: 800px;
  padding-top: 150px;
  display: flex;
  justify-content: center;
`;
const Wrapper = styled.div`
  background: #fff5;
`;

function Admin() {
  return (
    <Wrapper>
      <NavState>
        <MainMenuAdmin />
      </NavState>
      <Container>
        <h1>Добро пожаловать, Администратор</h1>
      </Container>
    </Wrapper>
  );
}

export default Admin;
