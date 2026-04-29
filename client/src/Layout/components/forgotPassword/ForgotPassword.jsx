import React, { useState } from "react";
import Axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const emailFromState = location.state?.email || "";
  const [email, setEmail] = useState(emailFromState);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post(
        "http://localhost:5000/api/v1/user/reset-password",
        { email, otp, newPassword },
      );

      // Success
      setMessage(response.data.message || "Password reset successful!");
      if (response.status === 200) {
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (error) {
      const backendMessage =
        error.response?.data?.payload ||
        error.response?.data?.message ||
        "An error occurred";

      setMessage(backendMessage);
      if (backendMessage.toLowerCase().includes("otp has expired")) {
        setTimeout(() => navigate("/RequestOtp"), 3000); // 3 seconds delay
      }
    }
  };

  return (
    <>
      <div className="contain">
        <div className="reset-password">
          <h2>Forgot Password</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" value={email} disabled />
            </div>

            <div>
              <label htmlFor="otp">OTP:</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <div className="new-password">
              <label htmlFor="password">New Password:</label>
              <input
                type="password"
                id="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="rquest">
              <button type="submit">Reset Password</button>
            </div>
          </form>

          {message && (
            <p style={{ marginTop: "10px", color: "red" }}>{message}</p>
          )}
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
