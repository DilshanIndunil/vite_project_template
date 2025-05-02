import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import { sendOTP, loginStaffMember } from "../../api/apiService.js";

function LoginPage() {
    const navigate = useNavigate();

    // States to manage the form inputs and button logic
    const [phoneNumber, setPhoneNumber] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false); // Determines if the code is sent
    const [error, setError] = useState(null);

    // Handle the phone number input change
    const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value);
    };

    // Handle the verification code input change
    const handleVerificationCodeChange = (e) => {
        setVerificationCode(e.target.value);
    };

    // Handle sending the verification code
    const handleSendVerificationCode = async () => {
        try {
            // Call the backend API to send OTP
            const response = await sendOTP(phoneNumber);
            console.log("OTP sent successfully:", response);

            setIsCodeSent(true); // Simulate that the code is sent
        } catch (error) {
            console.error("Error sending OTP:", error);
            setError(error);
        }
    };

    // Handle login with the verification code
    const handleLogin = async () => {
        try {
            // Call the login API
            const response = await loginStaffMember(phoneNumber, verificationCode);
            console.log("Login successful:", response);

            // Store the token in localStorage
            localStorage.setItem('token', response.token);

            // Proceed with login, navigate to the next page
            navigate("/staff-dashboard"); // Change this to your desired route
        } catch (error) {
            console.error("Error logging in:", error);
            setError(error.message || "An error occurred during login.");
        }
    };

    return (
        <div className="login-container">
            <div className="back-button">
                <button onClick={() => navigate("/")}>
                    <span>{"<"}</span>
                </button>
            </div>
            <div className="form-container">
                <div className="input-group">
                    <FaPhone className="icon" />
                    <input
                        type="tel"
                        placeholder="Enter Phone Number"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                    />
                </div>
                {isCodeSent && (
                    <div className="input-group">
                        <FaEnvelope className="icon" />
                        <input
                            type="text"
                            placeholder="Your verification code here"
                            value={verificationCode}
                            onChange={handleVerificationCodeChange}
                        />
                    </div>
                )}
                <button
                    className="verification-button"
                    onClick={isCodeSent ? handleLogin : handleSendVerificationCode}
                >
                    {isCodeSent ? "Login" : "Get Verification Code"}
                </button>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
}

export default LoginPage;
