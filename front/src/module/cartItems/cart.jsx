import axios from "axios";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import updateCart from "../updateCart/updateCart";
import handlePayment from "../checkOut";

function Cart() {
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // Fetch cart items
  const getCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/cart", {
        headers,
      });
      setCart(res.data.items || []);
    } catch (error) {
      console.error("Cart fetch error:", error.response?.data || error.message);
    }
  };

  // Delete cart item
  const deleteItem = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/v1/cart/item/${productId}`,
        {
          headers,
        },
      );

      setCart((prev) =>
        prev.filter((item) => item.productId._id !== productId),
      );
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);
    }
  };

  const handleUpdate = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      const data = await updateCart(productId, quantity);

      setCart(data.items || []);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const total = cart.reduce((acc, item) => {
    const price = item.productPrice || 0;
    const discount = item.discount || 0;
    const qty = item.quantity || 0;

    return acc + (price - discount) * qty;
  }, 0);

  return (
    <div className="container">
      <div className="block">
        <h2>Cart Items</h2>

        {cart.length === 0 && <p>No items in cart</p>}

        {cart.map((item) => (
          <div key={item._id} className="del">
            <div className="prod">
              <div>Product ID: {item.productId?._id}</div>

              <div>
                Product Name: {item.productId?.productName || "Unknown Product"}
              </div>

              <div>
                Quantity:
                <button
                  onClick={() =>
                    handleUpdate(item.productId._id, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                  style={{ marginLeft: 5 }}
                >
                  -
                </button>
                <span style={{ margin: "0 8px" }}>{item.quantity}</span>
                <button
                  onClick={() =>
                    handleUpdate(item.productId._id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>
              <div>Price: {item.productPrice}</div>
            </div>

            <div className="cart-actions">
              <button
                className="delet"
                onClick={() => deleteItem(item.productId._id)}
                title="Remove item"
              >
                <FaTrash size={18} />
              </button>
            </div>
          </div>
        ))}

        <h3> Total: ₦{total.toLocaleString()}</h3>
      </div>

      <button onClick={() => handlePayment(total)}>Pay Now</button>
    </div>
  );
}

export default Cart;
