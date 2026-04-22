import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="container vh-100 d-flex flex-column justify-content-center align-items-center text-center">
            <div className="mb-4">
                <h1 className="fw-bold text-primary" style={{ fontSize: '10rem', opacity: 0.1 }}>404</h1>
                <div className="position-absolute translate-middle-x start-50" style={{ marginTop: '-120px' }}>
                    <Search size={100} className="text-secondary opacity-25" />
                </div>
            </div>
            
            <h2 className="fw-bold mb-3">Oups ! Page non trouvée</h2>
            <p className="text-muted mb-5 px-4" style={{ maxWidth: '500px' }}>
                La page que vous recherchez semble avoir été déplacée, supprimée ou n'a jamais existé.
                Pas d'inquiétude, vous pouvez revenir en arrière ou explorer nos produits.
            </p>

            <div className="d-flex gap-3 flex-column flex-sm-row">
                <button 
                    onClick={() => window.history.back()} 
                    className="btn btn-outline-secondary rounded-pill px-5 py-3 d-flex align-items-center gap-2"
                >
                    <ArrowLeft size={18} /> Retour
                </button>
                <Link to="/products" className="btn btn-primary rounded-pill px-5 py-3 d-flex align-items-center gap-2 shadow-sm fw-bold">
                    <Home size={18} /> Voir les produits
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
