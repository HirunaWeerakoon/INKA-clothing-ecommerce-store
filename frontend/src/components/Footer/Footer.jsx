import { FaInstagram, FaTiktok } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p className="footer__text">follow us on social media</p>
      <div className="footer__socials">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="footer__social-link"
          aria-label="Instagram"
        >
          <FaInstagram size={28} />
        </a>
        <a
          href="https://tiktok.com"
          target="_blank"
          rel="noopener noreferrer"
          className="footer__social-link"
          aria-label="TikTok"
        >
          <FaTiktok size={26} />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
