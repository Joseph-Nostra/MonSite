import React from 'react';

const UserAvatar = ({ name = "User", size = 40, className = "" }) => {
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const colors = [
        '#0d6efd', '#6610f2', '#6f42c1', '#d63384', '#dc3545', 
        '#fd7e14', '#ffc107', '#198754', '#20c997', '#0dcaf0'
    ];

    const getColorIndex = (name) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash % colors.length);
    };

    const backgroundColor = colors[getColorIndex(name)];

    return (
        <div 
            className={`d-flex align-items-center justify-content-center text-white fw-bold rounded-circle shadow-sm ${className}`}
            style={{ 
                width: `${size}px`, 
                height: `${size}px`, 
                backgroundColor: backgroundColor,
                fontSize: `${size / 2.5}px`,
                border: '2px solid rgba(255,255,255,0.2)'
            }}
        >
            {getInitials(name)}
        </div>
    );
};

export default UserAvatar;
