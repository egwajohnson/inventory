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

  const getCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/cart", {
        headers,
      });
      setCart(res.data.items || []);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteItem = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/v1/cart/item/${productId}`,
        { headers },
      );

      setCart((prev) =>
        prev.filter((item) => item.productId._id !== productId),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateCart = async (productId, delta) => {
    try {
      const data = await updateCart(productId, delta);

      if (!data?.item?.items) return;

      setCart(data.item.items);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const total = cart.reduce((acc, item) => {
    const price = item.productPrice || 0;
    const discount = item.discount || 0;
    return acc + (price - discount) * item.quantity;
  }, 0);

  return (
    <div className="cart-container py-5">
      <h2 className="mb-4 text-center fw-bold">🛒 Your Cart</h2>
      <h2>cartId: {cart[0]?.cartId || "N/A"}</h2>

      {cart.length === 0 ? (
        <div className="alert alert-info text-center">No items in cart</div>
      ) : (
        <div className="row g-4">
          {cart.map((item) => (
            <div className="col-12" key={item._id}>
              <div className="card shadow-sm border-0">
                <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                  {/* Product Info */}
                  <div>
                    <small className="text-muted">
                      ID: {item.productId?._id || "N/A"}
                    </small>
                    <h5 className="mb-1">
                      {item.productId?.productName || "Unknown Product"}
                    </h5>

                    <p className="mb-0 mt-2">Price: ₦{item.productPrice}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleUpdateCart(item.productId._id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>

                    <span className="fw-bold px-2">{item.quantity}</span>

                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleUpdateCart(item.productId._id, 1)}
                    >
                      +
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteItem(item.productId._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TOTAL + PAYMENT */}
      <div className="mt-4 p-3 bg-light rounded shadow-sm d-flex justify-content-between align-items-center flex-wrap gap-3">
        <h4 className="mb-0">
          Total: <span className="text-success">₦{total.toLocaleString()}</span>
        </h4>

        <button
          className="btn btn-primary px-4"
          onClick={() => handlePayment(total)}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}

export default Cart;
