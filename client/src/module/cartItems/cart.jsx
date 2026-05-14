import axios from "axios";
import { useEffect, useState } from "react";
import { FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";

import updateCart from "../updateCart/updateCart";
import handlePayment from "../checkOut";
import deleteCart from "../../hooks/deleteCart";

function Cart() {
  const [cartData, setCartData] = useState(null);
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(true);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // GET CART
  const getCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/cart", {
        headers,
      });

      setCartData(res.data);
      setCart(res.data.items || []);
    } catch (error) {
      console.error(error);
    }
  };

  // DELETE SINGLE ITEM
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
      console.error(error);
    }
  };

  // DELETE ENTIRE CART
  const handleDeleteCart = async () => {
    try {
      if (!cartData?._id) return;

      await deleteCart(cartData._id);

      setCart([]);
      setCartData(null);

      alert("Cart deleted successfully");
    } catch (error) {
      console.error(error);
    }
  };

  // UPDATE QUANTITY
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

  // TOTAL PRICE
  const total = cart.reduce((acc, item) => {
    const price = item.productPrice || 0;
    const discount = item.discount || 0;

    return acc + (price - discount) * item.quantity;
  }, 0);

  return (
    <div className="cart-container">
      <div className="cent">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h2 className="fw-bold mb-0">🛒 Your Cart ({cart.length})</h2>

          <div className="d-flex gap-2">
            {/* COLLAPSE BUTTON */}
            <button className="btn btn-dark" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {/* DELETE CART */}
            <button className="btn btn-danger" onClick={handleDeleteCart}>
              Delete Cart
            </button>
          </div>
        </div>

        {/* COLLAPSIBLE CONTENT */}
        {isOpen && (
          <>
            {/* CART ID */}
            <div className="text-center mb-4">
              <span className="badge bg-dark">
                Cart ID: {cartData?._id || "N/A"}
              </span>
            </div>

            {/* EMPTY CART */}
            {cart.length === 0 ? (
              <div className="alert alert-info text-center">
                No items in cart
              </div>
            ) : (
              <div className="row g-4">
                {cart.map((item) => (
                  <div className="col-12" key={item._id}>
                    <div className="card shadow-sm border-0">
                      <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        {/* PRODUCT INFO */}
                        <div>
                          <small className="text-muted">
                            ID: {item.productId?._id || "N/A"}
                          </small>

                          <h5 className="mb-1">
                            {item.productId?.productName || "Unknown Product"}
                          </h5>

                          <p className="mb-0 mt-2">
                            Price: ₦{item.productPrice}
                          </p>
                        </div>

                        {/* QUANTITY CONTROLS */}
                        <div className="d-flex align-items-center gap-2">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() =>
                              handleUpdateCart(item.productId._id, -1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>

                          <span className="fw-bold px-2">{item.quantity}</span>

                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() =>
                              handleUpdateCart(item.productId._id, 1)
                            }
                          >
                            +
                          </button>
                        </div>

                        {/* DELETE ITEM */}
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
            {cart.length > 0 && (
              <div className="mt-4 p-3 bg-light rounded shadow-sm d-flex justify-content-between align-items-center flex-wrap gap-3">
                <h4 className="mb-0">
                  Total:{" "}
                  <span className="text-success">
                    ₦{total.toLocaleString()}
                  </span>
                </h4>

                <button
                  className="btn btn-primary px-4"
                  onClick={() => handlePayment(total)}
                >
                  Pay Now
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
