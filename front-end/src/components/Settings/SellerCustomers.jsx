import React, { useState, useEffect } from 'react';
import api from '../../axios';
import { Users, Mail, Phone, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SellerCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await api.get('/seller/customers');
                setCustomers(res.data.customers);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="animate__animated animate__fadeIn">
            <h3 className="fw-bold mb-4">👥 Mes Clients</h3>
            <p className="text-muted mb-4">Liste des clients ayant commandé vos produits.</p>

            <div className="row g-4">
                {customers.length === 0 ? (
                    <div className="col-12 text-center py-5">
                        <Users size={48} className="text-muted mb-3 opacity-20" />
                        <p className="text-muted">Aucun client pour le moment.</p>
                    </div>
                ) : (
                    customers.map(customer => (
                        <div key={customer.id} className="col-md-6 col-lg-4">
                            <div className="card border-0 shadow-sm rounded-4 h-100 p-3 hover-lift transition">
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center overflow-hidden" style={{ width: '50px', height: '50px' }}>
                                        {customer.avatar ? (
                                            <img src={`http://127.0.0.1:8000/storage/${customer.avatar}`} className="w-100 h-100 object-fit-cover" alt="" />
                                        ) : (
                                            <span className="text-primary fw-bold">{customer.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-0">{customer.name}</h6>
                                        <span className="small text-muted text-truncate d-block" style={{ maxWidth: '150px' }}>{customer.email}</span>
                                    </div>
                                </div>
                                <div className="mt-auto pt-3 border-top d-flex gap-2">
                                    <button 
                                        className="btn btn-sm btn-light rounded-pill flex-fill d-flex align-items-center justify-content-center gap-2"
                                        onClick={() => navigate(`/chat/${customer.id}`)}
                                    >
                                        <MessageSquare size={14} /> Message
                                    </button>
                                    {customer.phone && (
                                        <a href={`tel:${customer.phone}`} className="btn btn-sm btn-soft-primary rounded-pill p-2">
                                            <Phone size={14} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            <style>{`
                .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important; }
                .transition { transition: all 0.3s ease; }
                .btn-soft-primary { background: rgba(13, 110, 253, 0.1); color: #0d6efd; border: none; }
                .btn-soft-primary:hover { background: #0d6efd; color: white; }
            `}</style>
        </div>
    );
};

export default SellerCustomers;
