import React, { useState } from "react";
import applyCoupon from "./applyCoupon";

function CouponApply() {
  const [coupon, setCoupon] = useState("");

  const handleApplyCoupon = async () => {
    const response = await applyCoupon(coupon);

    console.log(response);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Coupon"
        value={coupon}
        onChange={(e) => setCoupon(e.target.value)}
      />

      <button onClick={handleApplyCoupon}>Apply Coupon</button>
    </div>
  );
}

export default CouponApply;
