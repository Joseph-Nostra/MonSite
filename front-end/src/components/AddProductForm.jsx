// src/components/AddProductForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";

export default function AddProductForm({ user }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null); // fichier image
  const [stock, setStock] = useState("");
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    if   (!user || (user.role !== "vendeur" && user.role !== "admin")) {
      alert("Accès refusé !");
      return;
    }

    try {

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      if (image) formData.append("image", image);

      const res = await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/products");
      alert(res.data.message);
      setTitle("");
      setDescription("");
      setPrice("");
      setStock("");
      setImage(null);
    } catch (err) {
      console.error("Erreur création produit:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Erreur lors de la création du produit");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-50 mx-auto mt-5">
      <h3>Ajouter un produit</h3>
      <input
        type="text"
        placeholder="Titre"
        className="form-control my-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        className="form-control my-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Prix"
        className="form-control my-2"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Stock"
        className="form-control my-2"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        required
        />
      <input
        type="file"
        className="form-control my-2"
        onChange={(e) => setImage(e.target.files[0])}
        accept="image/*"
      />
      <button className="btn btn-success w-100 mt-2">Ajouter le produit</button>
    </form>
  );
}