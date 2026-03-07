import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

const createProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_URL}/create/product`, productData);

    console.log("Product created:", response.data);

    return response.data;
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
    throw error;
  }
};
export default createProduct;
