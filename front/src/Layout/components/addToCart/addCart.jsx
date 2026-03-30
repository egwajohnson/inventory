import axios from "axios";

const addToCart = async (productId, quantity = 1) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No user found");
    return null;
  }

  let cartId = localStorage.getItem("cartId");
  try {
    const response = await axios.post(
      "http://localhost:5000/api/v1/cart/add",
      { cartId, productId, quantity },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    const cart = response.data;
    if (cart?._id) {
      localStorage.setItem("cartId", cart._id);
    }

    alert("Product added to cart");
    console.log("Product added to cart:", cart);

    return cart;
  } catch (error) {
    if (error.response) {
      console.error("Server error:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request setup error:", error.message);
    }
    return null;
  }
};

export default addToCart;
