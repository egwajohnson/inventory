import axios from "axios";

const applyCoupon = async (couponCode) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const res = await axios.post(
      "http://localhost:5000/api/v1/apply/coupon",
      {
        code: couponCode,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("Coupon Applied:", res.data);

    return res.data;
  } catch (err) {
    console.error("Apply Coupon Error:", err.response?.data || err.message);

    alert(err.response?.data?.message || "Failed to apply coupon");
  }
};

export default applyCoupon;
