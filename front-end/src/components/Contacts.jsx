// src/components/Contacts.jsx
import React, { useState } from "react";
import api from "../axios"; // Axios configuré avec withCredentials

function Contacts() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     

      // 🔹 Envoi du formulaire via Axios
      const res = await api.post("/contacts", { name, email, subject, message });

      if (res.status === 200) {
        setSuccess(res.data.message || "Message envoyé !");
        setError("");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setError(res.data.message || "Erreur lors de l'envoi");
        setSuccess("");
      }
    } catch (err) {
      console.error("Erreur contact:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Erreur serveur");
      setSuccess("");
    }
  };

  return (
    <div className="container w-50 mt-5 pt-5">
      <h3>Contactez-nous</h3>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
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
          type="text"
          placeholder="Sujet (optionnel)"
          className="form-control my-2"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <textarea
          placeholder="Message"
          className="form-control my-2"
          rows="5"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button className="btn btn-primary w-100 mt-2">Envoyer</button>
      </form>
    </div>
  );
}

export default Contacts;