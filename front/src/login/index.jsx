import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RequestOtp from "../Layout/components/requestOtp/requestOtp";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      console.log("STATUS:", res.status);
      console.log("BODY:", data);
      if (!res.ok) {
        throw new Error(data?.message || "Login failed");
      }

      //Store token or user data if returned
      localStorage.setItem("token", data.payload.token);

      console.log("Login successful, token stored:", data.payload.token);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="contain">
        <div className="login">
          <h2>Login</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <br />
            <br />
            <input
              type={showPassword ? "text" : "password"}
              id="passInp"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="checkbox"
              id="showPassword"
              onChange={() => setShowPassword(!showPassword)}
            />
            <br />
            <br />
            <button type="submit">Login</button>
          </form>
          <button className="forget">
            <a href="/RequestOtp">Reset Password?</a>
          </button>
        </div>
      </div>
    </>
  );
}
