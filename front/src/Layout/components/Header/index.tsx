import React from "react";
import { Link } from "react-router-dom";
import logout from "../../../logout/logout";

function Header() {
  return (
    <>
    <header className="header-container">
      <div className="logo">
      <h2>Inventory Management System</h2>
      </div>
      <nav className="nav">
        <ul className="nav-list">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><Link to="/cart">Cart</Link></li>
          <li><Link to="/create">Create</Link></li>
          <li><Link to="/products">Products</Link></li>
          
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
