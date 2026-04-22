import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ size = 40, showText = true, className = "" }) => {
    return (
        <Link className={`navbar-brand d-flex align-items-center gap-2 m-0 ${className}`} to="/products">
            <div 
                className="bg-primary rounded-circle d-flex align-items-center justify-content-center border border-secondary"
                style={{ width: `${size}px`, height: `${size}px` }}
            >
                <img src="/logo.png" alt="M" width={size * 0.9} height={size * 0.9} className="rounded-circle" />
            </div>
            {showText && (
                <span className="fw-bold text-white text-uppercase" style={{ letterSpacing: '1px', fontSize: size > 40 ? '1.5rem' : '1.2rem' }}>
                    MonSite
                </span>
            )}
        </Link>
    );
};

export default Logo;
