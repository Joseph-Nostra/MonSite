import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import { Bell, Mail, MessageSquare, Smartphone, Save, CheckCircle, AlertCircle } from 'lucide-react';

const NotificationPreferences = ({ user }) => {
    const [preferences, setPreferences] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const isSeller = user?.role === 'vendeur' || user?.role === 'admin';

    useEffect(() => {
        const fetchPrefs = async () => {
            try {
                const res = await axios.get('/settings/notifications/preferences');
                setPreferences(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPrefs();
    }, []);

    const handleToggle = (category, setting) => {
        if (category) {
            setPreferences({
                ...preferences,
                [category]: {
                    ...preferences[category],
                    [setting]: !preferences[category][setting]
                }
            });
        } else {
            setPreferences({
                ...preferences,
                [setting]: !preferences[setting]
            });
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            await axios.post('/settings/notifications/preferences', preferences);
            setMessage('Préférences enregistrées avec succès !');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error(err);
            setMessage('Erreur lors de l\'enregistrement.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-4"><div className="spinner-border spinner-border-sm text-primary"></div></div>;

    const renderToggle = (label, category, setting, icon) => (
        <div className="d-flex align-items-center justify-content-between py-3 border-bottom border-light last-child-border-0">
            <div className="d-flex align-items-center gap-3">
                {icon && <span className="text-muted">{icon}</span>}
                <span className="text-dark">{label}</span>
            </div>
            <div className="form-check form-switch p-0">
                <input 
                    className="form-check-input m-0 ms-2" 
                    type="checkbox" 
                    role="switch" 
                    checked={category ? preferences[category][setting] : preferences[setting]}
                    onChange={() => handleToggle(category, setting)}
                    style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                />
            </div>
        </div>
    );

    return (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                <h5 className="fw-bold d-flex align-items-center gap-2">
                    <Bell size={20} className="text-primary" />
                    Préférences de notification
                </h5>
            </div>
            <div className="card-body p-4">
                {isSeller ? (
                    // Vendeur Preferences
                    <div className="mb-4">
                        <h6 className="text-muted text-uppercase small fw-bold mb-3 border-bottom pb-2">Business & Ventes</h6>
                        {renderToggle('Nouvelle commande', null, 'new_order')}
                        {renderToggle('Paiement reçu', null, 'payment_received')}
                        {renderToggle('Stock faible', null, 'low_stock')}
                        {renderToggle('Produit vendu', null, 'product_sold')}
                        {renderToggle('Litiges / Problèmes', null, 'disputes')}

                        <h6 className="text-muted text-uppercase small fw-bold mt-4 mb-3 border-bottom pb-2">Canaux de notification</h6>
                        {renderToggle('Email', 'channels', 'email', <Mail size={18} />)}
                        {renderToggle('Dashboard Alert', 'channels', 'dashboard', <Bell size={18} />)}
                        {renderToggle('SMS (Optionnel)', 'channels', 'sms', <Smartphone size={18} />)}
                    </div>
                ) : (
                    // Client Preferences
                    <div className="mb-4">
                        <h6 className="text-muted text-uppercase small fw-bold mb-3 border-bottom pb-2">Commandes</h6>
                        {renderToggle('Commande confirmée', 'orders', 'confirmed')}
                        {renderToggle('En cours de livraison', 'orders', 'shipping')}
                        {renderToggle('Commande livrée', 'orders', 'delivered')}
                        {renderToggle('Commande annulée', 'orders', 'canceled')}

                        <h6 className="text-muted text-uppercase small fw-bold mt-4 mb-3 border-bottom pb-2">Paiements</h6>
                        {renderToggle('Paiement réussi', 'payments', 'success')}
                        {renderToggle('Paiement échoué', 'payments', 'failed')}
                        {renderToggle('Remboursement effectué', 'payments', 'refund')}

                        <h6 className="text-muted text-uppercase small fw-bold mt-4 mb-3 border-bottom pb-2">Promotions</h6>
                        {renderToggle('Réductions', 'promotions', 'discounts')}
                        {renderToggle('Codes promo', 'promotions', 'promo_codes')}
                        {renderToggle('Nouveaux produits', 'promotions', 'new_products')}

                        <h6 className="text-muted text-uppercase small fw-bold mt-4 mb-3 border-bottom pb-2">Livraison</h6>
                        {renderToggle('Colis expédié', 'delivery', 'shipped')}
                        {renderToggle('Livreur en route', 'delivery', 'out_for_delivery')}
                        {renderToggle('Colis livré', 'delivery', 'delivered')}

                        <h6 className="text-muted text-uppercase small fw-bold mt-4 mb-3 border-bottom pb-2">Canaux de notification</h6>
                        {renderToggle('Email', 'channels', 'email', <Mail size={18} />)}
                        {renderToggle('In-app (Site)', 'channels', 'in_app', <MessageSquare size={18} />)}
                        {renderToggle('SMS (Optionnel)', 'channels', 'sms', <Smartphone size={18} />)}
                    </div>
                )}

                <div className="d-flex align-items-center justify-content-between mt-4 pt-3 border-top">
                    {message && (
                        <div className={`small d-flex align-items-center gap-1 ${message.includes('Erreur') ? 'text-danger' : 'text-success animate__animated animate__fadeIn'}`}>
                            {message.includes('Erreur') ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
                            {message}
                        </div>
                    )}
                    <button 
                        className="btn btn-primary rounded-pill px-4 ms-auto d-flex align-items-center gap-2"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? <div className="spinner-border spinner-border-sm"></div> : <Save size={18} />}
                        {saving ? 'Enregistrement...' : 'Enregistrer les préférences'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationPreferences;
