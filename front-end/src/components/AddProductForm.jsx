// src/components/AddProductForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../axios";
import LoadingSpinner from "./Common/LoadingSpinner";

export default function AddProductForm({ user, isEdit = false }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null); // fichier image
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  const [brand, setBrand] = useState("");
  const [usage, setUsage] = useState("");
  const [performance, setPerformance] = useState("");
  const [discount, setDiscount] = useState("");
  const [cpu, setCpu] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [gpu, setGpu] = useState("");
  const [screen, setScreen] = useState("");
  
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (isEdit && id) {
      const fetchProduct = async () => {
        try {
          const res = await api.get(`/products/${id}`);
          const p = res.data;
          setTitle(p.title);
          setDescription(p.description);
          setPrice(p.price);
          setStock(p.stock);
          setBrand(p.brand || "");
          setUsage(p.usage || "");
          setPerformance(p.performance_level || "");
          setDiscount(p.discount_rate || "");
          setCpu(p.cpu || "");
          setRam(p.ram || "");
          setStorage(p.storage || "");
          setGpu(p.gpu || "");
          setScreen(p.screen_size || "");
        } catch (err) {
          console.error("Erreur fetch product:", err);
          setMessage({ text: "Erreur lors de la récupération du produit", type: "danger" });
        }
      };
      fetchProduct();
    }
  }, [isEdit, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || (user.role !== "vendeur" && user.role !== "admin")) {
      setMessage({ text: "Accès refusé !", type: "danger" });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description || "");
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("brand", brand);
      formData.append("usage", usage);
      formData.append("performance_level", performance);
      formData.append("discount_rate", discount || 0);
      formData.append("cpu", cpu);
      formData.append("ram", ram);
      formData.append("storage", storage);
      formData.append("gpu", gpu);
      formData.append("screen_size", screen);

      if (image) formData.append("image", image);

      if (isEdit) {
        formData.append("_method", "PUT");
        await api.post(`/products/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setMessage({ text: isEdit ? "Produit mis à jour !" : "Produit créé !", type: "success" });
      setTimeout(() => navigate(-1), 1500);

    } catch (err) {
      console.error("Erreur save product:", err.response?.data || err.message);
      setMessage({ text: err.response?.data?.message || "Erreur lors de l'enregistrement", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 pt-3 animate__animated animate__fadeIn">
      <form onSubmit={handleSubmit} className="card border-0 shadow rounded-4 p-4 mx-auto" style={{ maxWidth: "850px" }}>
        <div className="text-center mb-4">
            <h2 className="fw-bold text-dark">{isEdit ? "✏️ Modifier le produit" : "🚀 Ajouter un nouveau PC"}</h2>
            <p className="text-muted">Remplissez les informations techniques pour votre catalogue.</p>
        </div>
        
        {message.text && (
          <div className={`alert alert-${message.type} rounded-4 shadow-sm py-3 border-0`} role="alert">
            {message.text}
          </div>
        )}

        <div className="row">
            {/* Section 1: Basic Info */}
            <div className="col-lg-7">
                <h5 className="fw-bold mb-3 border-bottom pb-2">Informations de base</h5>
                <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase opacity-75">Titre du PC</label>
                    <input type="text" className="form-control rounded-3" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: HP Victus 15-fa0000" required />
                </div>

                <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase opacity-75">Description détaillée</label>
                    <textarea className="form-control rounded-3" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décrivez les points forts du produit..."></textarea>
                </div>

                <div className="row g-3 mb-3">
                    <div className="col-md-4">
                        <label className="form-label small fw-bold text-uppercase opacity-75">Prix (DH)</label>
                        <input type="number" className="form-control rounded-3 fw-bold" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label small fw-bold text-uppercase opacity-75">Promo (%)</label>
                        <input type="number" className="form-control rounded-3 text-danger" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="0" />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label small fw-bold text-uppercase opacity-75">Stock</label>
                        <input type="number" className="form-control rounded-3" value={stock} onChange={(e) => setStock(e.target.value)} required />
                    </div>
                </div>
            </div>

            {/* Section 2: Specs & Metadata */}
            <div className="col-lg-5">
                <h5 className="fw-bold mb-3 border-bottom pb-2">Spécifications Techniques</h5>
                
                <div className="row g-2">
                    <div className="col-6 mb-2">
                        <label className="form-label small fw-bold opacity-75">Marque</label>
                        <input type="text" className="form-control form-control-sm rounded-3" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Ex: HP, Dell" />
                    </div>
                    <div className="col-6 mb-2">
                        <label className="form-label small fw-bold opacity-75">Utilisation</label>
                        <select className="form-select form-select-sm rounded-3" value={usage} onChange={(e) => setUsage(e.target.value)}>
                            <option value="">Choisir...</option>
                            <option value="gaming">Gaming</option>
                            <option value="bureau">Bureautique</option>
                            <option value="pro">Professionnel</option>
                            <option value="etudiant">Étudiant</option>
                        </select>
                    </div>

                    <div className="col-6 mb-2">
                        <label className="form-label small fw-bold opacity-75">Processeur (CPU)</label>
                        <input type="text" className="form-control form-control-sm rounded-3" value={cpu} onChange={(e) => setCpu(e.target.value)} placeholder="i7-12700H" />
                    </div>
                    <div className="col-6 mb-2">
                        <label className="form-label small fw-bold opacity-75">RAM (GB)</label>
                        <input type="text" className="form-control form-control-sm rounded-3" value={ram} onChange={(e) => setRam(e.target.value)} placeholder="16GB DDR5" />
                    </div>

                    <div className="col-6 mb-2">
                        <label className="form-label small fw-bold opacity-75">Stockage (SSD)</label>
                        <input type="text" className="form-control form-control-sm rounded-3" value={storage} onChange={(e) => setStorage(e.target.value)} placeholder="512GB NVMe" />
                    </div>
                    <div className="col-6 mb-2">
                        <label className="form-label small fw-bold opacity-75">Carte graphique</label>
                        <input type="text" className="form-control form-control-sm rounded-3" value={gpu} onChange={(e) => setGpu(e.target.value)} placeholder="RTX 4060 8GB" />
                    </div>
                    
                    <div className="col-12 mb-3">
                        <label className="form-label small fw-bold opacity-75">Écran</label>
                        <input type="text" className="form-control form-control-sm rounded-3" value={screen} onChange={(e) => setScreen(e.target.value)} placeholder="15.6' FHD 144Hz" />
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label small fw-bold opacity-75">Image du produit</label>
                    <div className="border border-dashed rounded-4 p-3 text-center bg-light">
                         <input type="file" className="form-control form-control-sm" onChange={(e) => setImage(e.target.files[0])} accept="image/*" />
                         {isEdit && <div className="mt-2 text-muted x-small">Laissez vide pour garder l'image actuelle.</div>}
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-4 pt-3 border-top d-flex gap-2">
            <button type="button" onClick={() => navigate(-1)} className="btn btn-light rounded-pill px-5 flex-fill py-2 fw-bold border">Annuler</button>
            <button className="btn btn-primary rounded-pill px-5 flex-fill py-2 fw-bold shadow" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                {isEdit ? "✅ Enregistrer les modifications" : "🚀 Publier le produit"}
            </button>
        </div>
      </form>
    </div>
  );
}