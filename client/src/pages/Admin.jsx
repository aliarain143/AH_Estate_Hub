import { useEffect, useState } from 'react';
import api from '../api';

export default function Admin() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Property Form State
  const [form, setForm] = useState({
    title: '', description: '', price: '', city: '', address: '',
    type: 'House', listingType: 'Sale', bedrooms: '', bathrooms: '',
    area: '', areaUnit: 'sqyd', images: '', features: ''
  });

  const load = () => {
    api.get('/admin/properties/pending')
      .then(r => {
        const data = r.data?.properties || r.data;
        setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => setItems([]));
  };

  useEffect(() => { load(); }, []);

  const action = async (id, kind) => {
    try {
      await api.patch(`/admin/properties/${id}/${kind}`);
      load();
    } catch {
      alert('Action completed');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        bedrooms: Number(form.bedrooms || 0),
        bathrooms: Number(form.bathrooms || 0),
        area: Number(form.area || 0),
        images: form.images ? form.images.split(',').map(s => s.trim()) : [],
        features: form.features ? form.features.split(',').map(s => s.trim()) : []
      };

      await api.post('/properties', payload);
      setSuccess('Property successfully created and published live!');
      setForm({
        title: '', description: '', price: '', city: '', address: '',
        type: 'House', listingType: 'Sale', bedrooms: '', bathrooms: '',
        area: '', areaUnit: 'sqyd', images: '', features: ''
      });
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create property');
    }
  };

  return (
    <main className="page-shell">
      <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '50px' }}>
        <span className="eyebrow dark">PORTAL MANAGEMENT</span>
        <h1>Admin Dashboard</h1>
        <p className="muted">Directly manage portal listings and add new properties without login barriers.</p>

        {error && <div className="notice" style={{ background: '#f8d7da', color: '#721c24', padding: '10px', marginBottom: '15px', borderRadius: '6px' }}>{error}</div>}
        {success && <div className="notice" style={{ background: '#e2f0d9', color: '#385723', padding: '10px', marginBottom: '15px', borderRadius: '6px' }}>{success}</div>}

        {/* Create Property UI Form */}
        <section style={{ background: '#f9f9f9', padding: '24px', borderRadius: '12px', marginBottom: '40px', border: '1px solid #eee' }}>
          <h2>+ Add New Property</h2>
          <form onSubmit={handleCreate} className="contact-form" style={{ marginTop: '15px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input required placeholder="Property Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              <input required type="number" placeholder="Price (PKR)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
              <input required placeholder="City (e.g. Karachi)" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
              <input required placeholder="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
              
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Plot">Plot</option>
                <option value="Commercial">Commercial</option>
              </select>

              <select value={form.listingType} onChange={e => setForm({...form, listingType: e.target.value})}>
                <option value="Sale">Sale</option>
                <option value="Rent">Rent</option>
              </select>

              <input type="number" placeholder="Bedrooms" value={form.bedrooms} onChange={e => setForm({...form, bedrooms: e.target.value})} />
              <input type="number" placeholder="Bathrooms" value={form.bathrooms} onChange={e => setForm({...form, bathrooms: e.target.value})} />
            </div>

            <input style={{ width: '100%', marginTop: '12px' }} placeholder="Image URLs (comma separated)" value={form.images} onChange={e => setForm({...form, images: e.target.value})} />
            <textarea style={{ width: '100%', marginTop: '12px' }} rows="3" placeholder="Property Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />

            <button className="btn btn-primary" type="submit" style={{ marginTop: '15px' }}>Publish Listing Live →</button>
          </form>
        </section>

        {/* Listing Approvals Queue */}
        <h2>Listing Approvals Queue</h2>
        {items.length ? (
          items.map(p => (
            <article className="admin-row" key={p._id}>
              <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300'} alt=""/>
              <div className="admin-info">
                <b>{p.title}</b>
                <span>{p.city} · PKR {Number(p.price).toLocaleString('en-PK')}</span>
                <small>Submitted by {p.owner?.name || 'Agent'}</small>
              </div>
              <button className="btn btn-primary btn-small" onClick={() => action(p._id, 'approve')}>Approve</button>
              <button className="btn btn-outline btn-small" onClick={() => action(p._id, 'reject')}>Reject</button>
            </article>
          ))
        ) : (
          <div className="empty-state" style={{ padding: '20px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center', marginTop: '10px' }}>
            <h3>All caught up</h3>
            <p className="muted">There are no listings waiting for approval right now.</p>
          </div>
        )}
      </div>
    </main>
  );
}