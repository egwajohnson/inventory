import React, { useEffect, useState } from "react";
import axios from "axios";
import Payment from "../../Layout/payment/payment";

function Booking() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/v1/carts/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = response.data;
        console.log("API Response:", data.carts);

        setCarts(data?.carts || []);
      } catch (error) {
        console.error(
          "Error fetching carts:",
          error.data?.message || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCarts();
  }, []);

  if (loading) {
    return <h3>Loading carts...</h3>;
  }

  return (
    <div className="container mt-4 booking">
      <h1>Bookings</h1>

      {carts.length === 0 ? (
        <p>No carts found</p>
      ) : (
        carts.map((cart) => (
          <div key={cart._id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">User: {cart.userId}</h5>

              <ul>
                {cart.items.map((item, index) => (
                  <li key={index}>
                    Product: {item.productId?.productName} | Price:{" "}
                    {item.productId?.productPrice} | Qty: {item.quantity} |
                    Discount: {item.discount}%
                  </li>
                ))}
              </ul>
              <p className="card-text">Total: {cart.totalPrice}</p>
            </div>
            <Payment
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
          </div>
        ))
      )}
    </div>
  );
}

export default Booking;
