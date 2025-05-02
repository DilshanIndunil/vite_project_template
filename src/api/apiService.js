import axios from 'axios';

const API_URL = 'http://localhost:5000';  // Backend API URL

// Axios instance for API calls
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to fetch asset details by asset ID
export const getAssetById = async (assetId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await api.get(`/api/assets/details/${assetId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.asset; // Assuming the response contains the asset details
    } catch (error) {
        console.error('Error fetching asset details:', error.response?.data || error.message);
        throw error.response?.data?.message || 'Failed to fetch asset details.';
    }
};

// Function to update the status of an asset by asset ID
export const updateAssetStatus = async (assetId, status) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await api.patch(`/api/assets/user-status/${assetId}`, { status }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.asset; // Assuming the response contains the updated asset details
    } catch (error) {
        console.error("Error updating asset status:", error.response?.data || error.message);
        throw error.response?.data?.message || 'Failed to update asset status.';
    }
};

// Function to update the user of an asset by asset ID
export const updateAssetUser = async (assetId, user) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await api.patch(`/api/assets/user-status/${assetId}`, { user }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.asset; // Assuming the response contains the updated asset details
    } catch (error) {
        console.error("Error updating asset user:", error.response?.data || error.message);
        throw error.response?.data?.message || 'Failed to update asset user.';
    }
};

// Function to send OTP to the phone number
export const sendOTP = async (phone) => {
    try {
        const response = await api.post('/api/send-otp', { phone });
        return response.data; // Assuming the response contains the message
    } catch (error) {
        console.error('Error sending OTP:', error.response?.data || error.message);
        throw error.response?.data?.message || 'Failed to send OTP.';
    }
};

// Function to log in a factory worker
export const loginFactoryWorker = async (phone, verificationCode) => {
    try {
        const response = await api.post('/api/login-factory-worker', { phone, otp: verificationCode });
        return response.data; // Assuming the response contains the token and message
    } catch (error) {
        console.error("Error logging in factory worker:", error.response?.data || error.message);
        throw error.response?.data?.message || 'Failed to log in factory worker.';
    }
};

// Function to log in a staff member
export const loginStaffMember = async (phone, verificationCode) => {
    try {
        const response = await api.post('/api/login-maintenance-staff', { phone, otp: verificationCode });
        return response.data; // Assuming the response contains the token and message
    } catch (error) {
        console.error("Error logging in staff member:", error.response?.data || error.message);
        throw error.response?.data?.message || 'Failed to log in staff member.';
    }
};


// Function to update the location of an asset by asset ID
export const updateAssetLocation = async (assetId, location) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await api.patch(`/api/assets/location/${assetId}`, { location }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.asset; // Assuming the response contains the updated asset details
    } catch (error) {
        console.error("Error updating asset location:", error.response?.data || error.message);
        throw error.response?.data?.message || 'Failed to update asset location.';
    }
};

// Function to update the condition of an asset by asset ID
export const updateAssetCondition = async (assetId, condition) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await api.put(`/api/edit-asset/${assetId}`, { condition }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.asset; // Assuming the response contains the updated asset details
    } catch (error) {
        console.error("Error updating asset condition:", error.response?.data || error.message);
        throw error.response?.data?.message || 'Failed to update asset condition.';
    }
};

// Function to submit a maintenance request
export const submitMaintenanceRequest = async (maintenanceData) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        console.log('Maintenance Data:', maintenanceData); // Debug payload
        const response = await api.post('/api/maintenance/add', maintenanceData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error submitting maintenance request:', error.response?.data || error.message);
        throw error.response?.data?.message || 'Failed to submit maintenance request.';
    }
};

// Function to fetch maintenance history by asset ID
export const getMaintenanceHistoryByAsset = async (assetId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const response = await api.get(`/api/maintenance/asset/${assetId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Assuming the API response contains the maintenance history in `response.data`
    } catch (error) {
        console.error("Error fetching maintenance history:", error.response?.data || error.message);
        throw error.response?.data?.message || 'Failed to fetch maintenance history.';
    }
};

export default api;