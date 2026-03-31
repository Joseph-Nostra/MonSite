import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";

function RegisterForm({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [role, setRole] = useState("client");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirm,
        role, // 🔥 IMPORTANT
      });

      if (res.data.user && res.data.token) {
        // 🔥 save token
        localStorage.setItem("token", res.data.token);

        // set global user
        setUser(res.data.user);

        navigate("/products");
      } else {
        setError("Erreur lors de l'inscription");
      }

    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);

      if (err.response?.data?.errors) {
        const messages = Object.values(err.response.data.errors)
          .flat()
          .join("\n");
        setError(messages);
      } else {
        setError(err.response?.data?.message || "Erreur serveur");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <form onSubmit={handleSubmit} className="w-50 p-4 shadow rounded bg-white">

        <h3 className="text-center mb-4">Inscription</h3>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Nom"
          className="form-control my-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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

        <input
          type="password"
          placeholder="Confirmer mot de passe"
          className="form-control my-2"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
        />

        {/* ROLE */}
        <select
          className="form-control my-2"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="client">Client</option>
          <option value="vendeur">Vendeur</option>
        </select>

        <button
          className="btn btn-success w-100 mt-3"
          disabled={loading}
        >
          {loading ? "Inscription..." : "S'inscrire"}
        </button>

      </form>
    </div>
  );
}

export default RegisterForm;