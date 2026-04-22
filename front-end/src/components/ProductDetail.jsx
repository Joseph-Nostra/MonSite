import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../axios";
import useDocTitle from "../hooks/useDocTitle";

function ProductDetail({ onAddToCart, user }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useDocTitle(product ? product.title : "Chargement...");

  const fetchData = async () => {
    try {
      const [prodRes, revRes] = await Promise.all([
        api.get(`/products/${id}`),
        api.get(`/products/${id}/reviews`)
      ]);
      setProduct(prodRes.data);
      setReviews(revRes.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return alert("Veuillez donner une note !");
    setSubmitting(true);
    try {
      await api.post("/reviews", {
        product_id: id,
        rating: rating,
        comment: comment
      });
      setComment("");
      setRating(0);
      fetchData(); // Reload to show new review and update avg rating
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de l'envoi de l'avis");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border"></div></div>;
  if (error) return <div className="container mt-5 text-center text-danger">{error}</div>;
  if (!product) return <div className="container mt-5 text-center">Produit introuvable</div>;

  const imageUrl = product.image
  ? `http://127.0.0.1:8000/storage/${product.image}`
  : "https://via.placeholder.com/150";

  return (
    <div className="container mt-5 pb-5">
      <div className="row g-4 justify-content-center">
        {/* L'IMAGE */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '20px' }}>
             <img src={imageUrl} className="w-100 object-fit-cover" alt={product.title} style={{ height: "450px" }} />
          </div>
        </div>

        {/* LES INFOS */}
        <div className="col-lg-5">
          <div className="ps-lg-4">
            <h2 className="fw-bold mb-3">{product.title}</h2>
            
            <div className="d-flex align-items-center gap-2 mb-3">
                <div className="d-flex text-warning">
                    {[1,2,3,4,5].map(i => (
                        <i key={i} className={`bi bi-star${i <= Math.round(product.average_rating) ? '-fill' : ''}`}></i>
                    ))}
                </div>
                <span className="text-muted small">({reviews.length} avis)</span>
            </div>

            <h3 className="text-primary fw-bold mb-4">${product.price}</h3>
            
            <p className="text-muted mb-4" style={{ lineHeight: '1.8' }}>{product.description}</p>

            {product.user && (
              <div className="p-3 bg-light rounded-4 mb-4 border d-flex align-items-center justify-content-between">
                <div>
                    <p className="mb-0 small text-muted">Vendu par</p>
                    <p className="mb-0 fw-bold">{product.user.name}</p>
                </div>
                <Link to={`/products?seller_id=${product.user_id}`} className="btn btn-sm btn-outline-primary rounded-pill">Boutique</Link>
              </div>
            )}

            <div className="d-flex gap-3 mb-4">
              {(!user || user.role === "client") && (
                <button className="btn btn-primary px-5 py-3 rounded-pill fw-bold flex-fill" onClick={() => onAddToCart(product)}>
                  Ajouter au panier
                </button>
              )}
              <button className="btn btn-outline-secondary px-4 py-3 rounded-pill" onClick={() => navigate(-1)}>
                Retour
              </button>
            </div>

            {user && user.role === 'client' && (
               <button className="btn btn-outline-info w-100 py-2 rounded-pill fw-bold" onClick={() => navigate(`/chat/${product.user_id}`)}>
                  💬 Discuter avec le vendeur
               </button>
            )}
          </div>
        </div>

        {/* SECTION AVIS */}
        <div className="col-lg-10 mt-5 pt-5 border-top" id="reviews-section">
           <div className="row g-5">
              {/* LISTE DES AVIS */}
              <div className="col-md-7">
                 <h4 className="fw-bold mb-4">Avis clients</h4>
                 {reviews.length === 0 ? (
                    <p className="text-muted">Aucun avis pour le moment. Soyez le premier !</p>
                 ) : (
                    <div className="d-flex flex-column gap-4">
                        {reviews.map(review => (
                            <div key={review.id} className="border-bottom pb-4">
                               <div className="d-flex align-items-center gap-2 mb-2">
                                  <div className="text-warning small">
                                    {[1,2,3,4,5].map(i => <i key={i} className={`bi bi-star${i <= review.rating ? '-fill' : ''}`}></i>)}
                                  </div>
                                  <span className="fw-bold small">{review.user?.name}</span>
                               </div>
                               <p className="mb-0">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                 )}
              </div>

              {/* FORMULAIRE D'AVIS */}
              {user && user.role === 'client' && (
                <div className="col-md-5">
                   <div className="bg-light p-4 rounded-4 border">
                      <h5 className="fw-bold mb-3">Laisser un avis</h5>
                      <form onSubmit={handleReviewSubmit}>
                         <div className="mb-3">
                            <label className="form-label d-block text-muted small">Votre note</label>
                            <div className="d-flex gap-2 fs-4 rating-stars">
                               {[1,2,3,4,5].map(i => (
                                  <i 
                                    key={i} 
                                    className={`bi bi-star${(hover || rating) >= i ? '-fill' : ''} cursor-pointer text-warning`}
                                    onMouseEnter={() => setHover(i)}
                                    onMouseLeave={() => setHover(0)}
                                    onClick={() => setRating(i)}
                                    style={{ cursor: 'pointer' }}
                                  ></i>
                               ))}
                            </div>
                         </div>
                         <div className="mb-4">
                            <label className="form-label text-muted small">Ce que vous en pensez</label>
                            <textarea 
                                className="form-control border-0 bg-white" 
                                rows="3" 
                                placeholder="Excellent produit..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                         </div>
                         <button className="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow-sm" disabled={submitting}>
                            {submitting ? 'Envoi...' : 'Publier mon avis'}
                         </button>
                      </form>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;