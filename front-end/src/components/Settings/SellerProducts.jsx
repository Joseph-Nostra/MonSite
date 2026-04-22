import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../axios';
import { Package, Plus, Search, Edit2, Trash2, Power, Eye, AlertCircle } from 'lucide-react';

const SellerProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchMyProducts();
    }, []);

    const fetchMyProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/my-products');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (productId, currentStatus) => {
        try {
            await api.put(`/products/${productId}`, { is_active: !currentStatus });
            setProducts(products.map(p => p.id === productId ? { ...p, is_active: !currentStatus } : p));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;
        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter(p => p.id !== id));
        } catch (err) {
            alert("Erreur lors de la suppression");
        }
    };

    const filteredProducts = products.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="animate__animated animate__fadeIn">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold mb-0">💻 Mes Produits</h3>
                    <p className="text-muted small mb-0">{products.length} produits dans votre catalogue</p>
                </div>
                <Link to="/add-product" className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2 shadow-sm">
                    <Plus size={18} /> Ajouter un PC
                </Link>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white border-0 p-4">
                    <div className="input-group rounded-pill overflow-hidden border shadow-sm" style={{ maxWidth: '400px' }}>
                        <span className="input-group-text bg-white border-0"><Search size={16} /></span>
                        <input 
                            type="text" 
                            className="form-control border-0" 
                            placeholder="Rechercher un modèle ou une marque..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light text-muted small text-uppercase fw-bold">
                            <tr>
                                <th className="border-0 px-4 py-3">Produit</th>
                                <th className="border-0 py-3 text-center">Stock</th>
                                <th className="border-0 py-3">Prix</th>
                                <th className="border-0 py-3">Status</th>
                                <th className="border-0 px-4 py-3 text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-5">
                                        <div className="text-muted">Aucun produit trouvé.</div>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map(product => (
                                    <tr key={product.id}>
                                        <td className="px-4 py-3">
                                            <div className="d-flex align-items-center gap-3">
                                                <img 
                                                    src={product.image ? `http://127.0.0.1:8000/storage/${product.image}` : 'https://placehold.co/60'} 
                                                    alt="" 
                                                    width="60" 
                                                    height="60" 
                                                    className="rounded-3 object-fit-cover bg-light border" 
                                                />
                                                <div>
                                                    <div className="fw-bold text-dark">{product.title}</div>
                                                    <div className="small text-muted">{product.brand} | {product.cpu}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 text-center">
                                            <span className={`badge rounded-pill px-3 py-2 ${product.stock > 5 ? 'bg-light text-dark border' : 'bg-danger bg-opacity-10 text-danger'}`}>
                                                {product.stock} {product.stock <= 5 && <AlertCircle size={10} className="ms-1" />}
                                            </span>
                                        </td>
                                        <td className="py-3 fw-bold">{product.price} MAD</td>
                                        <td className="py-3">
                                            <div className="form-check form-switch p-0 d-flex align-items-center">
                                                <input 
                                                    className="form-check-input ms-0 me-2" 
                                                    type="checkbox" 
                                                    checked={product.is_active} 
                                                    onChange={() => handleToggleStatus(product.id, product.is_active)}
                                                />
                                                <span className={`small ${product.is_active ? 'text-success' : 'text-danger'}`}>
                                                    {product.is_active ? 'En ligne' : 'Masqué'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                <Link to={`/product/${product.id}`} target="_blank" className="btn btn-outline-secondary btn-sm rounded-circle p-2 border-0">
                                                    <Eye size={16} />
                                                </Link>
                                                <Link to={`/edit-product/${product.id}`} className="btn btn-outline-primary btn-sm rounded-circle p-2 border-0">
                                                    <Edit2 size={16} />
                                                </Link>
                                                <button onClick={() => handleDelete(product.id)} className="btn btn-outline-danger btn-sm rounded-circle p-2 border-0">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
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

export default SellerProducts;
