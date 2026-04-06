import React from "react";

function unauthorized() {
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

export default unauthorized;
