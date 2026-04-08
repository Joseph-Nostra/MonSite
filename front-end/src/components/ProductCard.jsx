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