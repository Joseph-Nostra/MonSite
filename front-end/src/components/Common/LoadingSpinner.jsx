import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'md', color = 'primary', className = "" }) => {
    const sizeMap = {
        sm: { width: '20px', height: '20px', borderWidth: '2px' },
        md: { width: '40px', height: '40px', borderWidth: '3px' },
        lg: { width: '60px', height: '60px', borderWidth: '4px' }
    };

    const currentSize = sizeMap[size] || sizeMap.md;

    return (
        <div className={`premium-spinner-container ${className}`}>
            <div 
                className={`premium-spinner spinner-border text-${color}`} 
                style={{ 
                    ...currentSize,
                    animationDuration: '0.8s',
                    borderRightColor: 'transparent'
                }}
                role="status"
            >
                <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-glow" style={{ 
                width: currentSize.width, 
                height: currentSize.height,
                backgroundColor: `var(--bs-${color})`
            }}></div>
        </div>
    );
};

export default LoadingSpinner;
