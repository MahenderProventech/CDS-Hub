import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreateFormula from './components/CreateFormula';
import AssignRole from './components/AssignRole';
import UserList from './components/UserList';
import AuditTrail from './components/AuditTrail';
import Dashboard from './components/Home/Dashboards/Dashboard';
import Select from './components/Home/MainPages/Select';
import BlankPage from './components/Home/MainPages/BlankPage';
import Home from './components/Home/Home';
import MastersList from './components/MastersList/MastersList';
import '../src/Styles/common.css';
import Login from './components/Authentication/Login';
import { UserProvider } from './components/UserContext';
import PrivateRoute from './components/Authentication/PrivateRoute';
import UserCreation from './components/Authentication/UserCreation';
import GetFormulaByIds from './components/GetFormulaByIds';
import Configuration from './components/Configuration';
import ApproveFormulaByID from './components/ApproveFormulaByID';
import ReviewApproveDashboard from './components/Home/ReviewApprove/ReviewApproveDashboard';
import GenerateResultsById from './components/GenerateResultsById';
import BatchResult from './components/BatchResults';
import ExecReviewDashboard from './components/ExecReviewDashboard';
import ExecApproveFormulaByID from './components/ExecApproveFormulaByID';
import Reports from './components/Reports';
import DataTable from './components/DataTable';
import ConfigurationEdit from './components/ConfigurationEdit';
import TableDataComponent from './components/TableData';
import InputVariableTable from './components/InputVariables';
import HPLC_Dashboard from './components/HPLC_Dashboard';
import HPLC_Dashboard1 from './components/HPLC_Dashboard1';
import HPLCLog_List from './components/HPLCLog_List';
import ColumnLog_List from './components/ColumnLog_List';
import Column_Dashboard from './components/Column_Dashboard';
import Column_Dashboard1 from './components/Column_Dashboard1';
import Column_Search from './components/Column_Search';
import Column_AuditTrail from './components/Column_AuditTrail';
import Column_UserManagement from './components/Column_UserManagement';
import HPLC_Search from './components/HPLC_Search';
import HPLC_AuditTrail from './components/HPLC_AuditTrail';
import HPLC_UserManagement from './components/HPLC_UserManagement';
import SampleSetDetails from './components/SampleSetDetails';
import CSampleSetDetails from './components/CSampleSetDetails';
import UsageLogSetting from './components/UsageLogSetting.jsx';
import InstrumentDetails from './components/InstrumentDetails.jsx';
import Cfr from './components/Cfr.jsx';
import ChangePassword from './components/ChangePassword.jsx';
import ColumnFailurePredict from './components/ColumnFailurePredict.jsx';

import ExecutionList from './components/MastersList/ExecutionList';

function App() {
  return (
    <div>
      <UserProvider>

        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/home' element={<Home />}>
            <Route path='Select' element={<Select />} />
            <Route path='page' element={<BlankPage />} />
            <Route path='master-dashboard' element={<MastersList />} />
            <Route path='create-formula' element={<CreateFormula />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='get-formula-by-id/:id' element={<GetFormulaByIds />} />
            <Route path='create-formula/:id' element={<CreateFormula />} />
            <Route path='create-user' element={<UserCreation />} />
            <Route path='assignRole' element={<AssignRole />} />
            <Route path='userList' element={<UserList />} />
            <Route path='HPLC_Dashboard' element={<HPLC_Dashboard />} />
            <Route path='HPLC_Dashboard1' element={<HPLC_Dashboard1 />} />
            <Route path='HPLCLog_List' element={<HPLCLog_List />} />
            <Route path='Column_Dashboard' element={<Column_Dashboard />} />
            <Route path='Column_Dashboard1' element={<Column_Dashboard1 />} />
            <Route path='ColumnLog_List' element={<ColumnLog_List />} />
            <Route path='Column_Search' element={<Column_Search />} />
            <Route path='Column_AuditTrail' element={<Column_AuditTrail />} />
            <Route path='Column_UserManagement' element={<Column_UserManagement />} />
            <Route path='HPLC_Search' element={<HPLC_Search />} />
            <Route path='HPLC_AuditTrail' element={<HPLC_AuditTrail />} />
            <Route path='HPLC_UserManagement' element={<HPLC_UserManagement />} />
            <Route path='auditTrail' element={<AuditTrail />} />
            <Route path='configuration' element={<Configuration />} />
            <Route path='reviewApproveDashboard' element={<ReviewApproveDashboard />} />
            <Route path='batchresult' element={<BatchResult />} />
            <Route path='execReviewDashboard' element={<ExecReviewDashboard />} />
            <Route path='execApproveFormulaByID/:id' element={<ExecApproveFormulaByID />} />
            <Route path='generateResultsById/:id' element={<GenerateResultsById />} />
            <Route path='configurationEdit' element={<ConfigurationEdit />} />
            <Route path='HPLCLog_List/:sampleSetId' element={<SampleSetDetails />} />
            {/* <Route path='instrumentdetails' element={<InstrumentDetails />} /> */}
            <Route path='instrumentdetails/:instrument_No' element={<InstrumentDetails />} />
            <Route path='ColumnLog_List/:sampleSetId' element={<CSampleSetDetails />} />
            <Route path='UsageLogSetting' element={<UsageLogSetting />} />
            <Route path='Cfr' element={<Cfr />} />
            <Route path='ChangePassword' element={<ChangePassword />} />
            <Route path='ColumnFailurePredict' element={<ColumnFailurePredict />} />




            <Route path='configurationEdit/:configId' element={<ConfigurationEdit />} />
            <Route path='reports/' element={<Reports />} />
            <Route path='approveFormulaByID/:id' element={<ApproveFormulaByID />} />
            <Route path='data-table' element={<DataTable />} />
            <Route path='tabledata' element={<TableDataComponent />} />
            
 <Route path='execution-dashboard' element={<ExecutionList />} />
            {/* <Route path='InputVariableTable' element={<InputVariableTable />} /> */}
          </Route>
        </Routes>
      </UserProvider>

    </div>
  );
}

export default App;
