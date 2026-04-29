import React from "react";
import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Access Denied</h2>
        <p>You don’t have permission to view this page.</p>
        <Link to="/">Go to Login</Link>
      </div>
    </>
  );
}

export default Unauthorized;
