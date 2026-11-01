import { useEffect, useState } from 'react';
import api from '../api';
import PropertyCard from '../components/PropertyCard';
export default function Favorites() {
  const [items,setItems]=useState([]);
  const load=()=>api.get('/users/favorites').then(r=>setItems(r.data.favorites)).catch(()=>setItems([]));
  useEffect(()=>{load();},[]);
  const remove=async id=>{await api.post(`/users/favorites/${id}`);load();};
  return <main className="page-shell"><span className="eyebrow dark">YOUR SHORTLIST</span><h1>Saved favorites</h1><p className="muted">The properties you have saved for later.</p>{items.length?<div className="property-grid">{items.map(p=><PropertyCard key={p._id} property={p} onFavorite={remove} isFavorite/>)}</div>:<div className="empty-state"><h3>No favorites yet</h3><p>Save a property from Explore and it will appear here.</p></div>}</main>;
}
