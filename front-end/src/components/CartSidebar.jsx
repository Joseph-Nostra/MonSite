import { useEffect, useState } from "react";
import api from "../axios";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast";

export default function CartSidebar({ cart, setCart }) {
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [notification, setNotification] = useState({ message: "", type: "" });

  const navigate = useNavigate();

  // 🔥 CALCUL TOTAL
  const calculateTotals = (cartData) => {
    const total = cartData.reduce(
      (acc, item) =>
        acc + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );

    const qty = cartData.reduce(
      (acc, item) => acc + Number(item.quantity || 0),
      0
    );
    

    
    setTotalPrice(total);
    setTotalQuantity(qty);
  };

  useEffect(() => {
    console.log(cart);
    calculateTotals(cart);
  }, [cart]);

  // 🔥 UPDATE QUANTITY (SYNC BACKEND)
  const updateQuantity = async (id, delta) => {
    const item = cart.find((i) => i.id === id);
  if (!item) return;

  const newQty = Math.max(1, Number(item.quantity) + delta);

  await api.put(`/cart/${id}`, {
    quantity: newQty,
  });

  const newCart = cart.map((i) =>
    i.id === id ? { ...i, quantity: newQty } : i
  );

  setCart(newCart);
};

  // 🔥 REMOVE ITEM (SYNC BACKEND)
  const removeItem = async (id) => {
    try {
      await api.delete(`/cart/${id}`);

      setCart(cart.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Erreur delete cart:", err);
    }
  };

  // 🔥 CHECKOUT
  const confirmOrder = async () => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      setNotification({ message: "Panier vide !", type: "error" });
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/orders/checkout", {
        payment_method: paymentMethod
      });

      setNotification({ message: res.data.message || "Commande confirmée !", type: "success" });

      setTimeout(() => {
        setCart([]);
        navigate("/orders");
      }, 2000);

    } catch (err) {
      console.error(err.response?.data || err.message);
      setNotification({ 
        message: err.response?.data?.message || err.response?.data?.error || "Erreur serveur", 
        type: "error" 
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-3 mt-5">

      <h4 className="card-title">
        🛒 Panier ({totalQuantity} articles)
      </h4>

      {cart.length === 0 && <p>Panier vide</p>}

      {cart.map((item) => {

        const imageUrl = item.image
          ? `http://127.0.0.1:8000/storage/${item.image.replace("storage/", "")}`
          : "https://via.placeholder.com/60";

        return (
          <div
            key={item.id}
            className="d-flex align-items-center mb-3 border-bottom pb-2"
          >
            <img
              src={imageUrl}
              alt={item.title}
              width={60}
              className="me-3"
            />

            <div className="flex-grow-1">

              <h6>{item.title}</h6>

              <p className="mb-1">
                Prix unitaire: ${Number(item.price || 0).toFixed(2)}
                <br />
                Total: $
                {(
                  Number(item.price || 0) *
                  Number(item.quantity || 0)
                ).toFixed(2)}
              </p>

              <div className="btn-group">

                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => updateQuantity(item.id, -1)}
                >
                  -
                </button>

                <span className="btn btn-sm btn-light">
                  {item.quantity}
                </span>

                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => updateQuantity(item.id, 1)}
                >
                  +
                </button>

                <button
                  className="btn btn-sm btn-outline-danger ms-2"
                  onClick={() => removeItem(item.id)}
                >
                  Supprimer
                </button>

              </div>
            </div>
          </div>
        );
      })}

      {cart.length > 0 && (
        <div className="mt-3">

          <h5>Total: ${totalPrice.toFixed(2)}</h5>

          <div className="my-3">
            <h6>Méthode de paiement :</h6>
            <div className="form-check">
              <input 
                className="form-check-input" 
                type="radio" 
                name="paymentMethod" 
                id="card" 
                value="card" 
                checked={paymentMethod === 'card'} 
                onChange={(e) => setPaymentMethod(e.target.value)} 
              />
              <label className="form-check-label" htmlFor="card">💳 Carte Bancaire</label>
            </div>
            <div className="form-check">
              <input 
                className="form-check-input" 
                type="radio" 
                name="paymentMethod" 
                id="paypal" 
                value="paypal" 
                checked={paymentMethod === 'paypal'} 
                onChange={(e) => setPaymentMethod(e.target.value)} 
              />
              <label className="form-check-label" htmlFor="paypal">🅿️ PayPal</label>
            </div>
            <div className="form-check">
              <input 
                className="form-check-input" 
                type="radio" 
                name="paymentMethod" 
                id="delivery" 
                value="delivery" 
                checked={paymentMethod === 'delivery'} 
                onChange={(e) => setPaymentMethod(e.target.value)} 
              />
              <label className="form-check-label" htmlFor="delivery">🚚 Paiement à la livraison</label>
            </div>
          </div>

          <button
            className="btn btn-success w-100 mt-2 py-2"
            onClick={confirmOrder}
            disabled={loading}
          >
            {loading ? "Confirmation..." : "Confirmer la commande"}
          </button>

        </div>
      )}

      <Toast 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification({ message: "", type: "" })} 
      />
    </div>
  );
}