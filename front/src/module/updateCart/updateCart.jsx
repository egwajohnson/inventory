import axios from "axios";

const updateCart = async (productId, quantity) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not authenticated");
  }

  try {
    const res = await axios.patch(
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
