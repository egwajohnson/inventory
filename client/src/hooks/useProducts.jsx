import { useState, useEffect } from "react";
import axios from "axios";

function useProducts() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const limit = 5;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `http://localhost:5000/api/v1/products/list?page=${page}&limit=${limit}&sort=-createdAt`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        setProducts(response.data?.products || []);
        setMeta(response.data?.meta || null);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  const nextPage = () => {
    if (meta?.pages && page < meta.pages) {
      setPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  return {
    products,
    loading,
    error,
    page,
    meta,
    nextPage,
    prevPage,
  };
}

export default useProducts;
