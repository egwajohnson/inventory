import { useState } from "react";
import createCoupon from "../../hooks/createCoupon";
import { useDebounce } from "../../hooks/useDebounce";

function CreateCoupon() {
  const [discountValue, setDiscountValue] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [minOrderValue, setMinOrderValue] = useState("");
  const [loading, setLoading] = useState(false);

  const debouncedDiscountValue = useDebounce(discountValue, 500);
  const debouncedMinOrderValue = useDebounce(minOrderValue, 500);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const result = await createCoupon({
        discountType,
        discountValue: Number(debouncedDiscountValue),
        minOrderValue: Number(debouncedMinOrderValue),
      });

      console.log(result);

      if (result?._id) {
        alert("Coupon created successfully");

        setDiscountType("percentage");
        setDiscountValue("");
        setMinOrderValue("");
      } else {
        alert(result?.message || "Failed to create coupon");
      }
    } catch (error) {
      console.error(error);

      alert(error.message || "Failed to create coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-coupon">
      <form onSubmit={handleCreateCoupon}>
        <select
          value={discountType}
          onChange={(e) => setDiscountType(e.target.value)}
        >
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed</option>
        </select>

        <input
          type="number"
          placeholder="Discount Value"
          value={discountValue}
          onChange={(e) => setDiscountValue(e.target.value)}
        />

        <input
          type="number"
          placeholder="Minimum Order Value"
          value={minOrderValue}
          onChange={(e) => setMinOrderValue(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Coupon"}
        </button>
      </form>
    </div>
  );
}

export default CreateCoupon;
