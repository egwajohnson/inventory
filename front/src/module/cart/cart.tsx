import React, { useState, useEffect } from "react";

function Cart() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User not authenticated");
        }
        const response = await fetch("http://localhost:5000/api/v1/cart", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }
        const data = await response.json();
        if(data.user?.role !== "admin" && data.user?.role !== "customer"){
          throw new Error("Only Admin or Customer can view cart");
        }
        setCartItems(data.items || []);
        setTotalPrice(data.totalPrice || 0);
        setCouponDiscount(data.couponCode?.discount || 0);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []); // empty dependency → runs once on mount

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  const finalPrice = totalPrice - couponDiscount;

   const printReceipt = () => {
    const printContent = document.getElementById("receipt");
    if (printContent) {
      const newWin = window.open("", "Print-Window");
      if (newWin) {
        newWin.document.open();
        newWin.document.write(`
          <html>
            <head>
              <title>Cart Receipt</title>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        newWin.document.close();
        newWin.print();
      }
    }
    };
  return (
    <div className="container">
      <div className="cart">
        <h1>Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
              <div id="receipt">
            <ul className="ul">
              {cartItems.map((item: any, index: number) => (
                <li key={index}>
                  {item.productId.productName} - {item.quantity} x $
                  {item.productId.productPrice} = $
                  {item.quantity * item.productId.productPrice}
                </li>
              ))}
            </ul>
            <hr />
            <p>
              <strong>Subtotal:</strong> ${totalPrice}
            </p>
            <p>
              <strong>Coupon Discount:</strong> -${couponDiscount}
            </p>
            <p>
              <strong>Total:</strong> ${finalPrice}
            </p>
            <div/>
            </div>
            <button onClick={printReceipt}>Print Receipt</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
