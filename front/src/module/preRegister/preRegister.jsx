import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import register from "./register";

export default function PreRegister() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState("staff"); // default
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/user/pre-register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, position }),
        },
      );

      const data = await response.json();
      console.log("Pre-register response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Pre-registration failed");
      }

      setMessage(data.message || "Pre-registration successful!");
      setEmail("");
      setPassword("");
      setPosition("admin");
      navigate("/register");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="contain">
        <div className="pre">
          <h2>Pre-Register</h2>
          {message && <p style={{ color: "green" }}>{message}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="position">Position</label>
              <select
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="merchant">Merchant</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            <br />
            <button type="submit" disabled={loading}>
              {loading ? "Pre-registering..." : "Pre-Register"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
