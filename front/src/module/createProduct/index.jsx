import React, { useState } from "react";
import createProduct from "../product/createProducts";

function Product() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", Number(price));
    formData.append("description", description);
    formData.append("category", category);
    formData.append("image", image);

    try {
      setLoading(true);

      await createProduct(formData);

      alert("Product created successfully");

      setName("");
      setPrice("");
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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        required
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        required
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        type="text"
        placeholder="Description"
        value={description}
        required
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="text"
        placeholder="Category"
        value={category}
        required
        onChange={(e) => setCategory(e.target.value)}
      />

      <input type="file" accept="image/*" onChange={handleImageChange} />

      {preview && (
        <img
          src={preview}
          alt="preview"
          style={{ width: "120px", marginTop: "10px", borderRadius: "6px" }}
        />
      )}

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Product"}
      </button>
    </form>
  );
}

export default Product;
