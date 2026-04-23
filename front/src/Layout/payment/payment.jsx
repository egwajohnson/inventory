import React, { useState } from "react";

function Payment({ paymentMethod, setPaymentMethod }) {
  return (
    <div className="mb-3">
      <h5>Payment Method</h5>

      <div className="paymentOptions">
        <select
          name="paymentMethod"
          id="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option
            value="cash"
            checked={paymentMethod === "cash"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            Cash on Delivery
          </option>
          <option
            value="online"
            checked={paymentMethod === "online"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            Online Payment
          </option>
        </select>

        <p>
          Selected: <strong>{paymentMethod}</strong>
        </p>
      </div>
    </div>
  );
}

export default Payment;
