import axios from "axios";

const updateCart = async (productId, quantity) => {
  const token = localStorage.getItem("token");

  return axios.put(
    "http://localhost:5000/api/v1/cart/update",
    { productId, quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export default updateCart;
