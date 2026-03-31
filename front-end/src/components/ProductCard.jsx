import React from "react";
import { useNavigate } from "react-router-dom";

function ProductCard({ product, onAddToCart, user, handleEdit, handleDelete }) {
  const navigate = useNavigate();

  const imageUrl = product.image
    ? `http://127.0.0.1:8000/storage/${product.image.replace("storage/", "")}`
    : "https://via.placeholder.com/150";

  const handleAdd = () => {
    onAddToCart(product, navigate);
  };

  return (
    <div className="card h-100">
      <img src={imageUrl} className="card-img-top" alt={product.title} />

      <div className="card-body d-flex flex-column">
        <h5>{product.title}</h5>
        <p>{product.description}</p>
        <p>${product.price}</p>

        <div className="mt-auto d-flex justify-content-between">

          {/* CLIENT */}
          {user?.role === "client" && (
            <>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                Détails
              </button>

              <button
                className="btn btn-success btn-sm"
                onClick={handleAdd}
              >
                Ajouter
              </button>
            </>
          )}

          {/* VENDEUR / ADMIN */}
          {(user?.role === "vendeur" || user?.role === "admin") && (
            <>
              <button
                className="btn btn-warning btn-sm"
                onClick={() => handleEdit(product.id)}
              >
                Modifier
              </button>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(product.id)}
              >
                Supprimer
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default ProductCard;