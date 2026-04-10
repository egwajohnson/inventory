import React from "react";
import { Link } from "react-router-dom";
import logout from "../../../logout/logout";
import ejLogo from "../../../assets/ejlogo.jpg";

function Header() {
  return (
    <>
      <header className="header-container">
        <Link to="#" className="navbar-brand d-flex align-items-center gap-2">
          <img
            src={ejLogo}
            alt="EJ Inventory Logo"
            width="40"
            height="50"
            className="img-fluid"
          />
          <span className="fw-bold text-primary">EJ Inventory</span>
        </Link>
        <nav className="nav navbar-expand-lg">
          <ul className="nav-list navbar-nav me-auto mb-2 mb-lg-0 ">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/about">
                About
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/contact">
                Contact
              </a>
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
        </nav>

        <div className="logout">
          <button onClick={logout}>Logout</button>
        </div>
      </header>
    </>
  );
}

export default Header;
