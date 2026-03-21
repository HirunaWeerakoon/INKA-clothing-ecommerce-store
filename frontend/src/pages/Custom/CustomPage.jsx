import { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, X, Loader, RotateCcw, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { uploadImage } from '../../services/cloudinary';
import './CustomPage.css';

const API = 'http://localhost:8080';

const CATEGORY_CONFIG = {
    'T-SHIRTS': {
        views: ['Front', 'Back', 'Side'],
        images: {
            Front: '/tshirt-front.jpg',
            Back: '/tshirt-back.jpg',
            Side: '/tshirt-side.png',
        },
        printArea: { top: 0.22, left: 0.28, width: 0.44, height: 0.45 },
        thumbnail: '/category-tshirt.jpg',
        customizable: true,
    },
    'DENIMS': {
        views: ['Front', 'Back'],
        images: {
            Front: '/denim-front.png',
            Back: '/denim-back.png',
        },
        printArea: { top: 0.25, left: 0.30, width: 0.40, height: 0.35 },
        thumbnail: '/category-denim.jpg',
        customizable: true,
    },
    'TOTE BAGS': {
        views: ['Front'],
        images: {
            Front: '/tote-front.png',
        },
        printArea: { top: 0.38, left: 0.18, width: 0.64, height: 0.42 },
        thumbnail: '/category-tote.jpg',
        customizable: true,
    },
    'ACCESSORIES': {
        views: [],
        images: {},
        printArea: { top: 0, left: 0, width: 0, height: 0 },
        thumbnail: '/category-accessories.jpg',
        customizable: false,
    },
};

const DEFAULT_CONFIG = {
    views: ['Front', 'Back'],
    images: {
        Front: '/tshirt-front.jpg',
        Back: '/tshirt-back.jpg',
    },
    printArea: { top: 0.22, left: 0.28, width: 0.44, height: 0.45 },
    thumbnail: null,
};

function getCategoryConfig(categoryName) {
    if (!categoryName) return DEFAULT_CONFIG;
    const key = categoryName.toUpperCase();
    return CATEGORY_CONFIG[key] || DEFAULT_CONFIG;
}

const defaultDesign = () => ({ url: null, x: 0, y: 0, scale: 1, rotation: 0 });

function buildDesigns(views) {
    return Object.fromEntries(views.map(v => [v, defaultDesign()]));
}

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
    const [designs, setDesigns] = useState(buildDesigns(['Front', 'Back', 'Side']));
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);
    const drag = useRef(null);

    const config = getCategoryConfig(selectedCategory?.categoryName);
    const { views, images: tshirtImages, printArea: PRINT_AREA } = config;

    const GSM_PRICES = { '180 GSM': 800, '200 GSM': 1000, '220 GSM': 1200 };
    const MATERIAL_PRICES = { Cotton: 500, Polyester: 300, Blend: 400 };
    const SIZE_PRICES = { XS: 0, S: 0, M: 100, L: 200, XL: 300, XXL: 400 };

    const unitPrice = (GSM_PRICES[gsm] || 0) + (MATERIAL_PRICES[material] || 0) + (SIZE_PRICES[size] || 0);
    const total = unitPrice * qty;

    const currentDesign = designs[activeView] || defaultDesign();
    const setCurrentDesign = (patch) =>
        setDesigns(d => ({
            ...d,
            [activeView]: {
                ...d[activeView],
                ...(typeof patch === 'function' ? patch(d[activeView]) : patch),
            },
        }));

    useEffect(() => {
        if (!selectedCategory) return;
        const cfg = getCategoryConfig(selectedCategory.categoryName);
        setDesigns(buildDesigns(cfg.views));
        setActiveView(cfg.views[0]);
        // Reset all options back to defaults
        setGsm('GSM');
        setMaterial('Material');
        setSize('Size');
        setColor('Color');
        setQty(1);
    }, [selectedCategory]);

    useEffect(() => {
        fetch(`${API}/api/categories`)
            .then(r => r.json())
            .then(data => {
                setCategories(data);
                if (data.length) setSelectedCategory(data[0]);
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (!selectedCategory) return;
        fetch(`${API}/api/subcategories/${selectedCategory.categoryId}`)
            .then(r => r.json())
            .then(data => { setSubCategories(data); setSelectedSub(data[0] || null); })
            .catch(console.error);
    }, [selectedCategory]);

    async function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadError(null);

        // Show local preview instantly — no waiting
        const localUrl = URL.createObjectURL(file);
        setCurrentDesign({ url: localUrl, x: 0, y: 0, scale: 1, rotation: 0 });

        // Upload to Cloudinary in the background
        setUploading(true);
        try {
            const cloudUrl = await uploadImage(file);
            // Swap local preview with the Cloudinary URL silently
            setCurrentDesign(d => ({ ...d, url: cloudUrl }));
        } catch (err) {
            setUploadError(err.message);
            // Keep local preview even if upload fails
        } finally {
            setUploading(false);
            e.target.value = '';
        }

    }

    function handleClearUpload() {
        setCurrentDesign({ url: null, x: 0, y: 0, scale: 1, rotation: 0 });
        setUploadError(null);
    }

    const onPointerDown = useCallback((e) => {
        if (!currentDesign.url) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        drag.current = {
            startX: e.clientX,
            startY: e.clientY,
            origX: currentDesign.x,
            origY: currentDesign.y,
            view: activeView,
        };
    }, [currentDesign, activeView]);

    const onPointerMove = useCallback((e) => {
        if (!drag.current) return;
        const view = drag.current.view;
        const origX = drag.current.origX;
        const origY = drag.current.origY;
        const startX = drag.current.startX;
        const startY = drag.current.startY;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        setDesigns(d => ({
            ...d,
            [view]: { ...d[view], x: origX + dx, y: origY + dy },
        }));
    }, []);

    const onPointerUp = useCallback(() => { drag.current = null; }, []);

    useEffect(() => {
        function onKey(e) {
            if (!currentDesign.url) return;
            const step = e.shiftKey ? 10 : 2;
            const map = {
                ArrowLeft: [-step, 0],
                ArrowRight: [step, 0],
                ArrowUp: [0, -step],
                ArrowDown: [0, step],
            };
            if (map[e.key]) {
                e.preventDefault();
                const [dx, dy] = map[e.key];
                setCurrentDesign(d => ({ x: d.x + dx, y: d.y + dy }));
            }
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [currentDesign.url]);

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
                designImageUrl: Object.values(designs).find(d => d.url)?.url || '',
                totalPrice: total,
            };
            const res = await fetch(`${API}/api/custom-orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order),
            });
            res.ok
                ? alert('Order placed successfully!')
                : alert('Failed to place order. Please try again.');
        } catch (err) {
            console.error(err);
            alert('Something went wrong. Please try again.');
        } finally {
            setCheckoutLoading(false);
        }
    }

    return (
        <div className="custom-page">

            {/* Hero */}
            <section className="custom-hero">
                <img
                    src="/hero_image.png"
                    alt="INKA hero"
                    className="custom-hero__bg"
                />
            </section>

            <div className="custom-content">

                {/* ── Category ── */}
                <section className="custom-section">
                    <p className="custom-section__label">
                        Select the item you want to customize
                    </p>
                    <div className="category-grid">
                        {categories
                            .filter(cat => {
                                const cfg = getCategoryConfig(cat.categoryName);
                                return cfg.customizable !== false;
                            })
                            .map(cat => {
                                const cfg = getCategoryConfig(cat.categoryName);
                                return (
                                    <button
                                        key={cat.categoryId}
                                        className={`category-card ${selectedCategory?.categoryId === cat.categoryId ? 'category-card--active' : ''}`}
                                        onClick={() => { setSelectedCategory(cat); setSelectedSub(null); }}>
                                        <div className="category-card__img-wrap">
                                            {cfg.thumbnail && (
                                                <img
                                                    src={cfg.thumbnail}
                                                    alt={cat.categoryName}
                                                    className="category-card__img"
                                                    draggable={false}
                                                    onError={e => {
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <span className="category-card__label">
                                            {cat.categoryName}
                                        </span>
                                    </button>
                                );
                            })}
                    </div>
                </section>

                {/* ── Sub-category ── */}
                <section className="custom-section">
                    <p className="custom-section__label--sub">Sub-category</p>
                    <div className="subcategory-grid">
                        {subCategories.length > 0
                            ? subCategories.map(sub => (
                                <button
                                    key={sub.id}
                                    className={`subcategory-chip ${selectedSub?.id === sub.id ? 'subcategory-chip--active' : ''}`}
                                    onClick={() => setSelectedSub(sub)}>
                                    {sub.name}
                                </button>
                            ))
                            : <p className="empty-sub-label">No sub-categories available</p>
                        }
                    </div>
                </section>

                {/* ── Design canvas ── */}
                <section className="custom-canvas-section">

                    <div className="view-tabs">
                        {views.map(view => (
                            <button
                                key={view}
                                className={`view-tab ${activeView === view ? 'view-tab--active' : ''}`}
                                onClick={() => setActiveView(view)}>
                                {view}
                                {designs[view]?.url && <span className="view-tab__dot" />}
                            </button>
                        ))}
                    </div>

                    <div className="custom-canvas" ref={canvasRef}
                        tabIndex={0}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        onPointerLeave={onPointerUp}>

                        <input ref={fileInputRef} type="file" accept="image/*"
                            style={{ display: 'none' }} onChange={handleFileChange} />

                        <img
                            key={`${selectedCategory?.categoryId}-${activeView}`}
                            src={tshirtImages[activeView]}
                            alt={`${activeView} view`}
                            className="canvas-tshirt-base"
                            draggable={false}
                            onError={e => { e.currentTarget.style.display = 'none'; }}
                        />

                        <div className="canvas-print-area" style={{
                            top: `${PRINT_AREA.top * 100}%`,
                            left: `${PRINT_AREA.left * 100}%`,
                            width: `${PRINT_AREA.width * 100}%`,
                            height: `${PRINT_AREA.height * 100}%`,
                        }} />

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
                                <img
                                    src={currentDesign.url}
                                    alt="Design"
                                    className="canvas-design-img"
                                    style={{
                                        transform: `translate(${currentDesign.x}px, ${currentDesign.y}px) scale(${currentDesign.scale}) rotate(${currentDesign.rotation}deg)`,
                                    }}
                                    draggable={false}
                                />
                                <div className="design-drag-hint">
                                    <Move size={12} /> drag to move
                                </div>
                            </div>
                        )}

                        {!currentDesign.url && !uploading && (
                            <button
                                className="canvas-drop-hint"
                                style={{
                                    top: `${(PRINT_AREA.top + PRINT_AREA.height / 2) * 100}%`,
                                    left: `${(PRINT_AREA.left + PRINT_AREA.width / 2) * 100}%`,
                                }}
                                onClick={() => fileInputRef.current?.click()}>
                                <Upload size={26} />
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

                        {uploadError && (
                            <p className="canvas-error">{uploadError}</p>
                        )}
                    </div>

                    <div className="design-toolbar">
                        <div className="design-toolbar__left">
                            <button
                                className="toolbar-btn toolbar-btn--primary"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}>
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
                                        <span className="toolbar-value">
                                            {Math.round(currentDesign.scale * 100)}%
                                        </span>
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
                                        <span className="toolbar-value">
                                            {currentDesign.rotation}°
                                        </span>
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
                            <button className="toolbar-btn toolbar-btn--danger"
                                onClick={handleClearUpload}>
                                <X size={13} /> Remove
                            </button>
                        )}
                    </div>

                    <p className="canvas-disclaimer">
                        Drag to reposition · use toolbar to scale &amp; rotate · arrow keys to nudge
                    </p>
                </section>

                {/* ── Options ── */}
                <section className="options-row">
                    <p className="options-row__label">Customise Your Order</p>
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

                {/* ── Checkout ── */}
                <div className="checkout-row">
                    <div className="checkout-price-block">
                        <span className="checkout-price-label">Total</span>
                        <span className="checkout-total">LKR {total.toLocaleString()}</span>
                    </div>
                    <button
                        className="btn-checkout"
                        onClick={handleCheckout}
                        disabled={checkoutLoading}>
                        {checkoutLoading ? 'Placing Order…' : 'Checkout'}
                    </button>
                </div>

            </div>
        </div>
    );
}

// ── Select component — placeholder is disabled so it can't be re-selected ──
function Select({ value, onChange, options, placeholder }) {
    const isPlaceholder = value === placeholder;
    return (
        <div className="custom-select-wrapper">
            <select
                className={`custom-select ${isPlaceholder ? 'custom-select--placeholder' : 'custom-select--selected'}`}
                value={isPlaceholder ? '' : value}
                onChange={e => onChange(e.target.value || placeholder)}>
                <option value="" disabled hidden>{placeholder}</option>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <span className="custom-select-arrow">▾</span>
        </div>
    );

}