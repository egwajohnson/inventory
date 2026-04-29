import { useEffect, useState } from "react";
import axios from "axios";
import { useDebounce } from "./useDebounce";

const useSearch = (productName) => {
  const debouncedName = useDebounce(productName, 400);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!debouncedName) {
      setProduct(null);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/v1/products/name/${encodeURIComponent(
            debouncedName,
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        setProduct(res.data?.payload || null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch product");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [debouncedName]);

  return { product, loading, error };
};

export default useSearch;
