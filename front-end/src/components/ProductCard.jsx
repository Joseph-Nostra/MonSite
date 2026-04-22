import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../axios";

function ProductCard({ product, onAddToCart, user, handleEdit, handleDelete }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isWishlisted, setIsWishlisted] = useState(false); // Should ideally come from prop or global state

  const imageUrl = product.image
  ? `http://127.0.0.1:8000/storage/${product.image}`
  : "https://via.placeholder.com/150";

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    if (!user) return navigate("/login");
    try {
      const res = await api.post("/wishlist/toggle", { product_id: product.id });
      setIsWishlisted(res.data.status === 'added');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card h-100 shadow-sm border-0 product-card-premium position-relative">
      
      {/* 🏷️ Badges */}
      <div className="position-absolute top-0 start-0 p-2 d-flex flex-column gap-1" style={{ zIndex: 10 }}>
        {product.badges?.map((badge, idx) => (
          <span key={idx} className={`badge bg-${badge.color} rounded-pill shadow-sm`}>{badge.label}</span>
        ))}
      </div>

      {/* ❤️ Wishlist Heart */}
      {(!user || user.role === "client") && (
        <button 
          className={`position-absolute top-0 end-0 m-2 btn-wishlist border-0 shadow-sm ${isWishlisted ? 'active' : ''}`}
          onClick={toggleWishlist}
          style={{ zIndex: 10 }}
        >
          <i className={`bi bi-heart${isWishlisted ? '-fill text-danger' : ''}`}></i>
        </button>
      )}

      <div style={{ height: "180px", overflow: "hidden" }} className="position-relative">
        <img 
          src={imageUrl} 
          className="card-img-top" 
          alt={product.title} 
          style={{ height: "100%", width: "100%", objectFit: "cover" }}
          onClick={() => navigate(`/product/${product.id}`)}
        />
        {product.youtube_url && (
            <div className="position-absolute bottom-0 end-0 m-2 bg-danger text-white px-2 rounded-pill small d-flex align-items-center gap-1">
                <i className="bi bi-youtube"></i> Demo
            </div>
        )}
      </div>

      <div className="card-body d-flex flex-column p-3">
        <div className="d-flex justify-content-between align-items-start mb-1">
            <h6 className="card-title text-truncate m-0 fw-bold">{product.title}</h6>
        </div>

        {/* ⭐ Stars */}
        <div className="d-flex align-items-center gap-1 mb-2" style={{ cursor: 'pointer' }} onClick={() => navigate(`/product/${product.id}#reviews-section`)}>
            {[1,2,3,4,5].map(i => (
                <i key={i} className={`bi bi-star${i <= Math.round(product.average_rating || 0) ? '-fill text-warning' : ''} small`}></i>
            ))}
            <span className="text-muted" style={{ fontSize: '10px' }}>({product.reviews_count || 0})</span>
        </div>

        {product.user && (
          <p className="mb-2" style={{ fontSize: '11px' }}>
            <span className="text-muted">Par </span>
            <Link to={`/products?seller_id=${product.user_id}`} className="fw-bold text-decoration-none">
              {product.user.name}
            </Link>
          </p>
        )}
        
        <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
            <span className="fw-bold fs-5 text-primary m-0">${product.price}</span>
            <div className="d-flex gap-1">
                {(!user || user.role === "client") ? (
                    <button className="btn btn-primary btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center" onClick={() => onAddToCart(product)} style={{ width: '34px', height: '34px' }}>
                        <i className="bi bi-cart-plus"></i>
                    </button>
                ) : (
                    (user?.role === "admin" || user.id === product.user_id) && (
                        <button className="btn btn-outline-warning btn-sm border-0" onClick={() => handleEdit(product.id)}>
                            <i className="bi bi-pencil-square"></i>
                        </button>
                    )
                )}
            </div>
        </div>
      </div>
      <style>{`
        .product-card-premium { transition: all 0.3s; border-radius: 12px !important; overflow: hidden; }
        .product-card-premium:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
        .btn-wishlist { background: rgba(255,255,255,0.9); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .btn-wishlist:hover { transform: scale(1.1); background: #fff; }
        .btn-wishlist.active { background: #fff; }
      `}</style>
    </div>
  );
}

export default ProductCard;