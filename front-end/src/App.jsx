import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, loading, children }) => {
  if (loading) return <div className="text-center mt-5"><LoadingSpinner size="lg" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

import ProductList from "./components/ProductList";
import CartSidebar from "./components/CartSidebar";
import ProductDetail from "./components/ProductDetail";
import NavBar from "./components/NavBar";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Orders from "./components/Orders";
import Footer from "./components/Footer";
import Contacts from "./components/Contacts";
import AddProductForm from "./components/AddProductForm";
import StripePayment from './components/StripePayment';
import SettingsLayout from './components/Settings/SettingsLayout';
import Notifications from "./components/Notification";
import Messages from "./components/Messages";
import Chat from "./components/Chat";
import OrderDetails from "./components/OrderDetails";
import InfoPage from "./components/InfoPage";
import CookieBanner from "./components/Common/CookieBanner";
import MobileBottomNav from "./components/Common/BottomNav";

import LandingPage from "./components/LandingPage";
import ComparisonPage from "./components/ComparisonPage";
import NotFound from "./components/NotFound";
import LoadingSpinner from "./components/Common/LoadingSpinner";

import api from "./axios";
import Toast from "./components/Toast";
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import "./App.css";

function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const { t, i18n: i18nInstance } = useTranslation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = i18nInstance.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18nInstance.language]);



  // 🔥 GET USER CONNECTED
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");

    if (urlToken) {
      localStorage.setItem("token", urlToken);
      window.history.replaceState({}, document.title, "/products"); // Clean the URL
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }


  const fetchUser = async () => {
    try {
      const res = await api.get("/user");

      setUser(res.data.user || res.data);
    } catch (err) {
      console.error("Erreur user:", err);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);

  return (
    
    
    <Router>
      <CookieBanner user={user} />
      <AppContent
        user={user}
        setUser={setUser}
        cart={cart}
        setCart={setCart}
        loading={loading}
        notification={notification}
        setNotification={setNotification}
        theme={theme}
        setTheme={setTheme}
      />
    </Router>
  );
}

// 🔥 APP CONTENT (with navigate)
function AppContent({ user, setUser, cart, setCart, loading , notification, setNotification, theme, setTheme}) {
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setNotification({ message: "Produit supprimé avec succès", type: "success" });
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      console.error("Erreur delete:", err.response?.data || err.message);
      setNotification({ message: "Erreur lors de la suppression", type: "error" });
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-product/${id}`);
  };


  // 🔥 ADD TO CART
  const handleAddToCart = async (product) => {
    if (loading) return;

    if (!user) {
      navigate("/login?redirect=/products");
      return;
    }
    try {
      await api.post("/cart", {
        product_id: product.id,
        quantity: 1,
      });
      const res = await api.get("/cart");
      setCart(res.data.cart);

      

    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login?redirect=/products");
      }

      console.error("Erreur cart:", err.response?.data || err.message);
    }
  };

  // 🔥 LOADING SCREEN
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h5>Chargement...</h5>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      
      <NavBar user={user} setUser={setUser} loading={loading} theme={theme} setTheme={setTheme} />

      <main className="flex-grow-1 container-fluid mt-5 pt-3">
        <Routes>
          <Route path="/" element={<LandingPage user={user} onAddToCart={handleAddToCart} />} />
          <Route path="/compare" element={<ComparisonPage />} />
          {/* AUTH */}
          <Route path="/login" element={<LoginForm setUser={setUser} />} />
          <Route path="/register" element={<RegisterForm setUser={setUser} />} />

          {/* USER */}
          <Route path="/orders" element={<ProtectedRoute user={user} loading={loading}><Orders /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute user={user} loading={loading}><OrderDetails /></ProtectedRoute>} />
          <Route path="/contact" element={<Contacts />} />
          
          <Route path="/notifications" element={<Navigate to="/settings" state={{ tab: 'notifications' }} replace />} />
          <Route path="/messages" element={<Messages user={user} />} />
          <Route path="/chat/:otherUserId" element={<Chat user={user} />} />
          <Route path="/info/:slug" element={<InfoPage />} />
          <Route path="/profile" element={<ProtectedRoute user={user} loading={loading}><SettingsLayout setUser={setUser} user={user} /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute user={user} loading={loading}><SettingsLayout setUser={setUser} user={user} /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute user={user} loading={loading}><SettingsLayout setUser={setUser} user={user} /></ProtectedRoute>} />
          
          {/* Redirects for seller modules using state */}
          <Route path="/my-products" element={<Navigate to="/settings" state={{ tab: 'products-seller' }} replace />} />
          <Route path="/stats" element={<Navigate to="/settings" state={{ tab: 'dash' }} replace />} />
          <Route path="/seller/orders" element={<Navigate to="/settings" state={{ tab: 'orders-seller' }} replace />} />

          {/* ADD / EDIT PRODUCT (ROLE PROTECTED) */}
          <Route
            path="/add-product"
            element={
              user && (user.role === "vendeur" || user.role === "admin") ? (
                <AddProductForm user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/edit-product/:id"
            element={
              user && (user.role === "vendeur" || user.role === "admin") ? (
                <AddProductForm user={user} isEdit={true} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* PRODUCTS */}
          <Route
            path="/products"
            element={
              <div className="row g-0">
                {user && (user.role === 'vendeur' || user.role === 'admin') ? (
                  /* Layout Full screen pour Vendeurs/Admin */
                  <div className="col-12">
                    <ProductList onAddToCart={handleAddToCart} user={user} handleEdit={handleEdit} handleDelete={handleDelete} isFullWidth={true} />
                  </div>
                ) : (
                  /* Layout Classique avec Sidebar pour Clients & Visiteurs */
                  <>
                    <div className="col-md-9 pe-md-4 border-end">
                      <ProductList onAddToCart={handleAddToCart} user={user} handleEdit={handleEdit} handleDelete={handleDelete} isFullWidth={false} />
                    </div>
                    <div className="col-md-3 bg-light p-4 sticky-top" style={{ top: '70px', height: 'calc(100vh - 70px)', overflowY: 'auto' }}>
                       {/* <h5 className="fw-bold mb-4 border-bottom pb-2 mt-2">🛒 Votre Panier</h5> */}
                       <CartSidebar cart={cart} setCart={setCart} user={user} />
                    </div>
                  </>
                )}
              </div>
            }
          />

          {/* PRODUCT DETAIL */}
          <Route
            path="/product/:id"
            element={
              <ProductDetail onAddToCart={handleAddToCart} user={user} />
            }
          />

          {/* EDIT PRODUCT */}
          <Route
            path="/edit-product/:id"
            element={
              user && (user.role === "vendeur" || user.role === "admin") ? (
                <AddProductForm user={user} isEdit={true} />
              ) : (
                <p className="text-center mt-5 text-danger">
                  Accès refusés
                </p>
              )
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <MobileBottomNav user={user} />
      <Toast message={notification.message} type={notification.type} onClose={() => setNotification({ message: "", type: "" })} />
      <style>{`
        @media (max-width: 767px) {
          main { padding-bottom: 80px !important; }
        }
      `}</style>
    </div>
  );
}

export default App;