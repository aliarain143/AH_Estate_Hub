import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  
  // Apni email check ya admin role check
  const ADMIN_EMAIL = "aliarainah6@gmail.com";
  const isAdmin = user?.role === 'admin' || user?.email === ADMIN_EMAIL;

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-mark">AH</span> estate<span>hub</span>
      </Link>
      <nav>
        <NavLink to="/">Explore</NavLink>
        {user && <NavLink to="/favorites">Favorites</NavLink>}
        {isAdmin && <NavLink to="/add-property">Add Property</NavLink>}
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