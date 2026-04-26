import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axios";
import LoadingSpinner from "./Common/LoadingSpinner";
import Toast from "./Toast";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error(err);
        setNotification({ message: "Erreur lors du chargement de la commande", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading || !order) return <div className="container mt-5 pt-5 text-center"><LoadingSpinner size="lg" /></div>;
  if (!order) return <div className="text-center mt-5 py-5"><h3>Commande non trouvée</h3><button className="btn btn-primary mt-3" onClick={() => navigate("/orders")}>Retour aux commandes</button></div>;

  return (
    <div className="container mt-5 pt-3">
      <div className="card border-0 shadow-lg" style={{ borderRadius: '20px' }}>
        <div className="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-bold mb-0">Reçu de Commande</h2>
            <p className="text-muted mb-0">#ORD-{order.id} • {new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <div className={`badge rounded-pill p-2 px-3 h5 mb-0 ${order.status === 'paid' ? 'bg-success' : 'bg-warning'}`}>
            {order.status.toUpperCase()}
          </div>
        </div>

        <div className="card-body p-4 p-md-5">
          <div className="row mb-5">
            <div className="col-md-6 mb-4 mb-md-0">
              <h5 className="fw-bold mb-3">Informations Client</h5>
              <p className="mb-1 text-dark fw-semibold">{order.shipping?.full_name}</p>
              <p className="mb-1 text-muted">{order.shipping?.address}</p>
              <p className="mb-1 text-muted">{order.shipping?.city}, {order.shipping?.zip_code}</p>
              <p className="mb-0 text-muted">📞 {order.shipping?.phone}</p>
            </div>
            <div className="col-md-6 text-md-end">
              <h5 className="fw-bold mb-3">Méthode de Paiement</h5>
              <p className="mb-1 text-dark text-capitalize">{order.payment_method.replace('_', ' ')}</p>
              <p className="mb-0 text-muted">Statut: <span className={order.status === 'paid' ? 'text-success' : 'text-danger'}>{order.status}</span></p>
            </div>
          </div>

          <div className="table-responsive mb-5">
            <table className="table table-borderless align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="p-3">Produit</th>
                  <th className="text-center p-3">Prix</th>
                  <th className="text-center p-3">Quantité</th>
                  <th className="text-end p-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-bottom">
                    <td className="p-3">
                      <div className="d-flex align-items-center">
                        <img 
                          src={`http://127.0.0.1:8000/storage/${item.image}`} 
                          alt={item.title} 
                          className="rounded me-3 shadow-sm"
                          width="60"
                        />
                        <span className="fw-bold">{item.title}</span>
                      </div>
                    </td>
                    <td className="text-center p-3">${Number(item.price).toFixed(2)}</td>
                    <td className="text-center p-3">x{item.quantity}</td>
                    <td className="text-end p-3 fw-bold">${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="row justify-content-end">
            <div className="col-md-4">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Sous-total</span>
                <span className="fw-bold">${Number(order.total).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Livraison</span>
                <span className="text-success fw-bold">Gratuit</span>
              </div>
              <div className="d-flex justify-content-between mt-3 pt-3 border-top">
                <span className="h4 fw-bold">Total</span>
                <span className="h4 fw-bold text-primary">${Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card-footer bg-white border-0 p-4 text-center">
          <a 
            href={`http://127.0.0.1:8000/api/orders/${order.id}/invoice?token=${localStorage.getItem('token')}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline-primary me-2 rounded-pill px-4 fw-bold"
          >
            📄 Télécharger Facture PDF
          </a>
          <button className="btn btn-primary rounded-pill px-4" onClick={() => navigate("/orders")}>
            Retour aux commandes
          </button>
        </div>
      </div>
      <Toast message={notification.message} type={notification.type} onClose={() => setNotification({ message: "", type: "" })} />
    </div>
  );
}
