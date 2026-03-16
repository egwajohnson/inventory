import axios from "axios";
const handlePayment = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      "http://localhost:5000/api/v1/payment/checkout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log(res.data);
  } catch (err) {
    console.log(err);
  }
};
export default handlePayment;
