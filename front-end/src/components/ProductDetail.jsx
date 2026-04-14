// src/components/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axios"; // Import Axios configuré

function ProductDetail({ onAddToCart, user }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`); // Axios
        setProduct(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Erreur lors du chargement du produit");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!product) return <p>Produit introuvable</p>;

  const imageUrl = product.image
  ? `http://127.0.0.1:8000/storage/${product.image}`
  : "https://via.placeholder.com/150";

  return (
    <div className="card mx-auto mt-5" style={{ maxWidth: "600px" }}>
      <img
        src={imageUrl}
        className="card-img-top"
        alt={product.title}
        style={{ objectFit: "contain", maxHeight: "300px" }}
      />

      <div className="card-body">
        <h3 className="card-title">{product.title}</h3>
        <p className="card-text">{product.description}</p>
        <p className="card-text fw-bold">${product.price}</p>
        <div className="d-flex justify-content-between">
          <button
            className="btn btn-success"
            onClick={() => {
              onAddToCart(product);
              alert("Produit ajouté au panier !");
            }}
          >
            Ajouter au panier
          </button>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            Retour
          </button>
        </div>
        
        {user && user.id !== product.user_id && (
          <div className="mt-3">
            <button 
              className="btn btn-outline-dark w-100"
              onClick={() => navigate(`/chat/${product.user_id}`)}
            >
              💬 Contacter le vendeur
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;