import axios from "axios";

const addToCart = async (productId, quantity = 1) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No user found");
    return null;
  }

  let cartId = localStorage.getItem("cartId");

  const cart_url = "http://localhost:5000/api/v1/cart/add";
  const createCart_url = "http://localhost:5000/api/v1/cart/create";
  try {
    if (!cartId) {
      const createCartRes = await axios.post(
        createCart_url,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      console.log("Cart created:", createCartRes.data);

      cartId = createCartRes.data._id;
      if (!cartId) {
        console.error("Cart creation failed, no _id returned");
        return null;
      }

      localStorage.setItem("cartId", cartId);
    }

    const response = await axios.post(
      cart_url,
      {
        productId,
        cartId,
        quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    alert("Product added to cart");
    console.log("Product added to cart:", response.data);

    return response.data;
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
