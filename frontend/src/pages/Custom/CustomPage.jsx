import { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, X, Loader, RotateCcw, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { uploadImage } from '../../services/cloudinary';
import './CustomPage.css';

const VIEWS = ['Front', 'Back', 'Side'];
const API = 'http://localhost:8080';

// T-shirt images per view – put these in your /public folder
const TSHIRT_IMAGES = {
    Front: '/tshirt-front.jpg',
    Back: '/tshirt-back.jpg',
    Side: '/tshirt-front.jpg', // swap for a real side image when available
};

// Printable area as % of the canvas element (adjust to match your t-shirt images)
const PRINT_AREA = { top: 0.22, left: 0.28, width: 0.44, height: 0.45 };

export default function CustomPage() {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSub, setSelectedSub] = useState(null);
    const [activeView, setActiveView] = useState('Front');
    const [gsm, setGsm] = useState('GSM');
    const [material, setMaterial] = useState('Material');
    const [size, setSize] = useState('Size');
    const [color, setColor] = useState('Color');
    const [qty, setQty] = useState(1);
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    // Per-view design state
    const defaultDesign = () => ({ url: null, x: 0, y: 0, scale: 1, rotation: 0 });
    const [designs, setDesigns] = useState({
        Front: defaultDesign(), Back: defaultDesign(), Side: defaultDesign(),
    });

    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);
    const drag = useRef(null);

    const GSM_PRICES = { '180 GSM': 800, '200 GSM': 1000, '220 GSM': 1200 };
    const MATERIAL_PRICES = { Cotton: 500, Polyester: 300, Blend: 400 };
    const SIZE_PRICES = { XS: 0, S: 0, M: 100, L: 200, XL: 300, XXL: 400 };

    const unitPrice = (GSM_PRICES[gsm] || 0) + (MATERIAL_PRICES[material] || 0) + (SIZE_PRICES[size] || 0);
    const total = unitPrice * qty;

    const currentDesign = designs[activeView];
    const setCurrentDesign = (patch) =>
        setDesigns(d => ({
            ...d,
            [activeView]: { ...d[activeView], ...(typeof patch === 'function' ? patch(d[activeView]) : patch) },
        }));

    // ── Backend ────────────────────────────────────────────────────────────────
    useEffect(() => {
        fetch(`${API}/api/categories`)
            .then(r => r.json())
            .then(data => { setCategories(data); if (data.length) setSelectedCategory(data[0]); })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (!selectedCategory) return;
        fetch(`${API}/api/subcategories/${selectedCategory.categoryId}`)
            .then(r => r.json())
            .then(data => { setSubCategories(data); setSelectedSub(data[0] || null); })
            .catch(console.error);
    }, [selectedCategory]);

    // ── File upload ────────────────────────────────────────────────────────────
    async function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setUploadError(null);
        try {
            const url = await uploadImage(file);
            setCurrentDesign({ url, x: 0, y: 0, scale: 1, rotation: 0 });
        } catch (err) {
            setUploadError(err.message);
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    }

    function handleClearUpload() {
        setCurrentDesign({ url: null, x: 0, y: 0, scale: 1, rotation: 0 });
        setUploadError(null);
    }

    // ── Drag-to-move ───────────────────────────────────────────────────────────
    const onPointerDown = useCallback((e) => {
        if (!currentDesign.url) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        drag.current = { startX: e.clientX, startY: e.clientY, origX: currentDesign.x, origY: currentDesign.y };
    }, [currentDesign]);

    const onPointerMove = useCallback((e) => {
        if (!drag.current) return;
        setCurrentDesign({
            x: drag.current.origX + (e.clientX - drag.current.startX),
            y: drag.current.origY + (e.clientY - drag.current.startY),
        });
    }, []);

    const onPointerUp = useCallback(() => { drag.current = null; }, []);

    // ── Keyboard nudge ─────────────────────────────────────────────────────────
    useEffect(() => {
        function onKey(e) {
            if (!currentDesign.url) return;
            const step = e.shiftKey ? 10 : 2;
            const map = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
            if (map[e.key]) {
                e.preventDefault();
                const [dx, dy] = map[e.key];
                setCurrentDesign(d => ({ x: d.x + dx, y: d.y + dy }));
            }
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [currentDesign.url]);

    // ── Checkout ───────────────────────────────────────────────────────────────
    async function handleCheckout() {
        if (!selectedCategory) return alert('Please select a category');
        const anyDesign = Object.values(designs).find(d => d.url);
        if (!anyDesign) return alert('Please upload your design image first');
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
                designImageUrl: designs.Front.url || designs.Back.url || designs.Side.url,
                totalPrice: total,
            };
            const res = await fetch(`${API}/api/custom-orders`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order),
            });
            res.ok ? alert('Order placed successfully!') : alert('Failed to place order. Please try again.');
        } catch (err) {
            console.error(err);
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
                <img src="/hero-banner.jpg" alt="INKA hero" className="custom-hero__bg"
                    onError={e => { e.currentTarget.style.display = 'none'; }} />
                <div className="custom-hero__overlay" />
                <h1 className="custom-hero__title">INKA</h1>
            </section>

            <div className="custom-content">

                {/* Category */}
                <section className="custom-section">
                    <p className="custom-section__label">SELECT THE ITEM YOU WANT TO CUSTOMIZE</p>
                    <div className="category-grid">
                        {categories.map(cat => (
                            <button key={cat.categoryId}
                                className={`category-card ${selectedCategory?.categoryId === cat.categoryId ? 'category-card--active' : ''}`}
                                onClick={() => { setSelectedCategory(cat); setSelectedSub(null); }}>
                                <div className="category-card__img-placeholder" />
                                <span className="category-card__label">{cat.categoryName.toUpperCase()}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Sub-category */}
                <section className="custom-section">
                    <p className="custom-section__label">SUB-CATEGORY</p>
                    <div className="category-grid">
                        {subCategories.length > 0
                            ? subCategories.map(sub => (
                                <button key={sub.id}
                                    className={`subcategory-card ${selectedSub?.id === sub.id ? 'subcategory-card--active' : ''}`}
                                    onClick={() => setSelectedSub(sub)}>
                                    <div className="subcategory-card__img-placeholder" />
                                    <span className="subcategory-card__label">{sub.name.toUpperCase()}</span>
                                </button>
                            ))
                            : <p style={{ color: '#999', fontSize: '0.75rem' }}>No sub-categories available</p>
                        }
                    </div>
                </section>

                {/* ── Design canvas ── */}
                <section className="custom-canvas-section">

                    {/* View tabs */}
                    <div className="view-tabs">
                        {VIEWS.map(view => (
                            <button key={view}
                                className={`view-tab ${activeView === view ? 'view-tab--active' : ''}`}
                                onClick={() => setActiveView(view)}>
                                {view}
                                {designs[view].url && <span className="view-tab__dot" />}
                            </button>
                        ))}
                    </div>

                    {/* Canvas */}
                    <div className="custom-canvas" ref={canvasRef}
                        tabIndex={0}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        onPointerLeave={onPointerUp}>

                        <input ref={fileInputRef} type="file" accept="image/*"
                            style={{ display: 'none' }} onChange={handleFileChange} />

                        {/* T-shirt base */}
                        <img src={TSHIRT_IMAGES[activeView]} alt={`${activeView} view`}
                            className="canvas-tshirt-base" draggable={false}
                            onError={e => { e.currentTarget.style.display = 'none'; }} />

                        {/* Print-area guide */}
                        <div className="canvas-print-area" style={{
                            top: `${PRINT_AREA.top * 100}%`,
                            left: `${PRINT_AREA.left * 100}%`,
                            width: `${PRINT_AREA.width * 100}%`,
                            height: `${PRINT_AREA.height * 100}%`,
                        }} />

                        {/* User design */}
                        {currentDesign.url && (
                            <div className="canvas-design-overlay"
                                style={{
                                    top: `${PRINT_AREA.top * 100}%`,
                                    left: `${PRINT_AREA.left * 100}%`,
                                    width: `${PRINT_AREA.width * 100}%`,
                                    height: `${PRINT_AREA.height * 100}%`,
                                    cursor: 'grab',
                                }}
                                onPointerDown={onPointerDown}>
                                <img src={currentDesign.url} alt="Design"
                                    className="canvas-design-img"
                                    style={{
                                        transform: `translate(${currentDesign.x}px, ${currentDesign.y}px) scale(${currentDesign.scale}) rotate(${currentDesign.rotation}deg)`,
                                    }}
                                    draggable={false} />
                                <div className="design-drag-hint">
                                    <Move size={12} /> drag to move
                                </div>
                            </div>
                        )}

                        {/* Empty state */}
                        {!currentDesign.url && !uploading && (
                            <button className="canvas-drop-hint" onClick={() => fileInputRef.current?.click()}>
                                <Upload size={28} />
                                <span>Click to upload your design</span>
                                <span className="canvas-drop-sub">PNG with transparency works best</span>
                            </button>
                        )}

                        {uploading && (
                            <div className="canvas-uploading-overlay">
                                <Loader size={32} className="spin" />
                                <span>Uploading…</span>
                            </div>
                        )}

                        {uploadError && <p className="canvas-error">{uploadError}</p>}
                    </div>

                    {/* Toolbar */}
                    <div className="design-toolbar">
                        <div className="design-toolbar__left">
                            <button className="toolbar-btn toolbar-btn--primary"
                                onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                                <Upload size={14} />
                                {currentDesign.url ? 'Change' : 'Upload Design'}
                            </button>

                            {currentDesign.url && (
                                <>
                                    <div className="toolbar-group">
                                        <button className="toolbar-icon-btn" title="Zoom out"
                                            onClick={() => setCurrentDesign(d => ({ scale: Math.max(0.2, +(d.scale - 0.1).toFixed(2)) }))}>
                                            <ZoomOut size={14} />
                                        </button>
                                        <span className="toolbar-value">{Math.round(currentDesign.scale * 100)}%</span>
                                        <button className="toolbar-icon-btn" title="Zoom in"
                                            onClick={() => setCurrentDesign(d => ({ scale: Math.min(3, +(d.scale + 0.1).toFixed(2)) }))}>
                                            <ZoomIn size={14} />
                                        </button>
                                    </div>

                                    <div className="toolbar-group">
                                        <button className="toolbar-icon-btn" title="Rotate −15°"
                                            onClick={() => setCurrentDesign(d => ({ rotation: d.rotation - 15 }))}>
                                            <RotateCcw size={14} />
                                        </button>
                                        <span className="toolbar-value">{currentDesign.rotation}°</span>
                                        <button className="toolbar-icon-btn" title="Rotate +15°"
                                            onClick={() => setCurrentDesign(d => ({ rotation: d.rotation + 15 }))}>
                                            <RotateCcw size={14} style={{ transform: 'scaleX(-1)' }} />
                                        </button>
                                    </div>

                                    <button className="toolbar-text-btn"
                                        onClick={() => setCurrentDesign({ x: 0, y: 0, scale: 1, rotation: 0 })}>
                                        Reset
                                    </button>
                                </>
                            )}
                        </div>

                        {currentDesign.url && (
                            <button className="toolbar-btn toolbar-btn--danger" onClick={handleClearUpload}>
                                <X size={13} /> Remove
                            </button>
                        )}
                    </div>

                    <p className="canvas-disclaimer">
                        Drag to reposition · use toolbar to scale &amp; rotate · arrow keys to nudge
                    </p>
                </section>

                {/* Options */}
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

                {/* Checkout */}
                <div className="checkout-row">
                    <span className="checkout-total">Total: LKR {total.toLocaleString()}</span>
                    <button className="btn-checkout" onClick={handleCheckout} disabled={checkoutLoading}>
                        {checkoutLoading ? 'Placing Order...' : 'Checkout'}
                    </button>
                </div>

            </div>
        </div>
    );
}

function Select({ value, onChange, options, placeholder }) {
    return (
        <div className="custom-select-wrapper">
            <select className="custom-select"
                value={value === placeholder ? '' : value}
                onChange={e => onChange(e.target.value || placeholder)}>
                <option value="">{placeholder}</option>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <span className="custom-select-arrow">▾</span>
        </div>
    );
}