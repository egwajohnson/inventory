import axios from "axios";

const createProduct = async (productData) => {
  const API_URL = "http://localhost:5000/api/v1";
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${API_URL}/create/product`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );

    console.log("Product created:", response.data);

    return response.data;
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    throw error;
  }
};
export default createProduct;
