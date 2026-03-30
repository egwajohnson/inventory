import axios from "axios";

const increaseQuantity = async (itemId) => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.patch(
      "http://localhost:5000/api/v1/cart/quantity/increase",
      { itemId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  } catch (err) {
    console.error(
      "Error increasing quantity:",
      err.response?.data || err.message,
    );
    throw err;
  }
};

export default increaseQuantity;
