import { useEffect, useState } from 'react';
import api from '../api';
export default function Admin() {
  const [items,setItems]=useState([]); const [error,setError]=useState('');
  const load=()=>api.get('/admin/properties/pending').then(r=>setItems(r.data.properties)).catch(e=>setError(e.response?.data?.message||'Unable to load admin queue'));
  useEffect(()=>{load();},[]);
  const action=async(id,kind)=>{await api.patch(`/admin/properties/${id}/${kind}`);load();};
  return <main className="page-shell"><span className="eyebrow dark">PORTAL MANAGEMENT</span><h1>Listing approvals</h1><p className="muted">Review agent-submitted properties before they appear publicly.</p>{error&&<div className="notice">{error}</div>}{items.length?items.map(p=><article className="admin-row" key={p._id}><img src={p.images?.[0]||'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300'} alt=""/><div className="admin-info"><b>{p.title}</b><span>{p.city} · PKR {Number(p.price).toLocaleString('en-PK')}</span><small>Submitted by {p.owner?.name}</small></div><button className="btn btn-primary btn-small" onClick={()=>action(p._id,'approve')}>Approve</button><button className="btn btn-outline btn-small" onClick={()=>action(p._id,'reject')}>Reject</button></article>):!error&&<div className="empty-state"><h3>All caught up</h3><p>There are no listings waiting for approval.</p></div>}</main>;
}
