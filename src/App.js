import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
              <Route path="/Admin/UserManage" element={<AdminUserManage />} />
              <Route path="/Admin/Outlet" element={<AdminOutlet />} />
              <Route path="/Admin/Flavor" element={<AdminFlavor />} />
              <Route path="/Admin/Misc" element={<AdminMisc />} />
            </>
          ) : userRole === 'ROLE_SALESMANAGER' ? (
            <>
              <Route path="/SalesManager" element={<SalesManager />} />
              <Route path="/SalesManager/Req" element={<SalesManagerReq />} />
              <Route path="/SalesManager/Sended" element={<SalesManagerSended />} />
              <Route path="/SalesManager/Req/Create" element={<SalesManagerCreate />} />
            </>
          ) : userRole === 'ROLE_REQUESTMANAGER' ? (
            <>
              <Route path="/ReqManager" element={<ReqManager />} />
              <Route path="/ReqManager/Req" element={<ReqManagerReq />} />
              <Route path="/ReqManager/Closed" element={<ReqManagerClosed />} />
              <Route path="/ReqManager/Show" element={<ReqManagerShow />} />
            </>
          ) : (
            <Route path="/login" element={<Navigate to="/Login" />} />
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
