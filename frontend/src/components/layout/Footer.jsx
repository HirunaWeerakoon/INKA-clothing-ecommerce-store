import { Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="footer-container">
            <p>follow us on social media</p>
            <div className="footer-socials">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <Instagram size={24} />
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a5 5 0 0 1-5-5v8a8 8 0 1 1-8-8v3a4 4 0 0 0 4 4z"></path>
                    </svg>
                </a>
            </div>
        </footer>
    );
}
