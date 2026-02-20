import { useState } from 'react';

function CreateItem({ onSuccess }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        city: 'Mexico City',
        category: 'Electrónicos',
        photo_url: 'https://images.unsplash.com/photo-1513530176992-0cf73cb3a735?auto=format&fit=crop&w=400&q=80' // default mock
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price) || 0
            };

            const res = await fetch('http://localhost:8000/api/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setFormData({
                    title: '',
                    description: '',
                    price: '',
                    city: 'Mexico City',
                    category: 'Electrónicos',
                    photo_url: 'https://images.unsplash.com/photo-1513530176992-0cf73cb3a735?auto=format&fit=crop&w=400&q=80'
                });
                alert('Artículo publicado con éxito');
                if (onSuccess) onSuccess();
            } else {
                alert('Error al publicar el artículo');
            }
        } catch (err) {
            console.error(err);
            alert('Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Vender un Artículo</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Título del Artículo</label>
                    <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Ej. Bicicleta de montaña"
                    />
                </div>

                <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                        name="description"
                        required
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe los detalles, condición, etc."
                    />
                </div>

                <div className="form-group">
                    <label>Precio (MXN)</label>
                    <input
                        type="number"
                        name="price"
                        required
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Ej. 1500"
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label>Ciudad</label>
                        <select name="city" value={formData.city} onChange={handleChange}>
                            <option value="Mexico City">Mexico City</option>
                            <option value="Guadalajara">Guadalajara</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Categoría</label>
                        <select name="category" value={formData.category} onChange={handleChange}>
                            <option value="Electrónicos">Electrónicos</option>
                            <option value="Muebles">Muebles</option>
                            <option value="Deportes">Deportes</option>
                            <option value="Electrodomésticos">Electrodomésticos</option>
                            <option value="Vehículos">Vehículos</option>
                            <option value="Otros">Otros</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>URL de Foto (Mock)</label>
                    <input
                        type="url"
                        name="photo_url"
                        required
                        value={formData.photo_url}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Publicando...' : 'Publicar Artículo'}
                </button>
            </form>
        </div>
    );
}

export default CreateItem;
