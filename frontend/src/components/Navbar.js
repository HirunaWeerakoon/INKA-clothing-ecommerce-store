import React from 'react';
import { AiOutlineSearch, AiOutlineUser, AiOutlineShopping } from 'react-icons/ai';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <a href="/" className="navbar-logo">INKA</a>
      <div className="navbar-links">
        <a href="/" className="nav-link active">HOME</a>
        <a href="/shop" className="nav-link">SHOP</a>
        <a href="/custom" className="nav-link">CUSTOM</a>
        <a href="/about" className="nav-link">ABOUT</a>
      </div>
      <div className="navbar-icons">
        <AiOutlineSearch size={20} />
        <AiOutlineUser size={20} />
        <AiOutlineShopping size={20} />
      </div>
    </nav>
  );
}

export default Navbar;