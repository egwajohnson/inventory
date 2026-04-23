import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import useProducts from "../../hooks/useProducts";
import useSearch from "../../hooks/useSearch";

function Dashboard() {
  const { products, loading, error } = useProducts();

  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    product: searchedProduct,
    loading: searchLoading,
    error: searchError,
  } = useSearch(searchTerm);

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearchTerm(query);
  };

  const clearSearch = () => {
    setQuery("");
    setSearchTerm("");
  };

  const isSearching = searchTerm.length > 0;

  return (
    <div className="container-fluid mt-4 dashboard">
      {/* 🔍 Search */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Search product..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        <button onClick={handleSearch}>Search</button>

        {isSearching && (
          <button
            onClick={clearSearch}
            style={{ background: "red", color: "white" }}
          >
            Clear
          </button>
        )}
      </div>

      <div className="row">
        {/* Sidebar */}
        <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar p-3 min-vh-100">
          <div className="text-center mb-4">
            <span className="navbar-brand fw-bold">My App</span>
          </div>

          <ul className="nav flex-column">
            {[
              { to: "/", label: "Home", icon: "fa-home" },
              { to: "/create", label: "Create", icon: "fa-plus" },
              { to: "/booking", label: "Booking", icon: "fa-tachometer-alt" },
              { to: "/cart", label: "Cart", icon: "fa-shopping-cart" },
              { to: "/products", label: "Products", icon: "fa-box" },
              { to: "/profile", label: "Profile", icon: "fa-user" },
              { to: "/settings", label: "Settings", icon: "fa-cog" },
            ].map((link) => (
              <li className="nav-item" key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active fw-bold" : ""}`
                  }
                >
                  <i className={`fas ${link.icon} me-2`}></i>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content */}
        <main className="col-md-9 col-lg-10 p-4">
          <h1>Dashboard</h1>

          {/* 🔎 SEARCH MODE */}
          {isSearching ? (
            <>
              {searchLoading && <p>Searching...</p>}
              {searchError && <p className="text-danger">{searchError}</p>}

              {searchedProduct ? (
                <div className="card mb-3">
                  <div className="card-body">
                    <h5>{searchedProduct.productName}</h5>
                    <h6>{searchedProduct.productPrice}</h6>
                    <p>{searchedProduct.description}</p>
                  </div>
                </div>
              ) : (
                !searchLoading && <p>No product found</p>
              )}
            </>
          ) : (
            /* 📦 DEFAULT PRODUCT LIST */
            <>
              {loading && <p>Loading products...</p>}
              {error && <p className="text-danger">{error}</p>}

              {!loading && products?.length > 0
                ? products.map((item) => (
                    <div key={item._id} className="card mb-3">
                      <div className="card-body">
                        <h5>{item?.productName || "No Name"}</h5>
                        <h6>{item?.productPrice}</h6>
                        <p>{item?.description || "No description"}</p>
                      </div>
                    </div>
                  ))
                : !loading && <p>No products available.</p>}
            </>
          )}

          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
