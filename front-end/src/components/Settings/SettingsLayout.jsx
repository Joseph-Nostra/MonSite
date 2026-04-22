import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { User, Shield, MapPin, Bell, CreditCard, ChevronRight } from 'lucide-react';
import ProfileSettings from './ProfileSettings';
import SecuritySettings from './SecuritySettings';
import AddressSettings from './AddressSettings';
import PaymentSettings from './PaymentSettings';
import SellerPaymentSettings from './SellerPaymentSettings';
import NotificationsSettings from './NotificationsSettings';
import SellerOrders from './SellerOrders';
import SellerProducts from './SellerProducts';
import SellerCustomers from './SellerCustomers';
import { LayoutDashboard, ShoppingBag, Package, Users } from 'lucide-react';

const SettingsLayout = ({ setUser, user }) => {
    const location = useLocation();
    const isSeller = user?.role === 'vendeur' || user?.role === 'admin';
    const [activeTab, setActiveTab] = useState(location.state?.tab || (isSeller ? 'dash' : 'profile'));

    const menuItems = isSeller ? [
        { id: 'dash', label: 'Dashboard', icon: <LayoutDashboard size={20} />, color: '#4f46e5' },
        { id: 'orders-seller', label: 'Mes Commandes', icon: <ShoppingBag size={20} />, color: '#10b981' },
        { id: 'products-seller', label: 'Mes Produits', icon: <Package size={20} />, color: '#f59e0b' },
        { id: 'customers', label: 'Mes Clients', icon: <Users size={20} />, color: '#8b5cf6' },
        { id: 'profile', label: 'Profil', icon: <User size={20} />, color: '#6366f1' },
        { id: 'addresses', label: 'Adresses', icon: <MapPin size={20} />, color: '#10b981' },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={20} />, color: '#3b82f6' },
        { id: 'security', label: 'Sécurité', icon: <Shield size={20} />, color: '#ef4444' },
    ] : [
        { id: 'profile', label: 'Profil', icon: <User size={20} />, color: '#4f46e5' },
        { id: 'security', label: 'Sécurité', icon: <Shield size={20} />, color: '#ef4444' },
        { id: 'addresses', label: 'Adresses', icon: <MapPin size={20} />, color: '#10b981' },
        { id: 'payments', label: 'Paiements', icon: <CreditCard size={20} />, color: '#f59e0b' },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={20} />, color: '#3b82f6' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dash': return <SellerPaymentSettings />;
            case 'orders-seller': return <SellerOrders />;
            case 'products-seller': return <SellerProducts />;
            case 'customers': return <SellerCustomers />;
            case 'profile': return <ProfileSettings setUser={setUser} />;
            case 'security': return <SecuritySettings />;
            case 'addresses': return <AddressSettings />;
            case 'payments': return <PaymentSettings />;
            case 'notifications': return <NotificationsSettings user={user} />;
            default: return <div className="p-5 text-center text-muted">Bientôt disponible...</div>;
        }
    };

    return (
        <div className="container py-5">
            <div className="row g-4">
                {/* Sidebar */}
                <div className="col-lg-4 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="card-header bg-white border-0 py-4 px-4">
                            <h4 className="fw-bold mb-0">Paramètres</h4>
                        </div>
                        <div className="list-group list-group-flush p-2">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`list-group-item list-group-item-action border-0 rounded-3 mb-1 d-flex align-items-center justify-content-between p-3 ${activeTab === item.id ? 'active bg-light text-dark shadow-sm' : ''}`}
                                    style={activeTab === item.id ? { borderLeft: `4px solid ${item.color}` } : {}}
                                >
                                    <div className="d-flex align-items-center gap-3">
                                        <span style={{ color: activeTab === item.id ? item.color : '#64748b' }}>
                                            {item.icon}
                                        </span>
                                        <span className={`fw-semibold ${activeTab === item.id ? 'text-primary' : 'text-secondary'}`}>
                                            {item.label}
                                        </span>
                                    </div>
                                    <ChevronRight size={16} className="text-muted" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="col-lg-8 col-xl-9">
                    <div className="card border-0 shadow-sm rounded-4 min-vh-50">
                        <div className="card-body p-4 p-md-5">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsLayout;
