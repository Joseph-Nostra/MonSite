import React, { useState } from 'react';
import axios from '../../axios';
import { ShieldCheck, Save, AlertCircle } from 'lucide-react';

const SecuritySettings = () => {
    const [formData, setFormData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const res = await axios.post('/settings/password', formData);
            setMessage({ type: 'success', text: res.data.message });
            setFormData({ current_password: '', new_password: '', new_password_confirmation: '' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors du changement de mot de passe' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <h3 className="fw-bold mb-4 text-danger d-flex align-items-center gap-2">
                <ShieldCheck size={28} />
                Sécurité du compte
            </h3>

            {message && (
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} border-0 rounded-3 shadow-sm d-flex align-items-center gap-2 mb-4`}>
                    {message.type === 'success' ? <ShieldCheck size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </div>
            )}

            <div className="bg-light p-4 rounded-4 mb-5 border-start border-4 border-warning">
                <h5 className="fw-bold mb-2">Changer le mot de passe</h5>
                <p className="text-muted mb-0">Assurez-vous d'utiliser un mot de passe complexe pour protéger votre compte.</p>
            </div>

            <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
                <div className="mb-4">
                    <label className="form-label fw-semibold">Mot de passe actuel</label>
                    <input
                        type="password"
                        className="form-control form-control-lg bg-light border-0 py-3 rounded-3"
                        value={formData.current_password}
                        onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="form-label fw-semibold">Nouveau mot de passe</label>
                    <input
                        type="password"
                        className="form-control form-control-lg bg-light border-0 py-3 rounded-3"
                        value={formData.new_password}
                        onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                        required
                    />
                </div>

                <div className="mb-5">
                    <label className="form-label fw-semibold">Confirmer le nouveau mot de passe</label>
                    <input
                        type="password"
                        className="form-control form-control-lg bg-light border-0 py-3 rounded-3"
                        value={formData.new_password_confirmation}
                        onChange={(e) => setFormData({ ...formData, new_password_confirmation: e.target.value })}
                        required
                    />
                </div>

                <div className="pt-4 border-top">
                    <button type="submit" disabled={saving} className="btn btn-danger btn-lg px-5 py-3 rounded-3 d-flex align-items-center gap-2 shadow-sm">
                        {saving ? <div className="spinner-border spinner-border-sm"></div> : <Save size={20} />}
                        Mettre à jour le mot de passe
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SecuritySettings;
