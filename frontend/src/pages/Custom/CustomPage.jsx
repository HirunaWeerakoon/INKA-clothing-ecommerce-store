import { useState, useRef, useEffect } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import { uploadImage } from '../../services/cloudinary';
import './CustomPage.css';

const VIEWS = ['front', 'Back', 'Side'];
const API = 'http://localhost:8080';

export default function CustomPage() {

    // ── State ──────────────────────────────────────────────────────────────────
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSub, setSelectedSub] = useState(null);
    const [activeView, setActiveView] = useState('front');
    const [gsm, setGsm] = useState('GSM');
    const [material, setMaterial] = useState('Material');
    const [size, setSize] = useState('Size');
    const [color, setColor] = useState('Color');
    const [qty, setQty] = useState(1);
    const [uploadedUrl, setUploadedUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const fileInputRef = useRef(null);

    const GSM_PRICES = {
        '180 GSM': 800,
        '200 GSM': 1000,
        '220 GSM': 1200,
    };

    const MATERIAL_PRICES = {
        'Cotton': 500,
        'Polyester': 300,
        'Blend': 400,
    };

    const SIZE_PRICES = {
        'XS': 0,
        'S': 0,
        'M': 100,
        'L': 200,
        'XL': 300,
        'XXL': 400,
    };

    const unitPrice =
        (GSM_PRICES[gsm] || 0) +
        (MATERIAL_PRICES[material] || 0) +
        (SIZE_PRICES[size] || 0);

    const total = unitPrice * qty;

    // ── Load categories from backend ───────────────────────────────────────────
    useEffect(() => {
        fetch(`${API}/api/categories`)
            .then(res => res.json())
            .then(data => {
                console.log('Categories data:', data); // ADD THIS
                setCategories(data);
                if (data.length > 0) {
                    setSelectedCategory(data[0]);
                    console.log('First category:', data[0]); // ADD THIS
                }
            })
            .catch(err => console.error('Failed to load categories:', err));
    }, []);

    // ── Load sub-categories when category changes ──────────────────────────────
    useEffect(() => {
        if (!selectedCategory) return;
        fetch(`${API}/api/subcategories/${selectedCategory.categoryId}`)
            .then(res => res.json())
            .then(data => {
                setSubCategories(data);
                if (data.length > 0) setSelectedSub(data[0]);
                else setSelectedSub(null);
            })
            .catch(err => console.error('Failed to load subcategories:', err));
    }, [selectedCategory]);

    // ── Image upload to Cloudinary ─────────────────────────────────────────────
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

    // ── Checkout — save order + Cloudinary URL to backend ─────────────────────
    async function handleCheckout() {
        if (!selectedCategory) {
            alert('Please select a category');
            return;
        }
        if (!uploadedUrl) {
            alert('Please upload your design image first');
            return;
        }

        setCheckoutLoading(true);
        try {
            const order = {
                customerId: 1,
                categoryName: selectedCategory.categoryName,
                subCategoryName: selectedSub?.name || '',
                gsm: gsm === 'GSM' ? '' : gsm,
                material: material === 'Material' ? '' : material,
                size: size === 'Size' ? '' : size,
                color: color === 'Color' ? '' : color,
                quantity: qty,
                designImageUrl: uploadedUrl,
                totalPrice: total,
            };

            const res = await fetch(`${API}/api/custom-orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order),
            });

            if (res.ok) {
                alert('Order placed successfully!');
            } else {
                alert('Failed to place order. Please try again.');
            }
        } catch (err) {
            console.error('Checkout error:', err);
            alert('Something went wrong. Please try again.');
        } finally {
            setCheckoutLoading(false);
        }
    }

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="custom-page">

            {/* Hero */}
            <section className="custom-hero">
                <h1 className="custom-hero__title">INKA</h1>
                <div className="custom-hero__overlay" />
            </section>

            <div className="custom-content">

                {/* Category selector */}
                <section className="custom-section">
                    <p className="custom-section__label">
                        SELECT THE ITEM YOU WANT TO CUSTOMIZE
                    </p>
                    <div className="category-grid">
                        {categories.map((cat) => (
                            <button
                                key={cat.categoryId}
                                className={`category-card ${selectedCategory?.categoryId === cat.categoryId ? 'category-card--active' : ''}`}
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    setSelectedSub(null);
                                }}
                            >
                                <div className="category-card__img-placeholder" />
                                <span className="category-card__label">
                                    {cat.categoryName.toUpperCase()}
                                </span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Sub-category selector */}
                <section className="custom-section">
                    <p className="custom-section__label">SUB-CATEGORY</p>
                    <div className="category-grid">
                        {subCategories.length > 0 ? (
                            subCategories.map((sub) => (
                                <button
                                    key={sub.id}
                                    className={`subcategory-card ${selectedSub?.id === sub.id ? 'subcategory-card--active' : ''}`}
                                    onClick={() => setSelectedSub(sub)}
                                >
                                    <div className="subcategory-card__img-placeholder" />
                                    <span className="subcategory-card__label">
                                        {sub.name.toUpperCase()}
                                    </span>
                                </button>
                            ))
                        ) : (
                            <p style={{ color: '#999', fontSize: '0.75rem' }}>
                                No sub-categories available
                            </p>
                        )}
                    </div>
                </section>

                {/* Design canvas */}
                <section className="custom-canvas-section">
                    <div className="custom-canvas">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
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
                                {uploading
                                    ? <Loader size={18} className="spin" />
                                    : <Upload size={18} />}
                            </button>
                        )}
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

                    {/* View tabs */}
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
                        *We recommend you to use a desktop/laptop instead of
                        mobile phone for better result
                    </p>
                </section>

                {/* Options */}
                <section className="options-row">
                    <p className="options-row__label">Type</p>
                    <div className="options-dropdowns">
                        <Select
                            value={gsm}
                            onChange={setGsm}
                            options={['180 GSM', '200 GSM', '220 GSM']}
                            placeholder="GSM"
                        />
                        <Select
                            value={material}
                            onChange={setMaterial}
                            options={['Cotton', 'Polyester', 'Blend']}
                            placeholder="Material"
                        />
                        <Select
                            value={size}
                            onChange={setSize}
                            options={['XS', 'S', 'M', 'L', 'XL', 'XXL']}
                            placeholder="Size"
                        />
                        <Select
                            value={color}
                            onChange={setColor}
                            options={['Black', 'White', 'Navy', 'Grey']}
                            placeholder="Color"
                        />
                        <div className="qty-control">
                            <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                            <span>{qty}</span>
                            <button onClick={() => setQty(q => q + 1)}>+</button>
                            <span className="qty-label">Qty</span>
                        </div>
                    </div>
                </section>

                {/* Checkout */}
                <div className="checkout-row">
                    <span className="checkout-total">
                        Total: LKR {total.toLocaleString()}
                    </span>
                    <button
                        className="btn-checkout"
                        onClick={handleCheckout}
                        disabled={checkoutLoading}
                    >
                        {checkoutLoading ? 'Placing Order...' : 'Checkout'}
                    </button>
                </div>

            </div>
        </div>
    );
}

/* Reusable Select */
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