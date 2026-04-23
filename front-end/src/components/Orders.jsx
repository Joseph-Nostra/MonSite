import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios"; 
import LoadingSpinner from "./Common/LoadingSpinner";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur récupération commandes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div className="container mt-5 pt-5 text-center"><LoadingSpinner size="lg" /></div>;
  if (error) return <div className="text-danger text-center mt-5 py-5">{error}</div>;

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-bold m-0">📦 Mes Commandes</h2>
        <button
          className="btn btn-outline-dark rounded-pill px-4"
          onClick={() => navigate("/products")}
        >
          Continuer mes achats
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4">
          <i className="bi bi-bag-x display-1 text-muted"></i>
          <h4 className="mt-4 text-muted">Vous n'avez pas encore passé de commande.</h4>
          <button className="btn btn-primary mt-3 rounded-pill px-5" onClick={() => navigate("/products")}>
            Découvrir nos produits
          </button>
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order.id} className="col-12 mb-4">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden order-card-premium">
                <div className="card-header bg-white p-4 border-0 d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted small">COMMANDE</span>
                    <h6 className="mb-0 fw-bold">#ORD-{order.id}</h6>
                  </div>
                  <div>
                    <span className="text-muted small">DATE</span>
                    <h6 className="mb-0 fw-bold">{new Date(order.created_at).toLocaleDateString()}</h6>
                  </div>
                  <div>
                    <span className="text-muted small">TOTAL</span>
                    <h6 className="mb-0 fw-bold text-primary">${Number(order.total).toFixed(2)}</h6>
                  </div>
                  <div className={`badge rounded-pill p-2 px-3 ${order.status === 'paid' ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning'}`}>
                    {order.status.toUpperCase()}
                  </div>
                  <button 
                    className="btn btn-dark rounded-pill px-4"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    Voir Détails
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`
        .bg-success-soft { background: rgba(25, 135, 84, 0.1); }
        .bg-warning-soft { background: rgba(255, 193, 7, 0.1); }
        .order-card-premium { transition: all 0.3s; }
        .order-card-premium:hover { transform: scale(1.01); box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important; }
      `}</style>
    </div>
  );
}