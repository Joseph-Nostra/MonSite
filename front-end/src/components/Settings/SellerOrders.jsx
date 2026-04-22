import React, { useState, useEffect } from 'react';
import api from '../../axios';
import { ShoppingBag, Search, Filter, Eye, CheckCircle, Truck, XCircle, Phone, MapPin, Clock } from 'lucide-react';

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get('/seller/orders');
            setOrders(res.data.orders);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            // Mettre à jour localement
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (err) {
            alert("Erreur lors de la mise à jour du statut");
        }
    };

    const translateStatus = (status) => {
        const labels = {
            'pending': { text: 'En attente', class: 'bg-warning' },
            'confirmed': { text: 'Confirmée', class: 'bg-info' },
            'processing': { text: 'En préparation', class: 'bg-primary' },
            'shipped': { text: 'Expédiée', class: 'bg-royal' },
            'delivered': { text: 'Livrée', class: 'bg-success' },
            'cancelled': { text: 'Annulée', class: 'bg-danger' }
        };
        return labels[status] || { text: status, class: 'bg-secondary' };
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        const matchesSearch = order.id.toString().includes(searchTerm) || 
                             order.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="animate__animated animate__fadeIn">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0">📦 Mes Commandes</h3>
                <div className="d-flex gap-2">
                    <div className="input-group input-group-sm rounded-pill overflow-hidden shadow-sm border" style={{ width: '250px' }}>
                        <span className="input-group-text bg-white border-0"><Search size={14} /></span>
                        <input 
                            type="text" 
                            className="form-control border-0" 
                            placeholder="Rechercher ID ou Client..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        className="form-select form-select-sm rounded-pill shadow-sm" 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{ width: '150px' }}
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="pending">En attente</option>
                        <option value="confirmed">Confirmée</option>
                        <option value="processing">En préparation</option>
                        <option value="shipped">Expédiée</option>
                        <option value="delivered">Livrée</option>
                        <option value="cancelled">Annulée</option>
                    </select>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="border-0 px-4 py-3">Commande</th>
                                <th className="border-0 py-3">Client</th>
                                <th className="border-0 py-3">Total</th>
                                <th className="border-0 py-3">Date</th>
                                <th className="border-0 py-3">Statut</th>
                                <th className="border-0 px-4 py-3 text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-5 text-muted">Aucune commande trouvée.</td></tr>
                            ) : (
                                filteredOrders.map(order => (
                                    <tr key={order.id}>
                                        <td className="px-4 py-3 fw-bold text-primary">#CMD{order.id}</td>
                                        <td className="py-3">
                                            <div className="fw-semibold">{order.full_name || 'Client Inconnu'}</div>
                                            <div className="small text-muted">{order.user?.email}</div>
                                        </td>
                                        <td className="py-3 fw-bold text-dark">{order.total} MAD</td>
                                        <td className="py-3 small">{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td className="py-3">
                                            <span className={`badge rounded-pill px-3 py-2 ${translateStatus(order.status).class} bg-opacity-10 text-${translateStatus(order.status).class.split('-')[1]}`}>
                                                {translateStatus(order.status).text}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-end">
                                            <button 
                                                className="btn btn-sm btn-light rounded-pill border shadow-sm px-3"
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                <Eye size={16} className="me-1" /> Détails
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Détails Commande */}
            {selectedOrder && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} id="orderDetailModal" tabIndex="-1">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4">
                            <div className="modal-header border-0 p-4">
                                <h5 className="modal-title fw-bold">Détails Commande #CMD{selectedOrder.id}</h5>
                                <button type="button" className="btn-close" onClick={() => setSelectedOrder(null)}></button>
                            </div>
                            <div className="modal-body p-4 pt-0">
                                <div className="row g-4">
                                    {/* Client info */}
                                    <div className="col-md-6">
                                        <div className="p-3 bg-light rounded-3 h-100">
                                            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                                <Phone size={16} /> Informations Client
                                            </h6>
                                            <div className="mb-2"><strong>Nom :</strong> {selectedOrder.full_name}</div>
                                            <div className="mb-2"><strong>Téléphone :</strong> {selectedOrder.phone}</div>
                                            <div className="mb-0"><strong>Email :</strong> {selectedOrder.user?.email}</div>
                                        </div>
                                    </div>
                                    {/* Shipping info */}
                                    <div className="col-md-6">
                                        <div className="p-3 bg-light rounded-3 h-100">
                                            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                                <MapPin size={16} /> Adresse de Livraison
                                            </h6>
                                            <p className="mb-1">{selectedOrder.address}</p>
                                            <p className="mb-0 text-muted">{selectedOrder.zip_code} {selectedOrder.city}</p>
                                        </div>
                                    </div>

                                    {/* Products list */}
                                    <div className="col-12">
                                        <h6 className="fw-bold mb-3">Produits Commandés</h6>
                                        <div className="list-group rounded-3 overflow-hidden shadow-sm mb-4">
                                            {selectedOrder.items?.map((item, idx) => (
                                                <div key={idx} className="list-group-item d-flex justify-content-between align-items-center p-3">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <img src={item.image ? `http://127.0.0.1:8000/storage/${item.image}` : 'https://placehold.co/50'} alt="" width="50" height="50" className="rounded object-fit-cover" />
                                                        <div>
                                                            <div className="fw-bold">{item.title}</div>
                                                            <div className="small text-muted">{item.price} MAD x {item.quantity}</div>
                                                        </div>
                                                    </div>
                                                    <div className="fw-bold">{item.price * item.quantity} MAD</div>
                                                </div>
                                            ))}
                                            <div className="list-group-item bg-light p-3 d-flex justify-content-between align-items-center">
                                                <span className="fw-bold">TOTAL À PERCEVOIR</span>
                                                <span className="h5 fw-bold text-primary mb-0">{selectedOrder.total} MAD</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="col-12 text-center mt-3">
                                        <h6 className="fw-bold mb-3 small text-uppercase tracking-wider opacity-50">Modifier le statut de la commande</h6>
                                        <div className="d-flex flex-wrap justify-content-center gap-2">
                                            <button 
                                                disabled={selectedOrder.status === 'confirmed'}
                                                onClick={() => handleUpdateStatus(selectedOrder.id, 'confirmed')}
                                                className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-2 ${selectedOrder.status === 'confirmed' ? 'btn-info text-white' : 'btn-outline-info'}`}
                                            >
                                                <CheckCircle size={14} /> Confirmer
                                            </button>
                                            <button 
                                                disabled={selectedOrder.status === 'processing'}
                                                onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')}
                                                className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-2 ${selectedOrder.status === 'processing' ? 'btn-primary text-white' : 'btn-outline-primary'}`}
                                            >
                                                <Clock size={14} /> Préparation
                                            </button>
                                            <button 
                                                disabled={selectedOrder.status === 'shipped'}
                                                onClick={() => handleUpdateStatus(selectedOrder.id, 'shipped')}
                                                className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-2 ${selectedOrder.status === 'shipped' ? 'btn-warning text-white' : 'btn-outline-warning'}`}
                                            >
                                                <Truck size={14} /> Expédier
                                            </button>
                                            <button 
                                                disabled={selectedOrder.status === 'delivered'}
                                                onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                                                className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-2 ${selectedOrder.status === 'delivered' ? 'btn-success text-white' : 'btn-outline-success'}`}
                                            >
                                                <CheckCircle size={14} /> Livrée
                                            </button>
                                            <button 
                                                disabled={selectedOrder.status === 'cancelled'}
                                                onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                                                className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-2 ${selectedOrder.status === 'cancelled' ? 'btn-danger text-white' : 'btn-outline-danger'}`}
                                            >
                                                <XCircle size={14} /> Annuler
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-0 p-4 pt-0">
                                <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setSelectedOrder(null)}>Fermer</button>
                                {selectedOrder.phone ? (
                                    <a href={`tel:${selectedOrder.phone}`} className="btn btn-primary rounded-pill px-4">
                                        <Phone size={16} className="me-2" /> Appeler le client
                                    </a>
                                ) : (
                                    <button disabled className="btn btn-outline-secondary rounded-pill px-4">
                                        <Phone size={16} className="me-2" /> Numéro non fourni
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerOrders;
