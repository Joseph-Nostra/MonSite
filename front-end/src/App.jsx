import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

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
import Notifications from "./components/Notification";

import api from "./axios";
import "./App.css";

function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      // update UI (optionnel mais recommandé)
    window.location.reload(); 
  } catch (err) {
    console.error("Erreur delete:", err.response?.data || err.message);
  }
};

const handleEdit = async (id) => {
  const newTitle = prompt("Nouveau titre ?");
  if (!newTitle) return;

  try {
    const res = await api.put(`/products/${id}`, {
      title: newTitle
    });

    console.log("Produit modifié:", res.data);
    window.location.reload(); // simple version
  } catch (err) {
    console.error("Erreur edit:", err.response?.data || err.message);
  }
};

  // 🔥 GET USER CONNECTED
  useEffect(() => {
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
      <AppContent
        user={user}
        setUser={setUser}
        cart={cart}
        setCart={setCart}
        loading={loading}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
    </Router>
  );
}

// 🔥 APP CONTENT (with navigate)
function AppContent({ user, setUser, cart, setCart, loading , handleDelete , handleEdit}) {
  const navigate = useNavigate();


  // 🔥 ADD TO CART
  const handleAddToCart = async (product) => {
    if (loading) return;

    if (!user) {
      navigate("/login");
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
        navigate("/login");
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
      
      <NavBar user={user} setUser={setUser} loading={loading} />

      <main className="flex-fill container-fluid mt-3">
        <Routes>

          {/* AUTH */}
          <Route path="/login" element={<LoginForm setUser={setUser} />} />
          <Route path="/register" element={<RegisterForm setUser={setUser} />} />

          {/* USER */}
          <Route path="/orders" element={<Orders />} />
          <Route path="/contact" element={<Contacts />} />
          
          <Route path="/notifications" element={user ? (<Notifications />) : (
            <p className="text-center mt-5">Veuillez vous connecter</p>
          )
          }
          />


          {/* ADD PRODUCT (ROLE PROTECTED) */}
          <Route
            path="/add-product"
            element={
              user && (user.role === "vendeur" || user.role === "admin") ? (
                <AddProductForm user={user} />
              ) : (
                <p className="text-center mt-5 text-danger">
                  Accès refusé
                </p>
              )
            }
          />

          {/* PRODUCTS */}
          <Route
            path="/products"
            element={
              <div className="row">
                <div className="col-md-9">
                  <ProductList onAddToCart={handleAddToCart} user={user}  handleEdit={handleEdit} handleDelete={handleDelete}/>
                </div>
                <div className="col-md-3">
                  {user && user.role === "client" && (
                    <CartSidebar cart={cart} setCart={setCart} user={user} />
                    )}
                </div>
              </div>
            }
          />

          {/* PRODUCT DETAIL */}
          <Route
            path="/product/:id"
            element={
              <ProductDetail onAddToCart={handleAddToCart} />
            }
          />

        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;