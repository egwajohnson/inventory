import React, { useState } from "react";

function Payment({ paymentMethod, setPaymentMethod }) {
  return (
    <div className="mb-3">
      <h5>Payment Method</h5>

      <label style={{ marginRight: "15px" }}>
        <input
          type="radio"
          value="cash"
          checked={paymentMethod === "cash"}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        Cash on Delivery
      </label>

      <label>
        <input
          type="radio"
          value="online"
          checked={paymentMethod === "online"}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        Online Payment
      </label>

      <p>
        Selected: <strong>{paymentMethod}</strong>
      </p>
    </div>
  );
}

export default Payment;
