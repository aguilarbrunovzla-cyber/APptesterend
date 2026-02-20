import { useState, useEffect } from 'react';
import ItemList from './components/ItemList';
import CreateItem from './components/CreateItem';

function App() {
    const [view, setView] = useState('buy'); // 'buy' or 'sell'
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        city: 'Todas',
        min_price: '',
        max_price: '',
        category: 'Todas'
    });

    const fetchItems = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.city && filters.city !== 'Todas') params.append('city', filters.city);
            if (filters.category && filters.category !== 'Todas') params.append('category', filters.category);
            if (filters.min_price) params.append('min_price', filters.min_price);
            if (filters.max_price) params.append('max_price', filters.max_price);

const res = await fetch(`${import.meta.env.VITE_API_URL}/api/items?` + params.toString());
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (view === 'buy') {
            fetchItems();
        }
    }, [filters, view]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleItemCreated = () => {
        setView('buy');
        fetchItems();
    };

    return (
        <div className="app-container">
            <header>
                <div className="logo" onClick={() => setView('buy')}>Marketplace</div>
                <nav>
                    <button
                        className={view === 'buy' ? 'active' : ''}
                        onClick={() => setView('buy')}
                    >
                        Comprar
                    </button>
                    <button
                        className={`btn-primary ${view === 'sell' ? 'active' : ''}`}
                        onClick={() => setView('sell')}
                    >
                        Vender
                    </button>
                </nav>
            </header>

            <main>
                {view === 'buy' && (
                    <>
                        <section className="hero">
                            <h1>Encuentra lo que buscas al mejor precio</h1>
                            <p>Compra y vende artículos usados y nuevos en tu ciudad de forma segura y rápida.</p>

                            <div className="search-bar">
                                <select name="city" value={filters.city} onChange={handleFilterChange}>
                                    <option value="Todas">Todas las Ciudades</option>
                                    <option value="Mexico City">Mexico City</option>
                                    <option value="Guadalajara">Guadalajara</option>
                                </select>

                                <select name="category" value={filters.category} onChange={handleFilterChange}>
                                    <option value="Todas">Todas las Categorías</option>
                                    <option value="Electrónicos">Electrónicos</option>
                                    <option value="Muebles">Muebles</option>
                                    <option value="Deportes">Deportes</option>
                                    <option value="Electrodomésticos">Electrodomésticos</option>
                                    <option value="Vehículos">Vehículos</option>
                                </select>

                                <input
                                    type="number"
                                    name="min_price"
                                    placeholder="Precio Min"
                                    value={filters.min_price}
                                    onChange={handleFilterChange}
                                />

                                <input
                                    type="number"
                                    name="max_price"
                                    placeholder="Precio Max"
                                    value={filters.max_price}
                                    onChange={handleFilterChange}
                                />

                                <button onClick={fetchItems}>Buscar</button>
                            </div>
                        </section>

                        <ItemList items={items} loading={loading} />
                    </>
                )}

                {view === 'sell' && (
                    <CreateItem onSuccess={handleItemCreated} />
                )}
            </main>
        </div>
    );
}

export default App;
