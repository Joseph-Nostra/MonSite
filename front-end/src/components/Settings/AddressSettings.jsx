import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import { MapPin, Plus, Trash2, Edit2, CheckCircle, Home } from 'lucide-react';

const AddressSettings = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        full_name: '',
        address: '',
        city: '',
        zip_code: '',
        phone: '',
        is_default: false
    });
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const res = await axios.get('/settings/addresses');
            setAddresses(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (addr) => {
        setFormData({
            full_name: addr.full_name,
            address: addr.address,
            city: addr.city,
            zip_code: addr.zip_code,
            phone: addr.phone,
            is_default: addr.is_default
        });
        setEditingId(addr.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Voulez-vous vraiment supprimer cette adresse ?')) return;
        try {
            await axios.delete(`/settings/addresses/${id}`);
            setAddresses(addresses.filter(a => a.id !== id));
            setMessage({ type: 'success', text: 'Adresse supprimée' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                const res = await axios.put(`/settings/addresses/${editingId}`, formData);
                setAddresses(addresses.map(a => a.id === editingId ? res.data : (formData.is_default ? { ...a, is_default: false } : a)));
                setMessage({ type: 'success', text: 'Adresse mise à jour' });
            } else {
                const res = await axios.post('/settings/addresses', formData);
                setAddresses([...(formData.is_default ? addresses.map(a => ({ ...a, is_default: false })) : addresses), res.data]);
                setMessage({ type: 'success', text: 'Adresse ajoutée' });
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ full_name: '', address: '', city: '', zip_code: '', phone: '', is_default: false });
        } catch (err) {
            setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement' });
        }
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0">Mes adresses</h3>
                {!showForm && (
                    <button onClick={() => setShowForm(true)} className="btn btn-primary rounded-pill d-flex align-items-center gap-2 px-4 shadow-sm">
                        <Plus size={18} /> Ajouter une adresse
                    </button>
                )}
            </div>

            {message && (
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} border-0 rounded-3 shadow-sm d-flex align-items-center gap-2 mb-4`}>
                    <CheckCircle size={20} /> {message.text}
                </div>
            )}

            {showForm ? (
                <div className="card border-0 bg-light p-4 rounded-4 mb-4 shadow-sm">
                    <h5 className="fw-bold mb-4">{editingId ? 'Modifier l\'adresse' : 'Nouvelle adresse'}</h5>
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-12">
                                <label className="form-label small fw-bold">Nom complet</label>
                                <input type="text" className="form-control border-0 py-2 shadow-sm" required value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} />
                            </div>
                            <div className="col-12">
                                <label className="form-label small fw-bold">Adresse</label>
                                <input type="text" className="form-control border-0 py-2 shadow-sm" required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small fw-bold">Ville</label>
                                <input type="text" className="form-control border-0 py-2 shadow-sm" required value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small fw-bold">Code postal</label>
                                <input type="text" className="form-control border-0 py-2 shadow-sm" required value={formData.zip_code} onChange={e => setFormData({ ...formData, zip_code: e.target.value })} />
                            </div>
                            <div className="col-12">
                                <label className="form-label small fw-bold">Téléphone</label>
                                <input type="text" className="form-control border-0 py-2 shadow-sm" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                            <div className="col-12">
                                <div className="form-check form-switch mt-2">
                                    <input className="form-check-input" type="checkbox" id="isDefault" checked={formData.is_default} onChange={e => setFormData({ ...formData, is_default: e.target.checked })} />
                                    <label className="form-check-label" htmlFor="isDefault">Définir comme adresse par défaut</label>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 d-flex gap-2">
                            <button type="submit" className="btn btn-primary px-4 py-2 rounded-3 shadow-sm">Enregistrer</button>
                            <button type="button" onClick={() => setShowForm(false)} className="btn btn-link text-muted text-decoration-none">Annuler</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="row g-3">
                    {addresses.length === 0 ? (
                        <div className="text-center py-5 text-muted bg-light rounded-4 border-2 border-dashed">
                            <MapPin size={48} className="mb-3 opacity-25" />
                            <p>Vous n'avez pas encore d'adresse enregistrée.</p>
                        </div>
                    ) : (
                        addresses.map(addr => (
                            <div className="col-md-6" key={addr.id}>
                                <div className={`card h-100 border-0 rounded-4 shadow-sm p-4 ${addr.is_default ? 'bg-primary bg-opacity-10 border-start border-4 border-primary' : ''}`}>
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="d-flex align-items-center gap-2">
                                            <Home size={20} className={addr.is_default ? 'text-primary' : 'text-muted'} />
                                            <span className="fw-bold fs-5">{addr.full_name}</span>
                                        </div>
                                        {addr.is_default && <span className="badge bg-primary rounded-pill px-3">Défaut</span>}
                                    </div>
                                    <p className="text-muted mb-1">{addr.address}</p>
                                    <p className="text-muted mb-1">{addr.zip_code} {addr.city}</p>
                                    <p className="text-muted mb-4">{addr.phone}</p>
                                    <div className="mt-auto pt-3 border-top d-flex gap-3">
                                        <button onClick={() => handleEdit(addr)} className="btn btn-link p-0 text-primary d-flex align-items-center gap-1 text-decoration-none small">
                                            <Edit2 size={14} /> Modifier
                                        </button>
                                        <button onClick={() => handleDelete(addr.id)} className="btn btn-link p-0 text-danger d-flex align-items-center gap-1 text-decoration-none small">
                                            <Trash2 size={14} /> Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default AddressSettings;
