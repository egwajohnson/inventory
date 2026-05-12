import { useEffect, useState } from "react";
import axios from "axios";

function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getCoupons = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/v1/coupons/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res.data);

      // handles both array response and object response
      setCoupons(res.data.coupons || res.data || []);
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCoupons();
  }, []);

  if (loading) {
    return <div className="coupon-loading">Loading coupons...</div>;
  }

  if (error) {
    return <div className="coupon-error">{error}</div>;
  }

  return (
    <div className="coupon-page">
      <h1 className="coupon-title">Available Coupons</h1>

      <div className="coupon-grid">
        {coupons.length > 0 ? (
          coupons.map((coupon) => (
            <div className="coupon-card" key={coupon._id}>
              <h2 className="coupon-code">{coupon.code}</h2>

              <p className="coupon-discount">
                {coupon.discountValue}
                {coupon.discountType === "percentage" ? "%" : "₦"} OFF
              </p>

              <p className="coupon-min-order">
                Minimum Order: {coupon.minOrderValue}
              </p>

              <p className="coupon-status">
                Status: {coupon.active ? "Active" : "Inactive"}
              </p>

              <p className="coupon-date">
                Created: {new Date(coupon.createdAt).toLocaleDateString()}
              </p>

              <button
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(coupon.code);

                  alert("Coupon copied successfully");
                }}
              >
                Copy Code
              </button>
            </div>
          ))
        ) : (
          <p>No coupons available</p>
        )}
      </div>
    </div>
  );
}

export default Coupons;
