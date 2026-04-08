// src/components/AddProductForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../axios";

export default function AddProductForm({ user, isEdit = false }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null); // fichier image
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (isEdit && id) {
      const fetchProduct = async () => {
        try {
          const res = await api.get(`/products/${id}`);
          const p = res.data;
          setTitle(p.title);
          setDescription(p.description);
          setPrice(p.price);
          setStock(p.stock);
        } catch (err) {
          console.error("Erreur fetch product:", err);
          setMessage({ text: "Erreur lors de la récupération du produit", type: "danger" });
        }
      };
      fetchProduct();
    }
  }, [isEdit, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || (user.role !== "vendeur" && user.role !== "admin")) {
      setMessage({ text: "Accès refusé !", type: "danger" });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      if (image) formData.append("image", image);

      if (isEdit) {
        // Pour les fichiers avec PUT dans Laravel, on utilise souvent POST avec _method=PUT
        formData.append("_method", "PUT");
        await api.post(`/products/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setMessage({ text: isEdit ? "Produit mis à jour !" : "Produit créé !", type: "success" });
      setTimeout(() => navigate("/products"), 1500);

    } catch (err) {
      console.error("Erreur save product:", err.response?.data || err.message);
      setMessage({ text: err.response?.data?.message || "Erreur lors de l'enregistrement", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0 mx-auto" style={{ maxWidth: "600px" }}>
        <h3 className="mb-4 text-center">{isEdit ? "Modifier le produit" : "Ajouter un produit"}</h3>
        
        {message.text && (
          <div className={`alert alert-${message.type} py-2`} role="alert">
            {message.text}
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Titre du produit</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Prix (DH)</label>
            <input
              type="number"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Stock disponible</label>
            <input
              type="number"
              className="form-control"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Image du produit</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
          />
          {isEdit && <small className="text-muted">Laissez vide pour conserver l'image actuelle.</small>}
        </div>

        <button className="btn btn-dark w-100 py-2 fw-bold" disabled={loading}>
          {loading ? "Chargement..." : isEdit ? "Mettre à jour" : "Ajouter le produit"}
        </button>
      </form>
    </div>
  );
}