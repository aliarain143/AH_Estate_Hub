import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  
  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-mark">AH</span> estate<span>hub</span>
      </Link>
      <nav>
        <NavLink to="/">Explore</NavLink>
        {user && <NavLink to="/favorites">Favorites</NavLink>}
        
        {/* Admin Dashboard / Add Property Direct Link for Quick Review */}
        <NavLink to="/admin" style={{ fontWeight: 'bold', color: '#166534' }}>
          Admin Dashboard
        </NavLink>
      </nav>
      <div className="nav-actions">
        {user ? (
          <>
            <span className="welcome">Hi, {user.name.split(' ')[0]}</span>
            <button className="btn btn-outline btn-small" onClick={logout}>Log out</button>
          </>
        ) : (
          <>
            <Link className="login-link" to="/login">Log in</Link>
            <Link className="btn btn-primary btn-small" to="/register">Join free</Link>
          </>
        )}
      </div>
    </header>
  );
}