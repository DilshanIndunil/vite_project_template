/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader"; // Install with npm install @react-qr-reader
import './MaintenaceHistory.scss';
import { getMaintenanceHistoryByAsset } from "../../api/apiService";

const MaintenanceHistory = () => {
    const [scannedAssetId, setScannedAssetId] = useState(null);
    const [showScanner, setShowScanner] = useState(true);
    const [maintenanceData, setMaintenanceData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (scannedAssetId) {
            // Fetch maintenance history for the scanned asset
            setIsLoading(true);
            getMaintenanceHistoryByAsset(scannedAssetId)
                .then((data) => {
                    setMaintenanceData(data.data); // Assuming the data is in `data.data`
                })
                .catch((err) => setError(err.message))
                .finally(() => setIsLoading(false));
        }
    }, [scannedAssetId]);

    const handleScan = (result) => {
        if (result) {
            const assetID = result.text.split(',')[0].split(':')[1].trim(); // Ensure correct parsing
            setScannedAssetId(assetID); // Assuming the QR code contains the asset ID
            setShowScanner(false);
        }
    };

    const handleError = (error) => {
        console.error("QR Scanner Error:", error);
    };

    return (
        <div className="maintenance-history-container">


            <h1>
                <button className="back-button" onClick={() => window.history.back()}>
                    {"<"}
                </button>
                <span>Maintenance History</span>
            </h1>


            {!scannedAssetId ? (
                <div className="qr-scanner">
                    <QrReader
                        onResult={(result, error) => {
                            if (result) handleScan(result);
                            if (error) handleError(error);
                        }}
                        constraints={{ facingMode: 'environment' }}
                        containerStyle={{ width: '100%' }}
                    />
                    <p>Point your camera at the QR code to scan</p>
                </div>
            ) : (
                <>
                    <div className="details">
                        <div className="detail-item">
                            <span className="label">Asset ID:</span>
                            <span className="value">{scannedAssetId}</span>
                        </div>
                        <div className="history-list">
                            {isLoading ? (
                                <p>Loading maintenance history...</p>
                            ) : error ? (
                                <p>Error: {error}</p>
                            ) : maintenanceData.length > 0 ? (
                                maintenanceData.map((item, index) => (
                                    <div className="history-card" key={index}>
                                        <p>
                                            <strong>Asset Name:</strong> {item.assetName}
                                        </p>
                                        <p>
                                            <strong>Start Date:</strong> {new Date(item.startDate).toISOString().slice(0, 10)}
                                        </p>
                                        <p>
                                            <strong>End Date:</strong>{" "}
                                            {item.endDate ? new Date(item.endDate).toISOString().slice(0, 10) : "N/A"}
                                        </p>
                                        <p>
                                            <strong>Description:</strong> {item.description}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p>No maintenance history found for this asset.</p>
                            )}
                        </div>
                    </div>
                    <div className="buttons">
                        <button
                            className="back-button"
                            onClick={() => window.location.reload()} // Refreshes the page
                        >
                            Scan Another
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default MaintenanceHistory;
