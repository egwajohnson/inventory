import axios from "axios";

const handlePayment = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const res = await axios.post(
      "http://localhost:5000/api/v1/payment/checkout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log("Payment Response:", res.data);

    // If backend returns payment link
    if (res.data?.url) {
      window.location.href = res.data.url;
    }

    return res.data;
  } catch (err) {
    console.error("Payment Error:", err.response?.data || err.message);

    alert(err.response?.data?.message || "Payment failed");
  }
};

export default handlePayment;
