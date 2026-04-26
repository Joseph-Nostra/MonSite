import React, { useEffect, useState } from "react";
import api from "../axios";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "./Common/LoadingSpinner";
import { useTranslation } from "react-i18next";
import { X, ArrowLeft, ArrowLeftRight } from "lucide-react";

export default function ComparisonPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        const ids = JSON.parse(localStorage.getItem('compare_ids') || '[]');
        if (ids.length === 0) {
            setProducts([]);
            setLoading(false);
            return;
        }
        try {
            const res = await api.get(`/comparison?ids=${ids.join(',')}`);
            setProducts(res.data);
        } catch (err) {
            console.error("Erreur comparison:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const removeFromCompare = (id) => {
        const current = JSON.parse(localStorage.getItem('compare_ids') || '[]');
        const next = current.filter(cid => cid !== id);
        localStorage.setItem('compare_ids', JSON.stringify(next));
        setProducts(prev => prev.filter(p => p.id !== id));
        window.dispatchEvent(new Event('compare-updated'));
    };

    if (loading) return <div className="text-center mt-5 pt-5"><LoadingSpinner size="lg" /></div>;

    if (products.length === 0) {
        return (
            <div className="container mt-5 pt-5 text-center">
                <div className="bg-light p-5 rounded-5 shadow-sm border">
                    <div className="fs-1 mb-3 text-muted opacity-50">
                        <ArrowLeftRight size={64} />
                    </div>
                    <h2 className="fw-bold mb-3">{t('nothing_to_compare') || "Rien à comparer"}</h2>
                    <p className="text-muted mb-4">{t('compare_add_hint') || "Ajoutez des produits pour les comparer côte à côte."}</p>
                    <button className="btn btn-primary rounded-pill px-4 py-2" onClick={() => navigate("/products")}>
                        {t('explore_products') || "Explorer les produits"}
                    </button>
                </div>
            </div>
        );
    }

    const specs = [
        { label: 'Prix', key: 'price', suffix: '€' },
        { label: 'Marque', key: 'brand' },
        { label: 'Usage', key: 'usage' },
        { label: 'CPU', key: 'cpu' },
        { label: 'RAM', key: 'ram' },
        { label: 'GPU', key: 'gpu' },
        { label: 'Stockage', key: 'storage_capacity' },
        { label: 'Écran', key: 'screen_size' },
        { label: 'Note moyenne', key: 'average_rating', suffix: '/5' },
    ];

    return (
        <div className="container mt-5 pt-4 pb-5">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center gap-3">
                    <button className="btn btn-light rounded-circle shadow-sm" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="fw-bold m-0">{t('product_comparison') || "Comparaison de produits"}</h2>
                </div>
                <button className="btn btn-outline-danger btn-sm rounded-pill" onClick={() => {
                    localStorage.setItem('compare_ids', '[]');
                    setProducts([]);
                    window.dispatchEvent(new Event('compare-updated'));
                }}>
                    {t('clear_all') || "Tout effacer"}
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered bg-white rounded-4 overflow-hidden shadow-sm">
                    <thead>
                        <tr className="bg-light">
                            <th className="p-3" style={{ width: '200px' }}>Caractéristiques</th>
                            {products.map(p => (
                                <th key={p.id} className="p-3 text-center position-relative" style={{ minWidth: '220px' }}>
                                    <button 
                                        className="btn btn-sm btn-icon-close position-absolute top-0 end-0 m-2 rounded-circle"
                                        onClick={() => removeFromCompare(p.id)}
                                    >
                                        <X size={14} />
                                    </button>
                                    <div className="bg-white p-2 rounded mb-2 shadow-sm" style={{ height: '120px' }}>
                                        <img 
                                            src={p.image ? `http://127.0.0.1:8000/storage/${p.image}` : "https://via.placeholder.com/100"} 
                                            alt={p.title} 
                                            className="h-100 w-100 object-fit-contain"
                                        />
                                    </div>
                                    <h6 className="fw-bold text-truncate mb-1">{p.title}</h6>
                                    <Link to={`/product/${p.id}`} className="btn btn-link btn-sm p-0 mb-2">Voir plus</Link>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {specs.map(spec => (
                            <tr key={spec.key}>
                                <td className="fw-bold bg-light p-3">{spec.label}</td>
                                {products.map(p => (
                                    <td key={p.id} className="p-3 text-center">
                                        {spec.key === 'average_rating' ? (
                                            <div className="d-flex align-items-center justify-content-center gap-1">
                                                <span className="fw-bold">{p[spec.key]}</span>
                                                <i className="bi bi-star-fill text-warning small"></i>
                                            </div>
                                        ) : (
                                            <span className={spec.key === 'price' ? 'fw-bold text-primary fs-5' : ''}>
                                                {p[spec.key] || '-'} {spec.suffix && p[spec.key] ? spec.suffix : ''}
                                            </span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        <tr>
                            <td className="fw-bold bg-light p-3">Disponibilité</td>
                            {products.map(p => (
                                <td key={p.id} className="p-3 text-center">
                                    {p.stock > 0 ? (
                                        <span className="badge bg-success-subtle text-success border border-success border-opacity-25 rounded-pill px-3">En stock</span>
                                    ) : (
                                        <span className="badge bg-danger-subtle text-danger border border-danger border-opacity-25 rounded-pill px-3">Rupture</span>
                                    )}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>

            <style>{`
                .btn-icon-close { background: rgba(0,0,0,0.05); border: none; padding: 4px; transition: all 0.2s; }
                .btn-icon-close:hover { background: #fee2e2; color: #ef4444; }
                .table-bordered { border: none !important; }
                .table thead th { border-bottom: 2px solid #f1f5f9; }
                .table td { vertical-align: middle; border-color: #f1f5f9; }
            `}</style>
        </div>
    );
}
