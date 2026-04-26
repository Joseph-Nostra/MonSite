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
    <div className="card h-100 shadow-sm border-0 product-card-premium position-relative" style={{ cursor: 'pointer' }} onClick={() => navigate(`/product/${product.id}`)}>
      
      {/* 🏷️ Badges */}
      <div className="position-absolute top-0 start-0 p-2 d-flex flex-column gap-1" style={{ zIndex: 10 }}>
        {product.badges?.map((badge, idx) => (
          <span key={idx} className={`badge bg-${badge.color} rounded-pill shadow-sm`}>{badge.label}</span>
        ))}
      </div>

      {/* ❤️ Wishlist Heart & Compare */}
      {(!user || user.role === "client") && (
        <div className="position-absolute top-0 end-0 m-2 d-flex flex-column gap-2" style={{ zIndex: 10 }}>
            <button 
                className={`btn-action border-0 shadow-sm ${isWishlisted ? 'active' : ''}`}
                onClick={toggleWishlist}
            >
                <i className={`bi bi-heart${isWishlisted ? '-fill text-danger' : ''}`}></i>
            </button>
            <button 
                className="btn-action border-0 shadow-sm"
                onClick={(e) => {
                    e.stopPropagation();
                    const current = JSON.parse(localStorage.getItem('compare_ids') || '[]');
                    if (current.includes(product.id)) {
                        const next = current.filter(id => id !== product.id);
                        localStorage.setItem('compare_ids', JSON.stringify(next));
                    } else {
                        if (current.length >= 4) return alert("Vous ne pouvez comparer que 4 produits maximum.");
                        localStorage.setItem('compare_ids', JSON.stringify([...current, product.id]));
                        window.dispatchEvent(new Event('compare-updated'));
                    }
                }}
                title={t('compare') || "Comparer"}
            >
                <i className="bi bi-arrow-left-right"></i>
            </button>
        </div>
      )}

      {/* 🖼️ Product Image with Overlay */}
      <div style={{ height: "200px", overflow: "hidden" }} className="position-relative product-image-container">
        <Link to={`/product/${product.id}`} className="w-100 h-100 d-block">
            <img 
              src={imageUrl} 
              className="card-img-top transition-transform duration-500" 
              alt={product.title} 
              style={{ height: "100%", width: "100%", objectFit: "cover" }}
            />
            <div className="product-overlay d-flex align-items-center justify-content-center">
                <span className="btn btn-light btn-sm rounded-pill fw-bold shadow-sm px-3 py-2 scale-hover">
                    Voir le produit
                </span>
            </div>
        </Link>
        {product.youtube_url && (
            <div className="position-absolute bottom-0 end-0 m-2 bg-danger text-white px-2 rounded-pill small d-flex align-items-center gap-1 shadow-sm" style={{ zIndex: 5 }}>
                <i className="bi bi-youtube"></i> Demo
            </div>
        )}
      </div>

      <div className="card-body d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-start mb-2">
            <Link to={`/product/${product.id}`} className="text-decoration-none text-dark flex-grow-1 overflow-hidden">
                <h6 className="card-title text-truncate m-0 fw-bold hover-text-primary transition-all">{product.title}</h6>
            </Link>
        </div>

        {/* ⭐ Stars */}
        <div className="d-flex align-items-center gap-1 mb-2" style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}#reviews-section`); }}>
            {[1,2,3,4,5].map(i => (
                <i key={i} className={`bi bi-star${i <= Math.round(product.average_rating || 0) ? '-fill text-warning' : ''} small`}></i>
            ))}
            <span className="text-muted" style={{ fontSize: '10.5px' }}>({product.reviews_count || 0})</span>
        </div>

        {product.user && (
          <p className="mb-3" style={{ fontSize: '11.5px' }}>
            <span className="text-muted">Par </span>
            <Link to={`/products?seller_id=${product.user_id}`} className="fw-bold text-decoration-none text-secondary" onClick={(e) => e.stopPropagation()}>
              {product.user.name}
            </Link>
          </p>
        )}
        
        <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
            <span className="fw-bold fs-5 text-primary m-0">${product.price}</span>
            <div className="d-flex gap-2">
                {(!user || user.role === "client") ? (
                    <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="btn btn-primary rounded-circle p-0 d-flex align-items-center justify-content-center shadow-md" 
                        onClick={(e) => { e.stopPropagation(); onAddToCart && onAddToCart(product); }} 
                        style={{ width: '40px', height: '40px' }}
                    >
                        <i className="bi bi-cart-plus fs-5"></i>
                    </motion.button>
                ) : (
                    (user?.role === "admin" || user.id === product.user_id) && (
                        <button className="btn btn-action shadow-none border-0 bg-light-warning" onClick={(e) => { e.stopPropagation(); handleEdit(product.id); }}>
                            <i className="bi bi-pencil-square text-warning"></i>
                        </button>
                    )
                )}
            </div>
        </div>
      </div>
      <style>{`
        .product-card-premium { 
            transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); 
            border-radius: 20px !important; 
            overflow: hidden;
            background: #fff;
        }
        .product-card-premium:hover { 
            transform: translateY(-8px); 
            box-shadow: 0 15px 45px rgba(0,0,0,0.08) !important; 
        }
        
        .product-image-container .product-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.2);
            opacity: 0;
            transition: all 0.3s ease;
            backdrop-filter: blur(2px);
        }
        
        .product-card-premium:hover .product-overlay {
            opacity: 1;
        }
        
        .product-card-premium:hover .card-img-top {
            transform: scale(1.1);
        }
        
        .btn-action { 
            background: rgba(255,255,255,0.9); 
            border-radius: 50%; 
            width: 36px; 
            height: 36px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            transition: all 0.2s; 
        }
        .btn-action:hover { transform: translateY(-2px); background: #fff; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .btn-action.active { background: #fff; }
        
        .hover-text-primary:hover { color: var(--bs-primary) !important; }
        .scale-hover { transition: transform 0.2s; }
        .product-card-premium:hover .scale-hover { transform: scale(1.05); }
        .bg-light-warning { background: #fffbeb !important; }
        .shadow-md { box-shadow: 0 4px 10px rgba(13, 110, 253, 0.2) !important; }
      `}</style>
    </div>
  );
}

export default ProductCard;