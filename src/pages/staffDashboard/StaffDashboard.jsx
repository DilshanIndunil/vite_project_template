import './StaffDashboard.scss';
import { Link } from 'react-router-dom';

const StaffDashboard = () => {
    return (
        <div className="staff-dashboard">
            <header className="dashboard-header">
                <h1>Welcome Maintenance Staff Member</h1>
            </header>
            <div className="dashboard-options">
                <Link to="/request-maintenance" className="option-button">
                    Start Maintenance
                </Link>
                <Link to="/maintenance-history" className="option-button">
                    Maintenance History
                </Link>
                <Link to="/asset-details-staff" className="option-button">
                    Tool Information
                </Link>
            </div>
        </div>
    );
};

export default StaffDashboard;
