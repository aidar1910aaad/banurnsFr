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
      <div className="container">
        <div className="userAdd">
          <div className="flexbox mgdown">
            <h1 className="Hadapt">Заявка отправлена</h1>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default ReqManager;
