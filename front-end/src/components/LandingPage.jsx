import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useDocTitle from "../hooks/useDocTitle";

export default function LandingPage({ user }) {
  useDocTitle("Accueil");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/products");
    }
  }, [user, navigate]);

  return (
    <div className="landing-page">

      {/* Hero Section */}
      <div 
        className="hero-section d-flex align-items-center justify-content-center text-center text-white"
        style={{
          background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "80vh",
          borderRadius: "0 0 50px 50px"
        }}
      >
        <div className="container">
          <h1 className="display-2 fw-bold mb-4 animate__animated animate__fadeInDown">
            Bienvenue sur <span className="text-warning">MonSite</span>
          </h1>
          <p className="lead mb-5 fs-4 animate__animated animate__fadeInUp">
            Découvrez une collection unique de produits exceptionnels sélectionnés pour vous.
          </p>
          <button 
            className="btn btn-warning btn-lg px-5 py-3 fw-bold shadow-lg animate__animated animate__pulse animate__infinite"
            onClick={() => navigate("/products")}
          >
            Voir les produits
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-5 my-5">
        <div className="row text-center g-4">
          <div className="col-md-4">
            <div className="p-4 shadow-sm rounded bg-white h-100 transition-hover">
              <div className="fs-1 mb-3">🚚</div>
              <h3>Livraison Rapide</h3>
              <p className="text-muted">Recevez vos commandes en un temps record directement chez vous.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 shadow-sm rounded bg-white h-100 transition-hover">
              <div className="fs-1 mb-3">🛡️</div>
              <h3>Paiement Sécurisé</h3>
              <p className="text-muted">Vos transactions sont protégées par les meilleurs protocoles de sécurité.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 shadow-sm rounded bg-white h-100 transition-hover">
              <div className="fs-1 mb-3">⭐</div>
              <h3>Qualité Garantie</h3>
              <p className="text-muted">Nous ne proposons que des produits testés et approuvés par nos experts.</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .transition-hover {
          transition: transform 0.3s ease, shadow 0.3s ease;
        }
        .transition-hover:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </div>
  );
}
