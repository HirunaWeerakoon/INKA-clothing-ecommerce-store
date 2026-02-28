import { Link } from 'react-router-dom';
import './HeroSection.css';

function HeroSection() {
  return (
    <section className="hero">
      {/* Left content */}
      <div className="hero__content">
        <h1 className="hero__headline">
          PRINT YOUR STYLE.<br />
          WE PRINT THE ATTITUDE.
        </h1>
        <p className="hero__sub">
          Premium custom t-shirt printing for brands,<br />events &amp; creators
        </p>
        <div className="hero__actions">
          <Link to="/shop" className="btn btn--filled">SHOP NOW</Link>
          <Link to="/custom" className="btn btn--outline">CUSTOM PRINT</Link>
        </div>
      </div>

      {/* Right image */}
      <div className="hero__image-wrapper">
        <img
          src="/hero-banner.jpg"
          alt="INKA hero banner"
          className="hero__image"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        <div className="hero__image-placeholder" aria-hidden="true" />
      </div>
    </section>
  );
}

export default HeroSection;
