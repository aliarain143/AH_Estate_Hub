import { Link } from 'react-router-dom';
export default function PropertyCard({ property, onFavorite, isFavorite }) {
  const photo = property.images?.[0] || 'https://images.unsplash.com/photo-160059	osomething';
  return <article className="property-card">
    <div className="card-photo"><img src={photo.includes('something') ? 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900' : photo} alt={property.title} />
      <span className="photo-tag">{property.listingType || 'Sale'}</span>
      <button className={`favorite-btn ${isFavorite ? 'active' : ''}`} aria-label="Toggle favorite" onClick={() => onFavorite?.(property._id)}>{isFavorite ? '♥' : '♡'}</button>
    </div>
    <div className="card-content"><div className="price">PKR {Number(property.price).toLocaleString('en-PK')}</div><Link to={`/property/${property._id}`} className="property-title">{property.title}</Link>
      <p className="muted">{property.address}, {property.city}</p><div className="property-meta"><span>▦ {property.area} {property.areaUnit}</span><span>▣ {property.bedrooms} beds</span><span>◫ {property.bathrooms} baths</span></div>
    </div>
  </article>;
}
