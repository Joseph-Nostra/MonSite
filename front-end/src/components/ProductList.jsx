import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import api from "../axios";

function ProductList({ onAddToCart , user , handleEdit , handleDelete}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products"); // ✔ corrigé
        setProducts(res.data);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Erreur lors du chargement des produits"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
    return <p className="mt-5 text-center">Chargement des produits...</p>;

  if (error)
    return <p className="mt-5 text-center text-danger">{error}</p>;

  if (products.length === 0)
    return (
      <p className="mt-5 text-center text-muted">
        Aucun produit disponible
      </p>
    );

  return (
    <div className="row row-cols-1 row-cols-md-5 g-3 mt-5">
      {products.map((product) => (
        <div className="col" key={product.id}>
          <ProductCard product={product} onAddToCart={onAddToCart} user={user} handleEdit={handleEdit} handleDelete={handleDelete}/>
        </div>
      ))}
    </div>
  );
}

export default ProductList;