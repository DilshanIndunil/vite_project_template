import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';
import { getAssetById, submitMaintenanceRequest } from '../../api/apiService.js';
import './RequestMaintenance.scss';

const RequestMaintenance = () => {
    const [formData, setFormData] = useState({
        assetID: '',
        assetName: '', // Add assetName field
        companyID: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        description: ''
    });
    const [isScanned, setIsScanned] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const isScannedRef = useRef(false); // Persist scanned state across re-renders
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleScan = async (result) => {
        if (result && !isScannedRef.current) {
            isScannedRef.current = true; // Mark as scanned
            try {
                const qrData = result.text;
                const assetID = qrData.split(',')[0].split(':')[1].trim();
                const fetchedAssetDetails = await getAssetById(assetID);
                setFormData((prevData) => ({
                    ...prevData,
                    assetID,
                    assetName: fetchedAssetDetails.name, // Set assetName
                    companyID: fetchedAssetDetails.companyID // Assuming companyID is part of fetched asset details
                }));
                setIsScanned(true);
                setError(null);
            } catch (error) {
                console.error('Error fetching asset details:', error);
                setError('Failed to fetch asset details. Please try again.');
                isScannedRef.current = false; // Allow retry on error
            }
        }
    };

    const handleError = (error) => {
        console.error('QR Code Scan Error:', error);
        setError('QR Code Scan Error. Please try again.');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.assetID || !formData.startDate || !formData.startTime || !formData.description || !formData.companyID) {
            setError('All fields are required. Please complete the form.');
            setSuccessMessage('');
            return;
        }

        try {
            // Call API to submit maintenance request
            const response = await submitMaintenanceRequest(formData);
            setSuccessMessage('Maintenance request submitted successfully!');
            setError(null);
            console.log('Maintenance Request Response:', response);
            // Navigate to staff-dashboard after successful submission
            navigate('/staff-dashboard');
        } catch (error) {
            console.error('Error submitting maintenance request:', error);
            setError(error?.message || 'Failed to submit maintenance request. Please try again.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="request-maintenance">
            <h1>
                <button className="back-button" onClick={() => window.history.back()}>
                    {"<"}
                </button>
                <span>Request Maintenance</span>
            </h1>
            {!isScanned ? (
                <div className="qr-scanner">
                    <QrReader
                        onResult={(result, error) => {
                            if (result) handleScan(result);
                            if (error) handleError(error);
                        }}
                        constraints={{ facingMode: 'environment' }}
                        scanDelay={2000} // Prevent rapid re-scans
                        containerStyle={{ width: '100%' }}
                    />
                    <p>Point your camera at the QR code to scan</p>
                    {error && <p className="error-message">{error}</p>}
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="assetID">Asset ID</label>
                        <input
                            type="text"
                            id="assetID"
                            name="assetID"
                            value={formData.assetID}
                            onChange={handleChange}
                            placeholder="Asset ID"
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="assetName">Asset Name</label>
                        <input
                            type="text"
                            id="assetName"
                            name="assetName"
                            value={formData.assetName}
                            onChange={handleChange}
                            placeholder="Asset Name"
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="startDate">Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="startTime">Start Time</label>
                        <input
                            type="time"
                            id="startTime"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="endDate">End Date (optional)</label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="endTime">End Time (optional)</label>
                        <input
                            type="time"
                            id="endTime"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Describe the Issue</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the issue"
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="submit-button">
                        Send
                    </button>
                    {successMessage && <p className="success-message">{successMessage}</p>}
                    {error && <p className="error-message">{error}</p>}
                </form>
            )}
        </div>
    );
};

export default RequestMaintenance;