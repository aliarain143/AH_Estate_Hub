import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';

const markerIcon = new L.Icon({ iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png', iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] });
export default function MapView({ properties }) {
  const located = properties.filter(p => p.coordinates?.lat && p.coordinates?.lng);
  return <div className="map-wrap"><MapContainer center={[24.8607, 67.0011]} zoom={11} scrollWheelZoom className="map">
    <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    {located.map(p => <Marker key={p._id} position={[p.coordinates.lat, p.coordinates.lng]} icon={markerIcon}><Popup><b>{p.title}</b><br/>PKR {Number(p.price).toLocaleString('en-PK')}<br/><Link to={`/property/${p._id}`}>View details</Link></Popup></Marker>)}
  </MapContainer>{located.length === 0 && <div className="map-note">No listings have map coordinates yet. Add latitude and longitude when creating a listing.</div>}</div>;
}
