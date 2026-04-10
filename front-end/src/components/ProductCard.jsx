import React from "react";
import { useNavigate } from "react-router-dom";

function ProductCard({ product, onAddToCart, user, handleEdit, handleDelete }) {
  const navigate = useNavigate();

  const imageUrl = product.image
  ? `http://127.0.0.1:8000/storage/${product.image}`
  : "https://via.placeholder.com/150";

  return (
    <div className="card h-100 shadow-sm border-0">
      <div style={{ height: "200px", overflow: "hidden" }}>
        <img 
          src={imageUrl} 
          className="card-img-top" 
          alt={product.title} 
          style={{ height: "100%", width: "100%", objectFit: "cover" }}
        />
      </div>

      <div className="card-body d-flex flex-column p-3">
        <h5 className="card-title text-truncate">{product.title}</h5>
        <p className="card-text text-muted small" style={{ height: "3em", overflow: "hidden" }}>{product.description}</p>
        <p className="fw-bold fs-5 text-primary mb-3">${product.price}</p>

        <div className="mt-auto d-flex flex-wrap gap-2 justify-content-between">

          {/* EVERYONE SEES DETAILS */}
          <button
            className="btn btn-outline-primary btn-sm flex-fill"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            Voir Détails
          </button>

          {/* CLIENT SEES ADD TO CART */}
          {(!user || user.role === "client") && (
            <button
              className="btn btn-success btn-sm flex-fill"
              onClick={handleAdd}
            >
              Ajouter
            </button>
          )}

          {/* OWNER OR ADMIN SEES EDIT/DELETE */}
          {(user?.role === "admin" || (user?.role === "vendeur" && user.id === product.user_id)) && (
            <>
              <button
                className="btn btn-warning btn-sm flex-fill"
                onClick={() => handleEdit(product.id)}
              >
                Modifier
              </button>

              <button
                className="btn btn-danger btn-sm flex-fill"
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