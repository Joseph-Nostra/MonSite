import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "./ProductCard";
import api from "../axios";

function ProductList({ onAddToCart , user , handleEdit , handleDelete}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products${location.search}`);
        setProducts(res.data);
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

  const searchParams = new URLSearchParams(location.search);
  const queryLabel = searchParams.get("q") || searchParams.get("usage") || searchParams.get("brand") || (searchParams.get("promo") ? "Promotions" : "");

  if (loading) return <div className="text-center py-5 mt-5"><div className="spinner-border text-primary"></div></div>;
  if (error) return <p className="mt-5 text-center text-danger">{error}</p>;

  return (
    <div className="container-fluid px-4">
      <div className="d-flex justify-content-between align-items-center mb-4 mt-4">
        <h4 className="fw-bold m-0 text-dark">
            {queryLabel ? `🔍 Résultats pour "${queryLabel}"` : "🛍️ Nos Produits"}
        </h4>
        <div className="d-flex align-items-center gap-3">
            {location.search && <Link to="/products" className="btn btn-sm btn-outline-secondary rounded-pill">Effacer les filtres</Link>}
            <span className="badge bg-light text-dark border p-2 px-3 rounded-pill" style={{ fontSize: '14px' }}>{products.length} produits</span>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-5 bg-white border border-dashed rounded-4 shadow-sm" style={{ borderStyle: 'dashed !important' }}>
            <h5 className="text-muted mb-0">Aucun produit ne correspond à votre recherche.</h5>
            <p className="small text-secondary mt-2">Essayez d'autres termes ou effacez les filtres.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
          {products.map((product) => (
            <div className="col" key={product.id}>
              <ProductCard product={product} onAddToCart={onAddToCart} user={user} handleEdit={handleEdit} handleDelete={handleDelete}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;