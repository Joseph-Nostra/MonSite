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
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Erreur chargement produits");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const searchParams = new URLSearchParams(location.search);
  const search = searchParams.get("search")?.toLowerCase() || "";

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(search) || 
    p.description?.toLowerCase().includes(search)
  );

  if (loading) return <div className="text-center py-5 mt-5"><div className="spinner-border text-primary"></div></div>;
  if (error) return <p className="mt-5 text-center text-danger">{error}</p>;

  return (
    <div className="container-fluid px-4">
      <div className="d-flex justify-content-between align-items-center mb-4 mt-4">
        <h4 className="fw-bold m-0">
            {search ? `🔍 Résultats pour "${search}"` : "🛍️ Nos Produits"}
        </h4>
        <span className="badge bg-light text-dark border">{filteredProducts.length} produits</span>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4">
            <p className="text-muted">Aucun produit ne correspond à votre recherche.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
          {filteredProducts.map((product) => (
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