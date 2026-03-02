import { Link, NavLink } from 'react-router-dom';
import { FiSearch, FiUser, FiShoppingCart } from 'react-icons/fi';
import './Navbar.css';

function Navbar() {
  return (
    <header className="navbar">
      {/* Logo */}
      <Link to="/" className="navbar__logo">INKA</Link>

      {/* Navigation Links */}
      <nav className="navbar__nav">
        <NavLink to="/" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'} end>
          HOME
        </NavLink>
        <NavLink to="/shop" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>
          SHOP
        </NavLink>
        <NavLink to="/custom" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>
          CUSTOM
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>
          ABOUT
        </NavLink>
      </nav>

      {/* Action Icons */}
      <div className="navbar__actions">
        <button className="navbar__icon-btn" aria-label="Search">
          <FiSearch size={20} />
        </button>
        <button className="navbar__icon-btn" aria-label="Account">
          <FiUser size={20} />
        </button>
        <button className="navbar__icon-btn" aria-label="Cart">
          <FiShoppingCart size={20} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
