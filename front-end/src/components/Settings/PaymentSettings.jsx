import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import { CreditCard, History, Download, AlertCircle, CheckCircle, Clock, FileText } from 'lucide-react';

const PaymentSettings = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await axios.get('/settings/payments');
                setPayments(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'paid': return <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2"><CheckCircle size={14} className="me-1" /> Payé</span>;
            case 'pending': return <span className="badge bg-warning bg-opacity-10 text-warning rounded-pill px-3 py-2"><Clock size={14} className="me-1" /> En attente</span>;
            case 'failed': return <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3 py-2"><AlertCircle size={14} className="me-1" /> Échoué</span>;
            default: return <span className="badge bg-secondary rounded-pill px-3 py-2">{status}</span>;
        }
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0">Historique des paiements</h3>
                <div className="text-muted small d-flex align-items-center gap-2">
                    <History size={16} /> Dernière mise à jour à l'instant
                </div>
            </div>

            {/* Saved Cards Header (Mock) */}
            <div className="card border-0 bg-light p-4 rounded-4 mb-5 shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="fw-bold mb-1 d-flex align-items-center gap-2">
                            <CreditCard size={20} className="text-primary" />
                            Méthode de paiement par défaut
                        </h5>
                        <p className="text-muted small mb-0">Votre carte sera débitée lors de vos prochains achats.</p>
                    </div>
                    <button className="btn btn-outline-primary btn-sm rounded-pill px-3">Gérer mes cartes</button>
                </div>
            </div>

            {/* Payment List */}
            <div className="table-responsive">
                <table className="table table-hover align-middle border-0">
                    <thead className="bg-light border-0">
                        <tr>
                            <th className="border-0 py-3 px-4 rounded-start-4">Commande</th>
                            <th className="border-0 py-3">Date</th>
                            <th className="border-0 py-3">Montant</th>
                            <th className="border-0 py-3">Méthode</th>
                            <th className="border-0 py-3">Statut</th>
                            <th className="border-0 py-3 px-4 rounded-end-4 text-end">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-5 text-muted">
                                    Aucune transaction trouvée.
                                </td>
                            </tr>
                        ) : (
                            payments.map(payment => (
                                <tr key={payment.id} className="border-bottom border-light">
                                    <td className="py-3 px-4 fw-bold">#{payment.order?.id || 'N/A'}</td>
                                    <td className="py-3 text-muted">{new Date(payment.created_at).toLocaleDateString()}</td>
                                    <td className="py-3 fw-bold">{payment.amount} MAD</td>
                                    <td className="py-3">
                                        <span className="text-uppercase small fw-bold text-muted">
                                            {payment.method === 'card' ? 'Stripe / Carte' : payment.method}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        {getStatusBadge(payment.status)}
                                    </td>
                                    <td className="py-3 px-4 text-end">
                                        <button className="btn btn-light btn-sm rounded-3 p-2 me-2" title="Voir facture">
                                            <FileText size={16} className="text-muted" />
                                        </button>
                                        <button className="btn btn-light btn-sm rounded-3 p-2" title="Télécharger PDF">
                                            <Download size={16} className="text-muted" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentSettings;
