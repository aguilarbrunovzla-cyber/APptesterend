import { useState } from 'react';

function ItemList({ items, loading, onDelete }) {
    if (loading) {
        return <div className="loading">Cargando artículos...</div>;
    }

    if (items.length === 0) {
        return <div className="empty-state">No se encontraron artículos con estos filtros.</div>;
    }

    return (
        <div className="items-grid">
            {items.map(item => (
                <div key={item.id} className="item-card">
                    <img src={item.photo_url} alt={item.title} className="item-image" />
                    <div className="item-details">
                        <span className="item-category">{item.category}</span>
                        <h3 className="item-title">{item.title}</h3>
                        <p className="item-price">${item.price.toLocaleString('es-MX')}</p>
                        <div className="item-city">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {item.city}
                        </div>
                        <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            {item.description.length > 60 ? item.description.substring(0, 60) + '...' : item.description}
                            <button
  onClick={() => onDelete(item.id)}
  style={{ backgroundColor: 'red', color: 'white', marginTop: '10px', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
>
  Eliminar
</button>
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ItemList;
