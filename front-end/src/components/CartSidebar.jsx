import { useEffect, useState } from "react";
import api from "../axios";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast";

export default function CartSidebar({ cart, setCart, user }) {
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Cart, 2: Shipping, 3: Payment
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [shippingAddress, setShippingAddress] = useState({
    full_name: user?.name || "",
    address: "",
    city: "",
    zip_code: "",
    phone: "",
  });
  const [notification, setNotification] = useState({ message: "", type: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const total = cart.reduce(
      (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );
    setTotalPrice(total);
  }, [cart]);

  const updateQuantity = async (id, delta) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    const newQty = Math.max(1, Number(item.quantity) + delta);
    try {
      await api.put(`/cart/${id}`, { quantity: newQty });
      setCart(cart.map((i) => (i.id === id ? { ...i, quantity: newQty } : i)));
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (id) => {
    try {
      await api.delete(`/cart/${id}`);
      setCart(cart.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const confirmOrder = async () => {
    if (cart.length === 0) {
      setNotification({ message: "Votre panier est vide", type: "error" });
      return;
    }

    // Validation basique shipping
    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.phone) {
      setNotification({ message: "Veuillez remplir toutes les informations de livraison", type: "error" });
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/orders/checkout", {
        payment_method: paymentMethod,
        shipping_address: shippingAddress,
      });

      setNotification({ message: res.data.message || "Commande réussie !", type: "success" });

      if (res.data.redirect_url) {
        window.location.href = res.data.redirect_url;
      } else {
        setTimeout(() => {
          setCart([]);
          navigate("/orders");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setNotification({
        message: err.response?.data?.message || "Une erreur est survenue",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-sidebar-premium card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '20px', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
      <div className="card-header bg-dark text-white p-4 border-0 d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold">
          {step === 1 && "🛒 Votre Panier"}
          {step === 2 && "🚚 Livraison"}
          {step === 3 && "💳 Paiement"}
        </h5>
        {step > 1 && (
          <button className="btn btn-sm btn-outline-light border-0" onClick={() => setStep(step - 1)}>
            ⬅ Retour
          </button>
        )}
      </div>

      <div className="card-body p-4" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {step === 1 && (
          <>
            {cart.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-cart-x display-1 text-muted"></i>
                <p className="mt-3 text-muted">Votre panier est encore vide.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="d-flex align-items-center mb-4 pb-3 border-bottom">
                  <div className="position-relative me-3">
                    <img
                      src={item.image ? `http://127.0.0.1:8000/storage/${item.image.replace("storage/", "")}` : "https://via.placeholder.com/80"}
                      alt={item.title}
                      className="rounded-3 shadow-sm"
                      width="80"
                      height="80"
                      style={{ objectFit: 'cover' }}
                    />
                    <button 
                      className="btn btn-danger btn-sm position-absolute top-0 start-0 translate-middle rounded-circle shadow"
                      style={{ width: '24px', height: '24px', padding: 0 }}
                      onClick={() => removeItem(item.id)}
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-1 text-dark truncate-text">{item.title}</h6>
                    <p className="text-muted small mb-2">${Number(item.price).toFixed(2)} / unité</p>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="input-group input-group-sm w-auto">
                        <button className="btn btn-outline-secondary px-2" onClick={() => updateQuantity(item.id, -1)}>-</button>
                        <span className="input-group-text bg-white px-3 fw-bold">{item.quantity}</span>
                        <button className="btn btn-outline-secondary px-2" onClick={() => updateQuantity(item.id, 1)}>+</button>
                      </div>
                      <span className="fw-bold text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {step === 2 && (
          <div className="shipping-form">
            <div className="mb-3">
              <label className="form-label small fw-bold">Nom complet</label>
              <input type="text" name="full_name" className="form-control rounded-3" value={shippingAddress.full_name} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">Adresse</label>
              <input type="text" name="address" className="form-control rounded-3" value={shippingAddress.address} onChange={handleInputChange} placeholder="N°, Rue, Quartier..." />
            </div>
            <div className="row">
              <div className="col-8">
                <div className="mb-3">
                  <label className="form-label small fw-bold">Ville</label>
                  <input type="text" name="city" className="form-control rounded-3" value={shippingAddress.city} onChange={handleInputChange} />
                </div>
              </div>
              <div className="col-4">
                <div className="mb-3">
                  <label className="form-label small fw-bold">Code Postal</label>
                  <input type="text" name="zip_code" className="form-control rounded-3" value={shippingAddress.zip_code} onChange={handleInputChange} />
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">Téléphone</label>
              <input type="text" name="phone" className="form-control rounded-3" value={shippingAddress.phone} onChange={handleInputChange} placeholder="+212 ..." />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="payment-methods">
            <h6 className="mb-4">Choisissez votre mode de paiement :</h6>
            <div className={`card mb-3 cursor-pointer select-card ${paymentMethod === 'card' ? 'border-primary' : ''}`} onClick={() => setPaymentMethod('card')}>
              <div className="card-body d-flex align-items-center">
                <div className="h3 mb-0 me-3">💳</div>
                <div>
                  <h6 className="mb-0">Carte Bancaire</h6>
                  <small className="text-muted">Stripe Sécurisé</small>
                </div>
                <div className="ms-auto">
                    <input type="radio" checked={paymentMethod === 'card'} readOnly />
                </div>
              </div>
            </div>
            <div className={`card mb-3 cursor-pointer select-card ${paymentMethod === 'paypal' ? 'border-primary' : ''}`} onClick={() => setPaymentMethod('paypal')}>
              <div className="card-body d-flex align-items-center">
                <div className="h3 mb-0 me-3">🅿️</div>
                <div>
                  <h6 className="mb-0">PayPal</h6>
                  <small className="text-muted">Rapide & Facile</small>
                </div>
                <div className="ms-auto">
                    <input type="radio" checked={paymentMethod === 'paypal'} readOnly />
                </div>
              </div>
            </div>
            <div className={`card mb-3 cursor-pointer select-card ${paymentMethod === 'delivery' ? 'border-primary' : ''}`} onClick={() => setPaymentMethod('delivery')}>
              <div className="card-body d-flex align-items-center">
                <div className="h3 mb-0 me-3">🚚</div>
                <div>
                  <h6 className="mb-0">Paiement à la livraison</h6>
                  <small className="text-muted">Payez quand vous recevez</small>
                </div>
                <div className="ms-auto">
                    <input type="radio" checked={paymentMethod === 'delivery'} readOnly />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="card-footer bg-light p-4 border-0">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="text-muted">Sous-total</span>
          <span className="fw-bold">${totalPrice.toFixed(2)}</span>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span className="text-muted">Livraison</span>
          <span className="text-success fw-bold">Gratuit</span>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-4 pt-2 border-top">
          <span className="h5 mb-0 fw-bold">Total</span>
          <span className="h4 mb-0 fw-bold text-primary">${totalPrice.toFixed(2)}</span>
        </div>

        {step === 1 && (
          <button 
            className="btn btn-dark w-100 py-3 rounded-pill fw-bold shadow" 
            disabled={cart.length === 0}
            onClick={() => setStep(2)}
          >
            Passer à la livraison →
          </button>
        )}
        {step === 2 && (
          <button 
            className="btn btn-dark w-100 py-3 rounded-pill fw-bold shadow" 
            onClick={() => setStep(3)}
          >
            Choisir le paiement →
          </button>
        )}
        {step === 3 && (
          <button 
            className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow" 
            onClick={confirmOrder}
            disabled={loading}
          >
            {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : "Finaliser la commande 🚀"}
          </button>
        )}
      </div>

      <Toast 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification({ message: "", type: "" })} 
      />
      <style>{`
        .cursor-pointer { cursor: pointer; }
        .select-card { transition: all 0.2s; border-width: 2px; }
        .select-card:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .truncate-text { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}