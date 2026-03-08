import React, { useState, useRef } from "react";
import createProduct from "../product/createProducts";

function Product() {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const fileRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productPrice", Number(productPrice));
    formData.append("quantity", Number(quantity));
    formData.append("description", description);
    formData.append("category", category);
    formData.append("image", image);

    try {
      setLoading(true);
      const response = await createProduct(formData);
      if (response.success) {
      }
      alert("Product created successfully");

      setName("");
      setPrice("");
      setQuantity("");
      setDescription("");
      setCategory("");
      setImage(null);
      setPreview("");
    } catch (error) {
      alert("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="product-container">
        <h2>Create Product</h2>

        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                value={productName}
                required
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                value={productPrice}
                required
                onChange={(e) => setProductPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                value={quantity}
                required
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                value={category}
                required
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group full">
            <label>Description</label>
            <textarea
              rows="4"
              value={description}
              required
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group full">
            <label>Product Image</label>
            <input
              type="file"
              ref={fileRef}
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {preview && (
            <img src={preview} alt="preview" className="image-preview" />
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Product;
