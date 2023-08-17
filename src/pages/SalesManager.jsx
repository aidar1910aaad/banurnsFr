import styled from 'styled-components';
import MainMenuManager from '../components/MainMenuManager';
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
        <MainMenuManager />
      </NavState>
      <Container>
        <h1>Заявка успешно отправлена.</h1>
      </Container>
    </Wrapper>
  );
}

export default ReqManager;
