import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PropertyDetail from './pages/PropertyDetail';
import Auth from './pages/Auth';
import Favorites from './pages/Favorites';
import Admin from './pages/Admin';
import { useAuth } from './context/AuthContext';

function Protected({ children, admin = false }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading AHestateHub…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/register" element={<Auth mode="register" />} />
        <Route path="/favorites" element={<Protected><Favorites /></Protected>} />
        
        {/* Admin route is now locked & protected again for admins only */}
        <Route path="/admin" element={<Protected admin><Admin /></Protected>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}