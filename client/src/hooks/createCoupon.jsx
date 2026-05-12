import axios from "axios";

const createCoupon = async (data) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return {
        success: false,
        message: "You are not logged in",
      };
    }

    const res = await axios.post(
      "http://localhost:5000/api/v1/create/coupon",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return res.data;
  } catch (err) {
    return (
      err.response?.data || {
        success: false,
        message: "Server error",
      }
    );
  }
};

export default createCoupon;
