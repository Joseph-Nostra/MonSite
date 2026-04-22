import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import { Camera, Save, CheckCircle } from 'lucide-react';

const ProfileSettings = ({ setUser }) => {
    const [user, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get('/user');
            setUser(res.data);
            setFormData({
                name: res.data.name || '',
                phone: res.data.phone || '',
            });
            if (res.data.avatar) {
                setAvatarPreview(`http://127.0.0.1:8000/storage/${res.data.avatar}`);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('phone', formData.phone);
        if (avatarFile) {
            data.append('avatar', avatarFile);
        }
        try {
            const res = await axios.post('/settings/profile', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage({ type: 'success', text: res.data.message });
            setUserData(res.data.user);
            setUser(res.data.user);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de la sauvegarde' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div>
            <h3 className="fw-bold mb-4">Informations personnelles</h3>

            {message && (
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} border-0 rounded-3 shadow-sm d-flex align-items-center gap-2 mb-4`}>
                    {message.type === 'success' && <CheckCircle size={20} />}
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="d-flex flex-column align-items-center mb-5">
                    <div className="position-relative">
                        <div className="rounded-circle overflow-hidden shadow-sm" style={{ width: '120px', height: '120px', backgroundColor: '#f8fafc' }}>
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar" className="w-100 h-100 object-fit-cover" />
                            ) : (
                                <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted text-uppercase fw-bold fs-2">
                                    {formData.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <label htmlFor="avatar" className="position-absolute bottom-0 end-0 bg-primary text-white p-2 rounded-circle shadow-sm cursor-pointer" style={{ cursor: 'pointer' }}>
                            <Camera size={18} />
                            <input type="file" id="avatar" className="d-none" accept="image/*" onChange={handleAvatarChange} />
                        </label>
                    </div>
                    <p className="mt-3 text-muted small">Cliquez sur l'icône pour changer votre photo</p>
                </div>

                <div className="row g-4">
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Nom complet</label>
                        <input
                            type="text"
                            className="form-control form-control-lg bg-light border-0 py-3 rounded-3"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Email</label>
                        <input
                            type="email"
                            className="form-control form-control-lg bg-light border-0 py-3 rounded-3"
                            value={user?.email}
                            disabled
                        />
                        <p className="small text-muted mt-1">L'email ne peut pas être modifié</p>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Téléphone</label>
                        <input
                            type="text"
                            className="form-control form-control-lg bg-light border-0 py-3 rounded-3"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                </div>

                <div className="mt-5 pt-4 border-top">
                    <button type="submit" disabled={saving} className="btn btn-primary btn-lg px-5 py-3 rounded-3 d-flex align-items-center gap-2">
                        {saving ? <div className="spinner-border spinner-border-sm"></div> : <Save size={20} />}
                        Sauvegarder les modifications
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileSettings;
