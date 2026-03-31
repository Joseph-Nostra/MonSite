// src/components/Orders.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios"; 

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders"); // Axios gère credentials automatiquement
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

  if (loading) return <div className="text-center mt-5">Chargement...</div>;
  if (error) return <div className="text-danger text-center mt-5">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="m-3">Mes commandes</h2>
      <button
        className="btn btn-primary mb-3"
        onClick={() => navigate("/products")}
      >
        Retour au shopping
      </button>

      {orders.length === 0 && (
        <div className="alert alert-info">Aucune commande passée.</div>
      )}

      {orders.map((order) => {
        const totalQuantity = order.items.reduce(
          (sum, item) => sum + Number(item.quantity),
          0
        );
        const totalPrice = order.items.reduce(
          (sum, item) => sum + Number(item.price) * Number(item.quantity),
          0
        );

        return (
          <div key={order.id} className="card mb-3 shadow-sm m-3">
            <div className="card-header">
              Commande #{order.id} - {new Date(order.created_at).toLocaleString()}
            </div>
            <ul className="list-group list-group-flush">
              {order.items.map((item) => (
                <li key={item.id} className="list-group-item d-flex align-items-center">
                  <img
                    src={`http://127.0.0.1:8000/storage/${item.image}`}
                    alt={item.title}
                    width="60"
                    className="me-3"
                  />
                  <div>
                    <div><strong>{item.title}</strong></div>
                    <div>Prix unitaire: ${Number(item.price).toFixed(2)}</div>
                    <div>Quantité: {Number(item.quantity)}</div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="card-footer d-flex justify-content-between align-items-center">
              <div>
                Total: ${totalPrice.toFixed(2)} | Quantité totale: {totalQuantity}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}