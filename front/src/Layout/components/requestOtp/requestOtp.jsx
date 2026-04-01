import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

function RequestOtp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Email is required");
      return;
    }
    if (!isValidEmail(email)) {
      setMessage("Please enter a valid email address");
      return;
    }

    try {
      const response = await Axios.post(
        "http://localhost:5000/api/v1/user/request-otp",
        { email },
        { headers: { "Content-Type": "application/json" } },
      );

      setMessage(response.data.message || "OTP sent to your email");

      navigate("/ForgotPassword", { state: { email } });
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || "Failed to request OTP";
      setMessage(backendMessage);
    }
  };

  return (
    <>
      <div className="contain">
        <div className="login">
          <h2>Request OTP</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <br />
              <br />
              <div className="request">
                <button type="submit">Request OTP</button>
              </div>
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

export default RequestOtp;
