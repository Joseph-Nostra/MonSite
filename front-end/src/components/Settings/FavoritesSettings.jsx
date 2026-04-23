import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Trash2, ShoppingCart, ExternalLink, Package } from "lucide-react";
import api from "../../axios";
import { useTranslation } from "react-i18next";

const FavoritesSettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const res = await api.get("/wishlist");
      setFavorites(res.data);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const removeFromWishlist = async (productId) => {
    try {
      await api.post("/wishlist/toggle", { product_id: productId });
      setFavorites(favorites.filter(item => item.product_id !== productId));
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="favorites-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0 d-flex align-items-center gap-2">
            <Heart className="text-danger" fill="currentColor" /> {t('favorites')}
        </h3>
        <span className="badge bg-light text-dark border rounded-pill px-3 py-2">
            {favorites.length} {favorites.length > 1 ? t('products') : t('product')}
        </span>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4 border-2 border-dashed border-secondary border-opacity-25">
            <div className="bg-white p-4 rounded-circle shadow-sm d-inline-flex mb-3">
                <Heart size={48} className="text-muted opacity-25" />
            </div>
            <h5 className="fw-bold text-dark mb-2">{t('empty_wishlist_title')}</h5>
            <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '300px' }}>
                {t('empty_wishlist_desc')}
            </p>
            <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" onClick={() => navigate('/products')}>
                {t('shop_now')}
            </button>
        </div>
      ) : (
        <div className="row g-4">
          {favorites.map((item) => {
            const product = item.product;
            if (!product) return null;
            return (
              <div key={item.id} className="col-md-6 col-xl-4">
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative product-fav-card">
                   <div className="position-absolute top-0 end-0 m-2" style={{ zIndex: 10 }}>
                        <button 
                            className="btn btn-white btn-sm rounded-circle shadow-sm p-2 bg-white" 
                            onClick={() => removeFromWishlist(product.id)}
                            title="Retirer des favoris"
                        >
                            <Trash2 size={16} className="text-danger" />
                        </button>
                   </div>

                   <div className="fav-image-container" style={{ height: '180px', overflow: 'hidden' }}>
                        <img 
                            src={product.image ? `http://127.0.0.1:8000/storage/${product.image}` : "https://via.placeholder.com/200"} 
                            alt={product.title}
                            className="w-100 h-100 object-fit-cover transition-all"
                        />
                   </div>

                   <div className="card-body p-3 d-flex flex-column">
                        <div className="mb-2">
                            <span className="badge bg-primary bg-opacity-10 text-primary small rounded-pill px-2 mb-1" style={{ fontSize: '10px' }}>
                                {product.category || 'Électronique'}
                            </span>
                            <h6 className="fw-bold mb-1 text-truncate" title={product.title}>{product.title}</h6>
                            <p className="text-muted small mb-0 line-clamp-1" style={{ fontSize: '12px' }}>{product.description}</p>
                        </div>

                        <div className="mt-auto d-flex justify-content-between align-items-center pt-2">
                            <span className="fw-bold text-primary fs-5">${product.price}</span>
                            <div className="d-flex gap-2">
                                <button 
                                    className="btn btn-light btn-sm rounded-circle p-2 shadow-sm" 
                                    onClick={() => navigate(`/product/${product.id}`)}
                                    title="Voir le produit"
                                >
                                    <ExternalLink size={16} />
                                </button>
                                <button 
                                    className="btn btn-primary btn-sm rounded-circle p-2 shadow-sm"
                                    onClick={() => navigate(`/product/${product.id}`)}
                                >
                                    <ShoppingCart size={16} />
                                </button>
                            </div>
                        </div>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .product-fav-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .product-fav-card:hover { transform: translateY(-5px); shadow: 0 10px 25px rgba(0,0,0,0.1) !important; }
        .product-fav-card:hover .fav-image-container img { transform: scale(1.05); }
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .min-vh-50 { min-height: 50vh; }
      `}</style>
    </div>
  );
};

export default FavoritesSettings;
