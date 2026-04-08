import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";

function LoginForm({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/login", {
        email,
        password,
      });

      if (res.data.user && res.data.token) {
        // 🔥 save token
        localStorage.setItem("token", res.data.token);

        // update global user
        setUser(res.data.user);

        // redirect
        navigate("/products");
      } else {
        setError(res.data.message || "Login incorrect");
      }

    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);

      if (err.response?.status === 401) {
        setError("Email ou mot de passe incorrect");
      } else if (err.response?.data?.errors) {
        const messages = Object.values(err.response.data.errors)
          .flat()
          .join("\n");
        setError(messages);
      } else {
        setError("Erreur serveur. Réessayez.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <form onSubmit={handleSubmit} className="w-50 p-4 shadow rounded bg-white">

        <h3 className="text-center mb-4">Connexion</h3>

        {/* ERROR DISPLAY */}
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="form-control my-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="form-control my-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          className="btn btn-dark w-100 mt-3 py-2 fw-bold shadow-sm"
          disabled={loading}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <div className="d-flex align-items-center my-4">
          <hr className="flex-grow-1" />
          <span className="mx-3 text-muted">ou</span>
          <hr className="flex-grow-1" />
        </div>

        <button
          type="button"
          className="btn btn-outline-dark w-100 py-2 d-flex align-items-center justify-content-center gap-2 shadow-sm"
          onClick={() => window.location.href = "http://127.0.0.1:8000/api/auth/google"}
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" width="20" height="20" />
          Continuer avec Google
        </button>
      </form>
    </div>
  );
}

export default LoginForm;