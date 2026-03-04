import { Search, User, ShoppingCart, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function Header({ onCartOpen }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // Check authentication status and role
  const isAuthenticated = authService.isAuthenticated();
  const userDetails = authService.getUserDetails();
  const isAdmin = userDetails && userDetails.role === 'ADMIN';

  const handleLogin = () => {
    // Redirect to Spring Boot Google OAuth2 login endpoint
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const handleLogout = () => {
    authService.removeToken();
    window.location.href = '/';
  };

  return (
    <header className="header-container">
      <div className="header-logo">
        <Link to="/">INKA</Link>
      </div>
      <nav className="header-nav">
        <Link to="/" className={isActive('/') ? 'active' : ''}>HOME</Link>
        <Link to="/shop" className={isActive('/shop') ? 'active' : ''}>SHOP</Link>
        <Link to="/custom" className={isActive('/custom') ? 'active' : ''}>CUSTOM</Link>
        <Link to="/about" className={isActive('/about') ? 'active' : ''}>ABOUT</Link>
        {isAdmin && (
          <Link to="/admin" className={isActive('/admin') ? 'active' : ''}>DASHBOARD</Link>
        )}
      </nav>
      <div className="header-actions">
        <button aria-label="Search"><Search size={24} /></button>

        {isAuthenticated ? (
          <Link to="/account" aria-label="User Account" className={isActive('/account') ? 'active-icon' : ''}>
            <User size={24} />
          </Link>
        ) : (
          <button aria-label="Login" onClick={handleLogin} title="Login with Google">
            <User size={24} />
          </button>
        )}

        <button aria-label="Shopping Cart" onClick={onCartOpen}>
          <ShoppingCart size={24} />
        </button>
      </div>
    </header>
  );
}
