import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import addToCart from "../../Layout/components/addToCart/addCart";

function Products() {
  const product_url = "http://localhost:5000/api/v1/products/list";

  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loadingId, setLoadingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const getProducts = async () => {
    try {
      const res = await axios.get(product_url);
      setProducts(res.data.products || []);
    } catch (error) {
      console.error(error);
    }
  };

  const getCartCount = async () => {
    const token = localStorage.getItem("token");
    const cartId = localStorage.getItem("cartId");
    if (!token || !cartId) return;

    try {
      const res = await axios.get("http://localhost:5000/api/v1/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartCount(res.data.items.length || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getProducts();
    getCartCount();
  }, []);

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("token");
    const cartId = localStorage.getItem("cartId");

    if (!token || !cartId) {
      alert("You must login to add to cart");
      return;
    }
    setLoadingId(productId);

    try {
      const result = await addToCart(productId);

      const totalQty = result.items.reduce(
        (acc, item) => acc + item.quantity,
        0,
      );

      setCartCount(totalQty);
      await getProducts();
    } catch (err) {
      console.error("Add to cart failed", err);
    } finally {
      setLoadingId(null);
    }
  };

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);

  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const startProduct = indexOfFirst + 1;
  const endProduct = Math.min(indexOfLast, totalProducts);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="products-wrapper">
      <div className="carts-container">
        <div className="floating-cart">
          <Link to="/cart" className="link">
            🛒 {cartCount}
          </Link>
        </div>
        {currentProducts.map((product) => (
          <div className="product-card" key={product._id}>
            <img
              src={
                product.image
                  ? `http://localhost:5000/api/v1/uploads/images/${product.image}`
                  : "/no-image.png"
              }
              alt={product.productName}
              width="200"
            />

            <h3>{product.productName}</h3>

            <p className="price">Price: ₦{product.productPrice}</p>

            <p>Category: {product.category}</p>

            <p>Stock: {product.quantity}</p>

            <button
              className="cart-btn"
              disabled={loadingId === product._id}
              onClick={() => handleAddToCart(product._id)}
            >
              {loadingId === product._id ? "Adding..." : "Add To Cart"}
            </button>
          </div>
        ))}
      </div>

      <div className="prev">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>

        <span className="span">
          Page {currentPage} of {totalPages}
        </span>

        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
      <div className="show">
        Showing {startProduct} - {endProduct} of {totalProducts} products
      </div>
    </div>
  );
}

export default Products;
