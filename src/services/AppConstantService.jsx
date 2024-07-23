const Domain_url = "http://localhost:58747/api/";
// const Domain_url = "http://172.26.8.225:8086/api/";
// const Domain_url = "http://10.203.103.142:8086/api/";

const domain_Formulas = Domain_url + 'Formulas/';
const domain_UserManagement = Domain_url + 'Configuration/';
const domain_user = Domain_url + 'User/';
const domain_Reports = Domain_url + 'Reports/';

export const userGetRoles = domain_UserManagement + 'GetRoles';
export const getPlants = domain_UserManagement + 'GetPlants';
export const getGroups = domain_UserManagement + 'GetGroups';
export const getRoles = domain_UserManagement + 'GetRoles';
export const getDepartments = domain_UserManagement + 'GetDepartments';
export const getDesignation = domain_UserManagement + 'GetDesignations';

// users
export const getAllUsers = domain_user + 'GetListOfUsers';
export const fetchUserById = domain_user + 'GetUserById';
export const submitUserForm = domain_user + 'CreateorUpdateUser';
export const UpdateUserStatus = domain_user + 'UpdateUserStatus';

// reports
export const getResultsReport = domain_Reports + 'GetExecutionFormulaReportDetails?';
// export const getResultsReportHeader = domain_Reports + 'GetBatchResultsReportHeader?';
// export const getResultsReportFooter = domain_Reports + 'GetBatchResultsReportFooter?';
export const getReportsList = domain_Reports + 'GetBatchResultsDetails?';

// save and submit formula

export const saveFormula = domain_Formulas + 'SaveFormulaData';
export const submitFormula = domain_Formulas + 'CreateorUpdateFormula';

