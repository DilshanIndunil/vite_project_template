import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import LoginWorker from './pages/login/LoginFactoryWoker';
import LoginStaff from './pages/login/LoginStaffMember';
import RequestMaintenance from './pages/requestMaintenace/RequestMaintenace'; // Corrected import path
import StaffDashboard from './pages/staffDashboard/StaffDashboard';
import MaintenaceHistory from './pages/maintenaceHistory/MaintenaceHistory';
import AssetDetailsFactoryWorker from './pages/assetsDetails/AssetsDetailsFactoryWorker';
import AssetDetailsStaffMember from './pages/assetsDetails/AssetsDetailsStaffMember';

function App() {
  return (
    <Router>
      <Routes>
        {/* Define the route for the Main page */}
        <Route path="/" element={<Home />} />
        <Route path='/login-worker' element={<LoginWorker />} />
        <Route path='/login-staff' element={<LoginStaff />} />
        <Route path='/asset-details-worker' element={<AssetDetailsFactoryWorker />} />
        <Route path='/asset-details-staff' element={<AssetDetailsStaffMember />} />
        <Route path='/request-maintenance' element={<RequestMaintenance />} />
        <Route path='/staff-dashboard' element={<StaffDashboard />} />
        <Route path='/maintenance-history' element={<MaintenaceHistory />} />

        {/* Add other routes here as needed */}
      </Routes>
    </Router>
  );
}

export default App;