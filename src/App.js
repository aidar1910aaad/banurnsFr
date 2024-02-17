import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Admin from './pages/Admin';
import AdminOutlet from './pages/AdminOutlet';
import AdminUserManage from './pages/AdminUserManage';
import Login from './pages/Login';
import ReqManager from './pages/ReqManager';
import SalesManager from './pages/SalesManager';
import AdminFlavor from './pages/AdminFlavor';
import AdminMisc from './pages/AdminMisc';
import SalesManagerReq from './pages/SalesManagerReq';
import SalesManagerSended from './pages/SalesManagerSended';
import SalesManagerCreate from './pages/SalesManagerCreate';
import ReqManagerReq from './pages/ReqManagerReq';
import ReqManagerClosed from './pages/ReqManagerClosed';
import ReqManagerShow from './pages/ReqManagerShow';
import AdminFrStore from './pages/AdminFrStore';
import AdminCellsSections from './pages/AdminCellsSections';
import AdminCellsEditor from './pages/AdminCellsEditor';
import AdminDryWarehouse from './pages/AdminDryWarehouse';
import AdminDryCellsTypesEditor from './pages/AdminDryCellsTypesEditor';
import ReqFlavor from './pages/ReqFlavor';
import ReqMisc from './pages/ReqMisc';
import ReqFrStore from './pages/ReqFrStore';
import ReqCellsSections from './pages/ReqCellsSections';
import ReqCellsEditor from './pages/ReqCellsEditor';
import ReqDryWarehouse from './pages/ReqDryWarehouse';
import ReqDryCellsTypesEditor from './pages/ReqDryCellsTypesEditor';
import AllClosedReq from './components/AllClosedReq';
import ReqManagerAllClosed from './pages/ReqManagerAllClosed';
import ReqManagerReqq from './pages/ReqManagerReqq';
import ReqManagerCreate from './pages/ReqManagerCreate';
import SalesManagerEdit from './pages/SalesManagerEdit';
import ReqManagerCreateEdit from './pages/ReqManagerCreateEdit';
import SalesManagerCreateEdit from './pages/SalesManagerCreateEdit';
import SalesManagerShow from './pages/SalesManagerShow';
import SalesManagerShowNow from './pages/SalesManagerShowNow';
import SalesManagerEditTwo from './pages/SalesManagerCreateEditTwo';

function App() {
  const userRole = localStorage.getItem('Role');

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/Login" element={<Login />} />
          {userRole === 'ROLE_ADMIN' ? (
            <>
              <Route path="/Admin" element={<Admin />} />
              <Route path="*" element={<Navigate to="/Admin/UserManage" />} />
              <Route path="/Admin/UserManage" element={<AdminUserManage />} />
              <Route path="/Admin/Outlet" element={<AdminOutlet />} />
              <Route path="/Admin/Flavor" element={<AdminFlavor />} />
              <Route path="/Admin/Misc" element={<AdminMisc />} />
              <Route path="/Admin/RefrigeratedWarehouse" element={<AdminFrStore />} />
              <Route path="/Admin/RefrCellSections" element={<AdminCellsSections />} />
              <Route path="/Admin/CellsTypesEditor" element={<AdminCellsEditor />} />
              <Route path="/Admin/DryWarehouse" element={<AdminDryWarehouse />} />
              <Route path="/Admin/DryCellsTypesEditor" element={<AdminDryCellsTypesEditor />} />
            </>
          ) : userRole === 'ROLE_SALESMANAGER' ? (
            <>
              <Route path="/SalesManager" element={<SalesManager />} />
              <Route path="/SalesManager/CreateEdit" element={<SalesManagerCreateEdit />} />
              <Route path="/SalesManager/Edit" element={<SalesManagerEdit />} />
              <Route path="/SalesManager/EditTwo" element={<SalesManagerEditTwo />} />

              <Route path="*" element={<Navigate to="/SalesManager/Req" />} />
              <Route path="/SalesManager/Req" element={<SalesManagerReq />} />
              <Route path="/SalesManager/Sended" element={<SalesManagerSended />} />
              <Route path="/SalesManager/Show" element={<SalesManagerShow />} />
              <Route path="/SalesManager/Req/Create" element={<SalesManagerCreate />} />
              <Route path="/SalesManager/ShowNow" element={<SalesManagerShowNow />} />
            </>
          ) : userRole === 'ROLE_REQUESTMANAGER' ? (
            <>
              <Route path="/ReqManager/Reqq" element={<ReqManagerReqq />} />
              <Route path="/ReqManager/Reqq/Create" element={<ReqManagerCreate />} />
              <Route path="/ReqManager/Reqq/CreateEdit" element={<ReqManagerCreateEdit />} />
              <Route path="/ReqManager" element={<ReqManager />} />
              <Route path="/ReqManager/Req" element={<ReqManagerReq />} />
              <Route path="/ReqManager/Closed" element={<ReqManagerClosed />} />
              <Route path="/ReqManager/AllClosed" element={<ReqManagerAllClosed />} />
              <Route path="/ReqManager/Show" element={<ReqManagerShow />} />
              <Route path="*" element={<Navigate to="/ReqManager/Req" />} />
              <Route path="/ReqManager/ShowAll" element={<AllClosedReq />} />
              <Route path="/ReqManager/Flavor" element={<ReqFlavor />} />
              <Route path="/ReqManager/Misc" element={<ReqMisc />} />
              <Route path="/ReqManager/RefrigeratedWarehouse" element={<ReqFrStore />} />
              <Route path="/ReqManager/RefrCellSections" element={<ReqCellsSections />} />
              <Route path="/ReqManager/CellsTypesEditor" element={<ReqCellsEditor />} />
              <Route path="/ReqManager/DryWarehouse" element={<ReqDryWarehouse />} />
              <Route path="/ReqManager/DryCellsTypesEditor" element={<ReqDryCellsTypesEditor />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
