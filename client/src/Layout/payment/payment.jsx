import React from "react";

function Payment({ paymentMethod, setPaymentMethod }) {
  return (
    <div className="card border-0 shadow-sm p-3">
      <div className="mb-3">
        <h5 className="fw-bold mb-1">Payment Method</h5>
        <small className="text-muted">
          Choose how you want to pay for your order
        </small>
      </div>
      <div className="mb-3">
        <label className="form-label fw-semibold">Select Method</label>

        <select
          className="form-select"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="cash">Cash on Desk</option>
          <option value="cash">Cash on Delivery</option>
          <option value="online">Online Payment</option>
        </select>
      </div>

      <div className="alert alert-light border d-flex justify-content-between align-items-center mb-0">
        <span className="text-muted">Selected Method</span>
        <span className="fw-bold text-primary">
          {paymentMethod === "cash" ? "Cash on Delivery" : "Online Payment"}
        </span>
      </div>
    </div>
  );
}

export default Payment;
