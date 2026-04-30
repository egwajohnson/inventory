import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { NavLink, Outlet } from "react-router-dom";
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
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchCarts();
  }, []);

  const filteredCarts = useMemo(() => {
    return carts.filter((cart) => {
      const user = cart?.userId?.toString()?.toLowerCase() || "";

      const matchSearch = user.includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "all" || (cart?.status || "pending") === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [carts, search, statusFilter]);

  const exportPDF = (cart) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("BOOKING INVOICE", 20, 20);

    doc.setFontSize(12);

    doc.text(`Booking ID: ${cart._id}`, 20, 35);
    doc.text(`Customer: ${cart.userId}`, 20, 45);
    doc.text(`Status: ${cart.status || "pending"}`, 20, 55);
    doc.text(`Payment Method: ${paymentMethod}`, 20, 65);
    doc.text(`Total Amount: ₦${cart.totalPrice || 0}`, 20, 75);

    let y = 95;

    doc.text("Ordered Products:", 20, y);

    y += 10;

    cart.items?.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item?.productId?.productName || "Unknown Product"}`,
        20,
        y,
      );

      y += 8;

      doc.text(`Quantity: ${item.quantity}`, 30, y);

      y += 8;

      doc.text(`Price: ₦${item?.productId?.productPrice || 0}`, 30, y);

      y += 12;
    });

    doc.save(`invoice_${cart._id}.pdf`);
  };

  // =========================
  // HANDLE PAYMENT
  // =========================
  const handlePay = async (cartId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/v1/carts/pay/${cartId}`,
        {
          paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Payment successful ✅");

      // update state instantly
      setCarts((prev) =>
        prev.map((cart) =>
          cart._id === cartId
            ? {
                ...cart,
                status: "paid",
              }
            : cart,
        ),
      );
    } catch (err) {
      alert(err?.response?.data?.message || "Payment failed");
    }
  };

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary"></div>

        <p className="mt-3 fw-semibold">Loading booking dashboard...</p>
      </div>
    );
  }

  // =========================
  // ERROR STATE
  // =========================
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="row g-0">
      {/* SIDEBAR */}
      <nav className="col-md-3 col-lg-2 bg-dark text-white min-vh-100 p-3">
        <div className="text-center mb-4">
          <h4 className="fw-bold">ADMIN PANEL</h4>
        </div>

        <ul className="nav flex-column gap-2">
          {[
            { to: "/", label: "Home", icon: "fa-home" },
            { to: "/create", label: "Create", icon: "fa-plus" },
            {
              to: "/booking",
              label: "Bookings",
              icon: "fa-calendar",
            },
            {
              to: "/cart",
              label: "Cart",
              icon: "fa-shopping-cart",
            },
            {
              to: "/products",
              label: "Products",
              icon: "fa-box",
            },
            {
              to: "/profile",
              label: "Profile",
              icon: "fa-user",
            },
            {
              to: "/settings",
              label: "Settings",
              icon: "fa-cog",
            },
          ].map((link) => (
            <li className="nav-item" key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `nav-link text-white rounded px-3 py-2 ${
                    isActive ? "bg-primary fw-bold" : ""
                  }`
                }
              >
                <i className={`fas ${link.icon} me-2`}></i>

                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <div className="col-md-9 col-lg-10 p-4 bg-light min-vh-100">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <div>
            <h2 className="fw-bold mb-1">🧾 Booking Dashboard</h2>

            <p className="text-muted mb-0">
              Manage customer bookings, payments, and invoices
            </p>
          </div>

          <div className="badge bg-primary fs-6 p-3">
            Total Orders: {filteredCarts.length}
          </div>
        </div>

        {/* SEARCH + FILTER */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Search Customer
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by user ID"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Filter By Status
                </label>

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
          </div>
        </div>

        {/* NO BOOKINGS */}
        {filteredCarts.length === 0 && (
          <div className="alert alert-info text-center">No bookings found.</div>
        )}

        {/* BOOKINGS */}
        <div className="accordion" id="bookingAccordion">
          {filteredCarts.map((cart, index) => (
            <div
              className="accordion-item border-0 shadow-sm mb-3"
              key={cart._id}
            >
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#order${index}`}
                >
                  <div className="d-flex justify-content-between align-items-center w-100 pe-3 flex-wrap gap-2">
                    <div>
                      <strong>User:</strong> {cart.userId}
                    </div>

                    <div className="badge bg-success">
                      ₦{cart.totalPrice || 0}
                    </div>

                    <div
                      className={`badge ${
                        cart.status === "paid"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {cart.status || "pending"}
                    </div>
                  </div>
                </button>
              </h2>

              <div
                id={`order${index}`}
                className="accordion-collapse collapse"
                data-bs-parent="#bookingAccordion"
              >
                <div className="accordion-body">
                  {/* PRODUCTS TABLE */}
                  <div className="table-responsive">
                    <table className="table table-bordered align-middle">
                      <thead className="table-dark">
                        <tr>
                          <th>#</th>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Price</th>
                        </tr>
                      </thead>

                      <tbody>
                        {cart.items?.map((item, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>

                            <td>
                              {item?.productId?.productName ||
                                "Unknown Product"}
                            </td>

                            <td>{item.quantity}</td>

                            <td>₦{item?.productId?.productPrice || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* PAYMENT + ACTIONS */}
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-4">
                    <div>
                      <Payment
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                      />
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-success"
                        onClick={() => handlePay(cart._id)}
                        disabled={cart.status === "paid"}
                      >
                        {cart.status === "paid" ? "Already Paid" : "Pay Now"}
                      </button>

                      <button
                        className="btn btn-outline-primary"
                        onClick={() => exportPDF(cart)}
                      >
                        Export Invoice
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Outlet />
      </div>
    </div>
  );
}

export default Booking;
