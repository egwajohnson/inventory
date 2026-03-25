import axios from "axios";

const updateCart = async (productId, quantity) => {
  const token = localStorage.getItem("token");

  try {
    const res = await axios.put(
      "http://localhost:5000/api/v1/cart/update",
      { productId, quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data; 
  } catch (error) {
    console.error("UpdateCart error:", error.response?.data || error.message);
    throw error;
  }
};

export default updateCart;
