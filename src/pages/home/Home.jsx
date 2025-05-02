import './Home.scss';
import homeImage from '../../assets/home-image.jpg';
import { useNavigate } from 'react-router-dom';

function Main() {
    const navigate = useNavigate();

    return (
        <div className="main-container">
            <div className="image">
                <img src={homeImage} alt="" />
            </div>
            <div className="welcome-section">
                <h1>Welcome to</h1>
                <h2>Qr Assets<br />Tracker</h2>
            </div>
            <div className="button-section">
                <button
                    className="role-button"
                    onClick={() => navigate('/login-worker')}
                >Factory Worker</button>
                <button
                    className="role-button"
                    onClick={() => navigate('/login-staff')}
                >Maintenance Staff</button>
            </div>
        </div>
    );
}

export default Main;
