import { useState, useRef } from "react";
import { QrReader } from "react-qr-reader";
import { getAssetById, updateAssetLocation, updateAssetCondition } from "../../api/apiService.js"; // Import the new function
import "./AssetsDetails.scss";

const AssetDetails = () => {
    const [isScanned, setIsScanned] = useState(false);
    const [assetDetails, setAssetDetails] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const isScannedRef = useRef(false); // Persist scanned state across re-renders

    const handleScan = async (result) => {
        if (result && !isScannedRef.current) {
            isScannedRef.current = true; // Mark as scanned
            try {
                const qrData = result.text;
                const assetId = qrData.split(",")[0].split(":")[1].trim();
                const fetchedAssetDetails = await getAssetById(assetId);
                setAssetDetails(fetchedAssetDetails);
                setIsScanned(true);
                setError(null);
            } catch (error) {
                console.error("Error fetching asset details:", error);
                setError("Failed to fetch asset details. Please try again.");
                isScannedRef.current = false; // Allow retry on error
            }
        }
    };

    const handleError = (error) => {
        console.error("QR Code Scan Error:", error);
        setError("QR Code Scan Error. Please try again.");
    };

    const handleEditToggle = () => setIsEditing((prev) => !prev);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAssetDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value, // Update the field being edited
        }));
    };

    const handleSave = async () => {
        try {
            // Update location if edited
            if (assetDetails.location !== "") {
                await updateAssetLocation(assetDetails.assetID, assetDetails.location);
            }

            // Update condition if edited
            if (assetDetails.condition !== "") {
                await updateAssetCondition(assetDetails.assetID, assetDetails.condition); // Update condition
            }

            setIsEditing(false);
            console.log("Updated Details:", assetDetails);
        } catch (error) {
            console.error("Error saving asset details:", error);
            setError("Failed to save asset details. Please try again.");
        }
    };


    return (
        <div className="asset-details-container">
            {!isScanned ? (
                <div className="qr-scanner">
                    <QrReader
                        onResult={(result, error) => {
                            if (result) handleScan(result);
                            if (error) handleError(error);
                        }}
                        constraints={{ facingMode: "environment" }}
                        scanDelay={2000} // Prevent rapid re-scans
                        containerStyle={{ width: "100%" }}
                    />
                    <p>Point your camera at the QR code to scan</p>
                    {error && <p className="error-message">{error}</p>}
                </div>
            ) : (
                assetDetails && (
                    <>
                        <div className="details">
                            <div className="detail-item">
                                <span className="label">Asset Name:</span>
                                <span className="value">{assetDetails.name}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Asset Tag:</span>
                                <span className="value">{assetDetails.assetTag}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Status:</span>
                                <span className="value">{assetDetails.status}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">User:</span>
                                <span className="value">{assetDetails.user}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Condition:</span>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="condition"
                                        value={assetDetails.condition}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <span className="value">{assetDetails.condition}</span>
                                )}
                            </div>
                            <div className="detail-item">
                                <span className="label">Location:</span>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="location"
                                        value={assetDetails.location}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <span className="value">{assetDetails.location}</span>
                                )}
                            </div>
                            <div className="detail-item">
                                <span className="label">Last Maintenance:</span>
                                <span className="value">{assetDetails.maintenanceDue}</span>
                            </div>

                            <div className="detail-item">
                                <span className="label">Asset Image:</span>
                                <div className="value">
                                    {assetDetails?.image ? (
                                        <img
                                            src={`http://localhost:5000/uploads${assetDetails.image}`}
                                            alt="Asset"
                                            className="asset-image-preview"

                                        />
                                    ) : (
                                        <p>No asset image available</p>
                                    )}
                                </div>
                            </div>

                        </div>
                        <div className="buttons">
                            {isEditing ? (
                                <>
                                    <button className="save-button" onClick={handleSave}>
                                        Save
                                    </button>
                                    <button className="cancel-button" onClick={handleEditToggle}>
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button className="edit-button" onClick={handleEditToggle}>
                                    Update Details
                                </button>
                            )}
                        </div>
                    </>
                )
            )}
        </div>
    );
};

export default AssetDetails;
