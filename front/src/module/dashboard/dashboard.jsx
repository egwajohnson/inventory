import React from "react";
import { NavLink, Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <div className="container-fluid mt-4 dashboard">
      <div className="row">
        {/* Sidebar */}
        <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar p-3 min-vh-100">
          <div className="text-center mb-4">
            <span className="navbar-brand fw-bold">My App</span>
          </div>

          <ul className="nav flex-column">
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active fw-bold" : ""}`
                }
              >
                <i className="fas fa-home me-2"></i> Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/create"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active fw-bold" : ""}`
                }
              >
                <i className="fas fa-plus me-2"></i> Create
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active fw-bold" : ""}`
                }
              >
                <i className="fas fa-shopping-cart me-2"></i> Cart
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active fw-bold" : ""}`
                }
              >
                <i className="fas fa-box me-2"></i> Products
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active fw-bold" : ""}`
                }
              >
                <i className="fas fa-user me-2"></i> Profile
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active fw-bold" : ""}`
                }
              >
                <i className="fas fa-cog me-2"></i> Settings
              </NavLink>
            </li>
          </ul>
        </nav>
        {/* Main Content */}
        <main className="col-md-9 col-lg-10 p-4">
          <h1>Dashboard</h1>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
