import styled from 'styled-components';
import MainMenuReqManager from '../components/MainMenuReqManager';
import NavState from '../contex/navState';

const Container = styled.div`
  background: #fff5;
  height: 800px;
  padding-top: 70px;
  padding-left: 300px;
`;
const Wrapper = styled.div``;

function ReqManager() {
  return (
    <Wrapper>
      <NavState>
        <MainMenuReqManager />
      </NavState>
      <Container>
        <h1>Добро пожаловать, Обработчик заявок</h1>
      </Container>
    </Wrapper>
  );
}

export default ReqManager;
