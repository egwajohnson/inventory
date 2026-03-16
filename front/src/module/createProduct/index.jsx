import React, { useState, useRef } from "react";
import createProduct from "../product/createProducts";

function Create() {
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

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Product image is required");
      return;
    }

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

      if (response?.success) {
        alert("Product created successfully");

        setProductName("");
        setProductPrice("");
        setQuantity("");
        setDescription("");
        setCategory("");
        setImage(null);
        setPreview("");

        if (fileRef.current) {
          fileRef.current.value = "";
        }
      } else {
        alert(response?.error || "Failed to create product");
      }
    } catch (error) {
      console.error(error);
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
                min="0"
                onChange={(e) => setProductPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                value={quantity}
                required
                min="0"
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
            <img
              src={preview}
              alt="preview"
              className="image-preview"
              style={{ width: "120px", marginTop: "10px" }}
            />
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Create;
