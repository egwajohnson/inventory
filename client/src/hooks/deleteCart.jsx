import axios from "axios";

const deleteCart = async (cartId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.delete(
      `http://localhost:5000/api/v1/cart/delete/${cartId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.log(error.response?.data || error.message);
    throw error;
  }
};

export default deleteCart;
