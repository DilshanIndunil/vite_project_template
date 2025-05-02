import { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import { getAssetById, updateAssetStatus, updateAssetLocation, updateAssetUser } from "../../api/apiService.js";
import "./AssetsDetails.scss";

const getUserFromJWT = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.name;
    } catch (e) {
        console.error("Error decoding JWT:", e);
        return null;
    }
};

const AssetDetails = () => {
    const [isScanned, setIsScanned] = useState(false);
    const [assetDetails, setAssetDetails] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [tempLocation, setTempLocation] = useState(""); // Temporary state for location
    const [error, setError] = useState(null);

    // Only fetch asset details once when QR code is scanned
    useEffect(() => {
        if (assetDetails && !isEditing) {
            setTempLocation(assetDetails.location); // Set location when asset details are fetched
        }
    }, [assetDetails, isEditing]);

    const handleScan = async (result) => {
        if (result && !isScanned) {
            try {
                const qrData = result.text;
                const assetId = qrData.split(",")[0].split(":")[1].trim();
                const fetchedAssetDetails = await getAssetById(assetId);
                setAssetDetails(fetchedAssetDetails);
                setTempLocation(fetchedAssetDetails.location); // Set the location when asset details are fetched
                setIsScanned(true);
                setError(null);
            } catch (error) {
                console.error("Error fetching asset details:", error);
                setError("Failed to fetch asset details. Please try again.");
            }
        }
    };

    const handleError = (error) => {
        console.error("QR Code Scan Error:", error);
        setError("QR Code Scan Error. Please try again.");
    };

    const handleEditToggle = () => {
        setIsEditing((prev) => !prev);
        if (!isEditing) {
            setTempLocation(assetDetails.location); // Reset location value when toggling edit mode
        }
    };

    const handleSave = async () => {
        // Save the new location only if it's different
        if (tempLocation !== assetDetails.location) {
            try {
                await updateAssetLocation(assetDetails.assetID, tempLocation);
                setAssetDetails((prevDetails) => ({
                    ...prevDetails,
                    location: tempLocation,
                }));
                setIsEditing(false); // Exit editing mode after saving
            } catch (error) {
                console.error("Error saving asset details:", error);
                setError("Failed to save asset details. Please try again.");
            }
        } else {
            setIsEditing(false); // Exit editing mode if no changes
        }
    };

    const handleStatusToggle = async () => {
        const newStatus = assetDetails.status === "Available" ? "Checked In" : "Available";
        try {
            const updatedAsset = await updateAssetStatus(assetDetails.assetID, newStatus);
            setAssetDetails(updatedAsset);

            if (newStatus === "Checked In") {
                const userName = getUserFromJWT();
                if (userName) {
                    await updateAssetUser(assetDetails.assetID, userName);
                    setAssetDetails((prevDetails) => ({
                        ...prevDetails,
                        user: userName,
                    }));
                }
            } else {
                await updateAssetUser(assetDetails.assetID, "no user");
                setAssetDetails((prevDetails) => ({
                    ...prevDetails,
                    user: "no user",
                }));
            }
        } catch (error) {
            console.error("Error updating asset status and user:", error);
            setError("Failed to update asset status and user. Please try again.");
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
                                <span className="value">{assetDetails.condition}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Location:</span>
                                {isEditing ? (
                                    <select
                                        value={tempLocation} // Use tempLocation for the dropdown value
                                        onChange={(e) => setTempLocation(e.target.value)} // Update tempLocation on selection
                                    >
                                        <option value="" disabled>
                                            Select a location
                                        </option>
                                        <option value="Warehouse A">Warehouse A</option>
                                        <option value="Warehouse B">Warehouse B</option>
                                        <option value="Office 1">Office 1</option>
                                        <option value="Office 2">Office 2</option>
                                    </select>
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
                                <>
                                    <button
                                        className="status-toggle-button edit-button"
                                        onClick={handleStatusToggle}
                                    >
                                        {assetDetails.status === "Available" ? "Check In" : "Check Out"}
                                    </button>
                                    <button className="edit-button" onClick={handleEditToggle}>
                                        Update Details
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                )
            )}
        </div>
    );
};

export default AssetDetails;
