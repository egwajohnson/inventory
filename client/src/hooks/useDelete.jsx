import axios from "axios";

function useDelete() {
  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/products/:id`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return { deleteProduct };
}

export default useDelete;
