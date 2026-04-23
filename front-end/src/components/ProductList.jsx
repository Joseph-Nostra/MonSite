import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import api from "../axios";
import LoadingSpinner from "./Common/LoadingSpinner";
import useDocTitle from "../hooks/useDocTitle";

function ProductList({ onAddToCart , user , handleEdit , handleDelete, isFullWidth = false}) {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryLabel = searchParams.get("q") || searchParams.get("usage") || searchParams.get("brand") || (searchParams.get("promo") ? "Promotions" : "");
  
  useDocTitle(queryLabel || "Nos Produits");
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products${location.search}`);
        if (res.data.data) {
            setProducts(res.data.data);
            setPagination(res.data);
        } else {
            setProducts(res.data);
            setPagination(null);
        }
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Erreur chargement produits");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [location.search]);

  const handlePageChange = (url) => {
    if (!url) return;
    const urlObj = new URL(url);
    const page = urlObj.searchParams.get('page');
    
    const params = new URLSearchParams(location.search);
    params.set('page', page);
    
    window.scrollTo(0, 0);
    navigate(`/products?${params.toString()}`);
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-50">
      <LoadingSpinner size="lg" />
    </div>
  );
  if (error) return <p className="mt-5 text-center text-danger">{error}</p>;

  return (
    <div className="container-fluid px-2 overflow-hidden">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 mt-4 gap-3">
        <div className="d-flex align-items-center gap-3">
            <h4 className="fw-bold m-0 text-dark">
                {queryLabel ? `🔍 "${queryLabel}"` : "Nos Produits"}
            </h4>
            <span className="badge bg-light text-dark border p-2 px-3 rounded-pill d-none d-sm-inline-block" style={{ fontSize: '14px' }}>
                {pagination ? pagination.total : products.length} produits
            </span>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-2">
            {/* Sorting */}
            <select 
                className="form-select form-select-sm rounded-pill px-3 py-2 border-0 shadow-sm"
                style={{ width: 'auto', backgroundColor: '#f8fafc' }}
                value={searchParams.get('sort_by') || 'latest'}
                onChange={(e) => {
                    const params = new URLSearchParams(location.search);
                    params.set('sort_by', e.target.value);
                    navigate(`/products?${params.toString()}`);
                }}
            >
                <option value="latest">Nouveautés</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="rating_desc">Mieux notés</option>
            </select>

            {/* Rating Filter */}
            <select 
                className="form-select form-select-sm rounded-pill px-3 py-2 border-0 shadow-sm"
                style={{ width: 'auto', backgroundColor: '#f8fafc' }}
                value={searchParams.get('rating') || ''}
                onChange={(e) => {
                    const params = new URLSearchParams(location.search);
                    if (e.target.value) params.set('rating', e.target.value);
                    else params.delete('rating');
                    navigate(`/products?${params.toString()}`);
                }}
            >
                <option value="">Toutes les notes</option>
                <option value="4">4+ étoiles</option>
                <option value="3">3+ étoiles</option>
                <option value="2">2+ étoiles</option>
            </select>

            {location.search && !location.search.startsWith('?page') && (
                <button 
                  onClick={() => navigate('/products')}
                  className="btn btn-sm btn-outline-danger rounded-pill px-3"
                >
                  <i className="bi bi-x-circle me-1"></i> Effacer
                </button>
            )}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-5 bg-white border border-dashed rounded-4 shadow-sm" style={{ borderStyle: 'dashed !important' }}>
            <h5 className="text-muted mb-0">Aucun produit ne correspond à votre recherche.</h5>
            <p className="small text-secondary mt-2">Essayez d'autres termes ou effacez les filtres.</p>
        </div>
      ) : (
        <>
            <div className="custom-product-grid">
                <style>{`
                    .custom-product-grid {
                        display: grid;
                        gap: 20px;
                        grid-template-columns: repeat(1, 1fr);
                        width: 100%;
                    }
                    @media (min-width: 576px) { .custom-product-grid { grid-template-columns: repeat(2, 1fr); } }
                    @media (min-width: 768px) { .custom-product-grid { grid-template-columns: repeat(3, 1fr); } }
                    @media (min-width: 992px) { .custom-product-grid { grid-template-columns: repeat(${isFullWidth ? 4 : 3}, 1fr); } }
                    @media (min-width: 1200px) { .custom-product-grid { grid-template-columns: repeat(${isFullWidth ? 5 : 4}, 1fr); } }
                    @media (min-width: 1400px) { .custom-product-grid { grid-template-columns: repeat(${isFullWidth ? 7 : 5}, 1fr); } }
                    
                    .product-grid-item {
                        min-width: 0; /* important for grid items with text-truncate */
                    }
                `}</style>
            {products.map((product) => (
                <div className="product-grid-item" key={product.id}>
                    <ProductCard product={product} onAddToCart={onAddToCart} user={user} handleEdit={handleEdit} handleDelete={handleDelete}/>
                </div>
            ))}
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.last_page > 1 && (
                <nav className="mt-5 mb-4 d-flex justify-content-center">
                    <ul className="pagination mb-0">
                        {pagination.links.map((link, idx) => (
                            <li key={idx} className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link rounded-pill mx-1 border-0 shadow-sm"
                                    onClick={() => handlePageChange(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </>
      )}
    </div>
  );
}

export default ProductList;