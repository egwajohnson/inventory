import React, { useState } from "react";
import Login from "../../login";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [image, setImage] = useState(""); // URL string
  const [gender, setGender] = useState("");
  const [DOB, setDOB] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postcode, setPostcode] = useState("");
  const [role, setRole] = useState("customer");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const body = {
        title,
        firstName,
        lastName,
        userName,
        email,
        password,
        otp,
        image,
        gender,
        DOB,
        phoneNumber,
        address: {
          street,
          city,
          state,
          postcode: postcode ? Number(postcode) : undefined,
        },
        role,
      };

      const response = await fetch("http://localhost:5000/api/v1/user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log("Create user response:", data);

      if (!response.ok) {
        throw new Error(data.message || "User creation failed");
      }

      setMessage(data.message || "User created successfully!");
      // Reset all fields
      setTitle("");
      setFirstName("");
      setLastName("");
      setUserName("");
      setEmail("");
      setPassword("");
      setOtp("");
      setImage("");
      setGender("");
      setDOB("");
      setPhoneNumber("");
      setStreet("");
      setCity("");
      setState("");
      setPostcode("");
      setRole("customer");
      navigate("/Login");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container">
        <div className="reg">
          <h1>Confirm Registration</h1>
          {message && <p style={{ color: "green" }}>{message}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="firstName">First Name: </label>
              <input
                id="firstName"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name:</label>
              <input
                id="lastName"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="userName">Username</label>
              <input
                id="userName"
                placeholder="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
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
              <label htmlFor="otp">OTP</label>
              <input
                id="otp"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="img">Image URL</label>
              <input
                id="img"
                placeholder="Image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <input
                id="gender"
                placeholder="Gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="DOB">Date of Birth</label>
              <input
                id="DOB"
                type="date"
                placeholder="DOB"
                value={DOB}
                onChange={(e) => setDOB(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phn">Tel:</label>
              <input
                id="phn"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="street">Street</label>
              <input
                id="street"
                placeholder="Street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                id="city"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                id="state"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="postcode">Postcode</label>
              <input
                id="postcode"
                placeholder="Postcode"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
                <option value="merchant">Merchant</option>
              </select>
            </div>
            <br />
            <br />
            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
