import { useState, useRef } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import { uploadImage } from '../../services/cloudinary';
import './CustomPage.css';

// ── Category data ──────────────────────────────────────────────────────────────
const CATEGORIES = [
    { id: 'tshirts', label: 'T-SHIRTS' },
    { id: 'denims', label: 'DENIMS' },
    { id: 'totebags', label: 'TOTE BAGS' },
];

const SUB_CATEGORIES = {
    tshirts: ['Crew Neck', 'V-Neck', 'Polo'],
    denims: ['Slim Fit', 'Regular', 'Wide Leg'],
    totebags: ['Small', 'Medium', 'Large'],
};

const VIEWS = ['front', 'Back', 'Side'];

export default function CustomPage() {
    const [selectedCategory, setSelectedCategory] = useState('tshirts');
    const [selectedSub, setSelectedSub] = useState(0);
    const [activeView, setActiveView] = useState('front');

    // Dropdown state
    const [gsm, setGsm] = useState('GSM');
    const [material, setMaterial] = useState('Material');
    const [size, setSize] = useState('Size');
    const [color, setColor] = useState('Color');
    const [qty, setQty] = useState(1);

    // Upload state
    const [uploadedUrl, setUploadedUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const fileInputRef = useRef(null);

    const unitPrice = 1234;
    const total = unitPrice * qty;

    // ── Cloudinary unsigned upload ───────────────────────────────────────────────
    async function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadError(null);
        setUploadedUrl(null);

        try {
            const url = await uploadImage(file);
            setUploadedUrl(url);
        } catch (err) {
            setUploadError(err.message);
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    }

    function handleClearUpload() {
        setUploadedUrl(null);
        setUploadError(null);
    }

    return (
        <div className="custom-page">

            {/* ── Hero Banner ──────────────────────────────────────────────────── */}
            <section className="custom-hero">
                <h1 className="custom-hero__title">INKA</h1>
                <div className="custom-hero__overlay" />
            </section>

            {/* ── Main content ─────────────────────────────────────────────────── */}
            <div className="custom-content">

                {/* Category selector */}
                <section className="custom-section">
                    <p className="custom-section__label">SELECT THE ITEM YOU WANT TO CUSTOMIZE</p>
                    <div className="category-grid">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                className={`category-card ${selectedCategory === cat.id ? 'category-card--active' : ''}`}
                                onClick={() => { setSelectedCategory(cat.id); setSelectedSub(0); }}
                            >
                                <div className="category-card__img-placeholder" />
                                <span className="category-card__label">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Sub‑category selector */}
                <section className="custom-section">
                    <p className="custom-section__label">SUB-CATEGORY</p>
                    <div className="category-grid">
                        {(SUB_CATEGORIES[selectedCategory] || []).map((sub, idx) => (
                            <button
                                key={sub}
                                className={`subcategory-card ${selectedSub === idx ? 'subcategory-card--active' : ''}`}
                                onClick={() => setSelectedSub(idx)}
                            >
                                <div className="subcategory-card__img-placeholder" />
                                <span className="subcategory-card__label">{sub}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Design canvas */}
                <section className="custom-canvas-section">
                    <div className="custom-canvas">

                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />

                        {/* Upload / clear button */}
                        {uploadedUrl ? (
                            <button
                                className="canvas-upload-btn canvas-upload-btn--clear"
                                aria-label="Remove design"
                                onClick={handleClearUpload}
                            >
                                <X size={18} />
                            </button>
                        ) : (
                            <button
                                className="canvas-upload-btn"
                                aria-label="Upload design"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                            >
                                {uploading ? <Loader size={18} className="spin" /> : <Upload size={18} />}
                            </button>
                        )}

                        {/* Canvas preview */}
                        <div className="canvas-preview-area">
                            {uploading && (
                                <div className="canvas-uploading-overlay">
                                    <Loader size={32} className="spin" />
                                    <span>Uploading…</span>
                                </div>
                            )}
                            {uploadedUrl && !uploading && (
                                <img
                                    src={uploadedUrl}
                                    alt="Uploaded design"
                                    className="canvas-uploaded-img"
                                />
                            )}
                            {!uploadedUrl && !uploading && (
                                <button
                                    className="canvas-drop-hint"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload size={24} />
                                    <span>Click to upload your design</span>
                                </button>
                            )}
                        </div>

                        {uploadError && (
                            <p className="canvas-error">{uploadError}</p>
                        )}
                    </div>

                    {/* View selectors */}
                    <div className="view-tabs">
                        {VIEWS.map((view) => (
                            <button
                                key={view}
                                className={`view-tab ${activeView === view ? 'view-tab--active' : ''}`}
                                onClick={() => setActiveView(view)}
                            >
                                {view}
                            </button>
                        ))}
                    </div>
                    <p className="canvas-disclaimer">
                        *We recommend you to use a desktop/laptop instead of mobile phone for better result
                    </p>
                </section>

                {/* Options row */}
                <section className="options-row">
                    <p className="options-row__label">Type</p>
                    <div className="options-dropdowns">
                        <Select value={gsm} onChange={setGsm} options={['180 GSM', '200 GSM', '220 GSM']} placeholder="GSM" />
                        <Select value={material} onChange={setMaterial} options={['Cotton', 'Polyester', 'Blend']} placeholder="Material" />
                        <Select value={size} onChange={setSize} options={['XS', 'S', 'M', 'L', 'XL', 'XXL']} placeholder="Size" />
                        <Select value={color} onChange={setColor} options={['Black', 'White', 'Navy', 'Grey']} placeholder="Color" />
                        <div className="qty-control">
                            <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                            <span>{qty}</span>
                            <button onClick={() => setQty(q => q + 1)}>+</button>
                            <span className="qty-label">Qty</span>
                        </div>
                    </div>
                </section>

                {/* Checkout row */}
                <div className="checkout-row">
                    <span className="checkout-total">Total: LKR {total.toLocaleString()}</span>
                    <button className="btn-checkout">Checkout</button>
                </div>
            </div>
        </div>
    );
}

/* ── Tiny reusable Select ──────────────────────────────────────────────────── */
function Select({ value, onChange, options, placeholder }) {
    return (
        <div className="custom-select-wrapper">
            <select
                className="custom-select"
                value={value === placeholder ? '' : value}
                onChange={(e) => onChange(e.target.value || placeholder)}
            >
                <option value="">{placeholder}</option>
                {options.map((o) => (
                    <option key={o} value={o}>{o}</option>
                ))}
            </select>
            <span className="custom-select-arrow">▾</span>
        </div>
    );
}
