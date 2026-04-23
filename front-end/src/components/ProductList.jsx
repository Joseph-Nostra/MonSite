import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import api from "../axios";
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

  if (loading) return <div className="text-center py-5 mt-5"><div className="spinner-border text-primary"></div></div>;
  if (error) return <p className="mt-5 text-center text-danger">{error}</p>;

  return (
    <div className="container-fluid px-2 overflow-hidden">
      <div className="d-flex justify-content-between align-items-center mb-4 mt-4">
        <h4 className="fw-bold m-0 text-dark">
            {queryLabel ? `🔍 ${t('results_for')} "${queryLabel}"` : ""}
        </h4>
        <div className="d-flex align-items-center gap-3">
            {location.search && !location.search.startsWith('?page') && <Link to="/products" className="btn btn-sm btn-outline-secondary rounded-pill">Effacer les filtres</Link>}
            <span className="badge bg-light text-dark border p-2 px-3 rounded-pill" style={{ fontSize: '14px' }}>
                {pagination ? pagination.total : products.length} {t('products')}
            </span>
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