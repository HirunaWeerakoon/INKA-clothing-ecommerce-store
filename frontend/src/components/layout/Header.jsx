import { Search, User, ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

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
      </nav>
      <div className="header-actions">
        <button aria-label="Search"><Search size={24} /></button>
        <Link to="/account" aria-label="User Account" className={isActive('/account') ? 'active-icon' : ''}><User size={24} /></Link>
        <Link to="/cart" aria-label="Shopping Cart"><ShoppingCart size={24} /></Link>
      </div>
    </header>
  );
}
