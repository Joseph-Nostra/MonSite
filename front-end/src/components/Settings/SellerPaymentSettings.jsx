import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import { DollarSign, ShoppingBag, ArrowUpRight, TrendingUp, Filter, Download, ArrowDownRight } from 'lucide-react';

const SellerPaymentSettings = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('/settings/revenue');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

    const cards = [
        { title: 'Revenu Total', value: `${stats?.total_revenue || 0} MAD`, icon: <DollarSign size={24} />, color: '#4f46e5', bg: '#e0e7ff' },
        { title: 'Ventes', value: stats?.sales_count || 0, icon: <ShoppingBag size={24} />, color: '#059669', bg: '#d1fae5' },
        { title: 'Frais (5%)', value: `-${(stats?.total_revenue * stats?.commission_rate)?.toFixed(2) || 0} MAD`, icon: <ArrowDownRight size={24} />, color: '#ef4444', bg: '#fee2e2' },
        { title: 'Net à recevoir', value: `${stats?.net_revenue?.toFixed(2) || 0} MAD`, icon: <TrendingUp size={24} />, color: '#f59e0b', bg: '#fef3c7' },
    ];

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0">Tableau de bord financier</h3>
                <button className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2">
                    <ArrowUpRight size={18} /> Demander un retrait
                </button>
            </div>

            {/* Stats Cards */}
            <div className="row g-3 mb-5">
                {cards.map((card, idx) => (
                    <div className="col-sm-6 col-xl-3" key={idx}>
                        <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div className="p-3 rounded-3" style={{ backgroundColor: card.bg, color: card.color }}>
                                    {card.icon}
                                </div>
                                <div className="fw-bold text-muted small text-uppercase">{card.title}</div>
                            </div>
                            <h4 className="fw-bold mb-0">{card.value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* Transactions */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0 text-dark">Dernières ventes</h5>
                    <div className="d-flex gap-2">
                        <button className="btn btn-light btn-sm rounded-pill px-3 d-flex align-items-center gap-2">
                            <Filter size={14} /> Filtrer
                        </button>
                        <button className="btn btn-light btn-sm rounded-pill px-3 d-flex align-items-center gap-2">
                            <Download size={14} /> Exporter
                        </button>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="border-0 py-3 px-4">Commande</th>
                                <th className="border-0 py-3">Produit</th>
                                <th className="border-0 py-3">Date</th>
                                <th className="border-0 py-3">Montant</th>
                                <th className="border-0 py-3">Statut</th>
                                <th className="border-0 py-3 px-4">Méthode</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats?.transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">Auccune transaction pour le moment.</td>
                                </tr>
                            ) : (
                                stats?.transactions.map((tx, idx) => (
                                    <tr key={idx}>
                                        <td className="py-3 px-4 fw-bold">#{tx.order_id}</td>
                                        <td className="py-3 text-muted small">{tx.product}</td>
                                        <td className="py-3 small text-muted">{new Date(tx.date).toLocaleDateString()}</td>
                                        <td className="py-3 fw-bold">{tx.amount} MAD</td>
                                        <td className="py-3 text-capitalize small">
                                            <span className={`badge rounded-pill px-3 py-2 ${tx.status === 'paid' ? 'bg-success bg-opacity-10 text-success' : 'bg-warning bg-opacity-10 text-warning'}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-uppercase small text-muted">{tx.method}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SellerPaymentSettings;
