import React from "react";
import { Link } from "react-router-dom";
import logout from "../../../logout/logout";
import ejLogo from "../../../assets/ejlogo.jpg";

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top px-3">
      <div className="container-fluid">
        {/* LOGO */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <img
            src={ejLogo}
            alt="EJ Inventory Logo"
            width="40"
            height="50"
            className="img-fluid rounded"
          />

          <span className="fw-bold text-primary">EJ Inventory</span>
        </Link>

        {/* MOBILE TOGGLER */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* COLLAPSIBLE MENU */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-3">
            <li className="nav-item">
              <Link className="nav-link active" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                Cart
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/create">
                Create
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/products">
                Products
              </Link>
            </li>
          </ul>

          {/* LOGOUT */}
          <div className="d-flex">
            <button onClick={logout} className="btn btn-danger px-4">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
