import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';
import MapView from '../components/MapView';

const initial = { city: '', type: '', listingType: '', minPrice: '', maxPrice: '', minArea: '', maxArea: '', q: '' };
export default function Home() {
  const [filters, setFilters] = useState(initial);
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [view, setView] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const load = async (current = filters) => {
    setLoading(true); setError('');
    try { const { data } = await api.get('/properties', { params: Object.fromEntries(Object.entries(current).filter(([,v]) => v !== '')) }); setProperties(data.properties); }
    catch { setError('Could not load listings. Make sure the API server and MongoDB are running.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  useEffect(() => { if (user) api.get('/users/favorites').then(r => setFavorites(r.data.favorites.map(p => p._id))).catch(() => {}); else setFavorites([]); }, [user]);
  const update = (key, value) => setFilters(old => ({ ...old, [key]: value }));
  const favorite = async (id) => {
    if (!user) return alert('Please log in to save favorites.');
    try { const { data } = await api.post(`/users/favorites/${id}`); setFavorites(data.favorites.map(String)); } catch (e) { alert(e.response?.data?.message || 'Unable to update favorite'); }
  };
  const saveSearch = async () => {
    if (!user) return alert('Please log in to save a search.');
    const name = window.prompt('Name this search:', filters.city ? `${filters.city} properties` : 'My property search');
    if (name) { await api.post('/users/saved-searches', { name, filters }); alert('Search saved.'); }
  };
  return <><section className="hero"><div className="hero-inner"><div className="eyebrow">A BETTER WAY TO FIND HOME</div><h1>Find a place<br/><em>to call yours.</em></h1><p>Discover thoughtfully listed homes, apartments and plots — all in one place.</p>
    <div className="hero-stats"><div><b>Verified</b><span>Listing review</span></div><div><b>Smart search</b><span>Find your fit</span></div><div><b>Local</b><span>Map discovery</span></div></div>
  </div><div className="hero-image"><img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200" alt="Modern home exterior"/><div className="image-caption">Spaces that feel like home <span>↗</span></div></div></section>
  <main className="main-content"><section className="search-panel"><div className="search-heading"><div><span className="eyebrow dark">PROPERTY FINDER</span><h2>Explore listings</h2></div><div className="view-toggle"><button className={view==='grid'?'selected':''} onClick={()=>setView('grid')}>▦ Grid</button><button className={view==='map'?'selected':''} onClick={()=>setView('map')}>⌖ Map</button></div></div>
    <form className="filters" onSubmit={e=>{e.preventDefault();load();}}><label className="wide-field">Search location or keyword<input value={filters.q} onChange={e=>update('q',e.target.value)} placeholder="e.g. family home, DHA, garden..." /></label>
      <label>City<input value={filters.city} onChange={e=>update('city',e.target.value)} placeholder="Karachi"/></label>
      <label>Property type<select value={filters.type} onChange={e=>update('type',e.target.value)}><option value="">Any type</option>{['House','Apartment','Plot','Commercial'].map(x=><option key={x}>{x}</option>)}</select></label>
      <label>For<select value={filters.listingType} onChange={e=>update('listingType',e.target.value)}><option value="">Sale or rent</option><option>Sale</option><option>Rent</option></select></label>
      <label>Min price<input type="number" value={filters.minPrice} onChange={e=>update('minPrice',e.target.value)} placeholder="0"/></label>
      <label>Max price<input type="number" value={filters.maxPrice} onChange={e=>update('maxPrice',e.target.value)} placeholder="Any"/></label>
      <label>Min area<input type="number" value={filters.minArea} onChange={e=>update('minArea',e.target.value)} placeholder="Any"/></label>
      <label>Max area<input type="number" value={filters.maxArea} onChange={e=>update('maxArea',e.target.value)} placeholder="Any"/></label>
      <div className="filter-actions"><button className="btn btn-primary" type="submit">Search properties <span>→</span></button><button type="button" className="text-btn" onClick={()=>{setFilters(initial);load(initial);}}>Clear filters</button><button type="button" className="text-btn save-search" onClick={saveSearch}>♡ Save search</button></div>
    </form></section>
    <div className="results-heading"><div><span className="eyebrow dark">CURATED FOR YOU</span><h2>Properties to explore <span className="count">{properties.length}</span></h2></div><span className="muted">New opportunities, updated regularly</span></div>
    {error && <div className="notice">{error}</div>}{loading ? <div className="empty-state">Loading properties…</div> : view==='map' ? <MapView properties={properties}/> : properties.length ? <div className="property-grid">{properties.map(p=><PropertyCard key={p._id} property={p} onFavorite={favorite} isFavorite={favorites.includes(p._id)}/>)}</div> : <div className="empty-state"><div className="empty-icon">⌂</div><h3>No properties found</h3><p>Try changing your filters or check back soon for new listings.</p></div>}
  </main><footer className="footer">
  <Link to="/" className="brand">AH estate<span>hub</span></Link>
  <span>Find your next chapter.</span>
  <span>
    Developed by <strong>Ali Hasnain</strong> | <a href="https://github.com/aliarain143" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>GitHub</a>
  </span>
  <span>© {new Date().getFullYear()} AH estateHub. All rights reserved.</span>
</footer></>;
}
