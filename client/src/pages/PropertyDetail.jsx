import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function PropertyDetail() {
  const { id } = useParams(); 
  const { user } = useAuth();
  const [property, setProperty] = useState(null); 
  const [photo, setPhoto] = useState(0);
  const [form, setForm] = useState({ 
    name: user?.name || '', 
    email: user?.email || '', 
    phone: '', 
    message: 'Hi, I am interested in this property. Please share more details.' 
  });
  const [notice, setNotice] = useState('');

  useEffect(() => { 
    api.get(`/properties/${id}`)
      .then(r => {
        const prop = r.data?.property || r.data;
        setProperty(prop);
      })
      .catch(() => setNotice('This property could not be found.')); 
  }, [id]);

  useEffect(() => { 
    if (user) {
      setForm(f => ({ ...f, name: user.name, email: user.email }));
    }
  }, [user]);

  const send = async (e) => { 
    e.preventDefault(); 
    try { 
      await api.post('/inquiries', { ...form, propertyId: id }); 
      setNotice('Your inquiry has been sent to the agent.'); 
    } catch (e) { 
      setNotice(e.response?.data?.message || 'Could not send inquiry.'); 
    } 
  };

  if (!property) return (
    <main className="page-shell">
      <Link to="/">← Back to listings</Link>
      <p>{notice || 'Loading property…'}</p>
    </main>
  );

  const images = property.images?.length ? property.images : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200'];

  return (
    <main className="page-shell">
      <Link to="/" className="back-link">← Back to listings</Link>
      <div className="detail-layout">
        <section>
          <div className="detail-main-photo">
            <img src={images[photo]} alt={property.title}/>
          </div>
          <div className="thumb-row">
            {images.map((img, i) => (
              <button key={img + i} className={photo === i ? 'chosen' : ''} onClick={() => setPhoto(i)}>
                <img src={img} alt={`Property ${i + 1}`}/>
              </button>
            ))}
          </div>
          
          <div className="detail-copy">
            <span className="eyebrow dark">{property.listingType} · {property.type}</span>
            <h1>{property.title}</h1>
            <p className="muted">{property.address}, {property.city}</p>
            <div className="detail-facts">
              <span>{property.area} {property.areaUnit}</span>
              <span>{property.bedrooms} bedrooms</span>
              <span>{property.bathrooms} bathrooms</span>
            </div>
            <h2>About this property</h2>
            <p className="description">{property.description}</p>
            {property.features?.length > 0 && (
              <>
                <h2>Features</h2>
                <div className="feature-list">
                  {property.features.map(x => <span key={x}>✓ {x}</span>)}
                </div>
              </>
            )}
          </div>
        </section>
        
        <aside className="contact-card">
          <span className="eyebrow dark">PROPERTY PRICE</span>
          <div className="detail-price">PKR {Number(property.price || 0).toLocaleString('en-PK')}</div>
          <div className="agent-block">
            <div className="agent-avatar">{property.owner?.name?.[0] || 'A'}</div>
            <div>
              <b>{property.owner?.name || 'Property agent'}</b>
              <small>Listing contact</small>
            </div>
          </div>
          <h3>Interested in this property?</h3>
          <p className="muted">Send a message and the agent can get back to you.</p>
          {notice && <div className="notice">{notice}</div>}
          <form className="contact-form" onSubmit={send}>
            <input required placeholder="Your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>
            <input required type="email" placeholder="Email address" value={form.email} onChange={e => setForm({...form, email: e.target.value})}/>
            <input placeholder="Phone number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}/>
            <textarea required rows="4" value={form.message} onChange={e => setForm({...form, message: e.target.value})}/>
            <button className="btn btn-primary" type="submit">Send inquiry →</button>
          </form>
        </aside>
      </div>
    </main>
  );
}