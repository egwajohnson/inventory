import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Payment from "../../Layout/payment/payment";
import { jsPDF } from "jspdf";

function Booking() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/v1/carts/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setCarts(response.data?.carts || []);
      } catch (error) {
        setError(error?.response?.data?.message || "Failed to load carts");
      } finally {
        setLoading(false);
      }
    };

    fetchCarts();
  }, []);

  const filteredCarts = useMemo(() => {
    return carts.filter((cart) => {
      const matchUser = cart.userId
        ?.toLowerCase()
        ?.includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "all" || cart.status === statusFilter;

      return matchUser && matchStatus;
    });
  }, [carts, search, statusFilter]);

  const exportPDF = (cart) => {
    const doc = new jsPDF();

    doc.text("Invoice", 10, 10);
    doc.text(`User: ${cart.userId}`, 10, 20);
    doc.text(`Total: ₦${cart.totalPrice || 0}`, 10, 30);
    doc.text(`Status: ${cart.status || "pending"}`, 10, 40);

    let y = 50;
    cart.items?.forEach((item, i) => {
      doc.text(
        `${i + 1}. ${item?.productId?.productName} - Qty: ${item.quantity}`,
        10,
        y,
      );
      y += 10;
    });

    doc.save(`invoice_${cart._id}.pdf`);
  };

  const handlePay = async (cartId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/v1/carts/pay/${cartId}`,
        { paymentMethod },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Payment successful ✅");

      // refresh list
      setCarts((prev) =>
        prev.map((c) => (c._id === cartId ? { ...c, status: "paid" } : c)),
      );
    } catch (err) {
      alert(err?.response?.data?.message || "Payment failed");
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />
        <p className="mt-3">Loading bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="py-4 booking container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">🧾 Booking Dashboard</h2>
        <span className="badge bg-primary">
          Total Orders: {filteredCarts.length}
        </span>
      </div>

      {/* SEARCH + FILTER */}
      <div className="row mb-4 g-2">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Search by User ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* ORDERS */}
      <div className="accordion" id="bookingAccordion">
        {filteredCarts.map((cart, index) => (
          <div className="accordion-item" key={cart._id}>
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#order${index}`}
              >
                <div className="d-flex justify-content-between w-100 pe-3">
                  <span>{cart.userId}</span>
                  <span className="badge bg-success">
                    ₦{cart.totalPrice || 0}
                  </span>
                  <span className="badge bg-secondary">
                    {cart.status || "pending"}
                  </span>
                </div>
              </button>
            </h2>

            <div
              id={`order${index}`}
              className="accordion-collapse collapse"
              data-bs-parent="#bookingAccordion"
            >
              <div className="accordion-body">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.items?.map((item, i) => (
                      <tr key={i}>
                        <td>{item?.productId?.productName}</td>
                        <td>{item.quantity}</td>
                        <td>₦{item?.productId?.productPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <Payment
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                  />

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success"
                      onClick={() => handlePay(cart._id)}
                      disabled={cart.status === "paid"}
                    >
                      {cart.status === "paid" ? "Paid" : "Pay Now"}
                    </button>

                    <button
                      className="btn btn-outline-primary"
                      onClick={() => exportPDF(cart)}
                    >
                      Export Invoice PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Booking;
