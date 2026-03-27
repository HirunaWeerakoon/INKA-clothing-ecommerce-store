import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import {
  adminGetAllProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} from '../../services/adminProductService';
import {
  adminGetAllCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} from '../../services/adminCategoryService';
import {
  adminGetAllStock,
  adminUpdateStock,
} from '../../services/adminStockService';
// Dashboard stats service — added for redesign
import { adminGetStats } from '../../services/adminDashboardService';
// User management service — added for Commit 4
import { adminGetAllUsers, adminDeleteUser } from '../../services/adminUserService';
import './AdminPanel.css';

// Empty form state for product add/edit
const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  stock: '',
  categoryId: '',
  imageUrl: '',
  isAvailable: true,
  bestSeller: false,
};

// Empty form state for category add/edit
const EMPTY_CAT_FORM = {
  categoryName: '',
  imageUrl: '',
};

export default function AdminPanel() {
  // Redirect non-admin users away immediately — route guard
  const navigate = useNavigate();

  useEffect(() => {
    const userDetails = authService.getUserDetails();
    const isAdmin = userDetails && userDetails.role === 'ADMIN';
    if (!isAdmin) {
      navigate('/');
    }
  }, [navigate]);

  // Get logged in admin's name from JWT for the greeting
  const userDetails = authService.getUserDetails();

  // Which sidebar tab is active
  const [activeTab, setActiveTab] = useState('dashboard');

  // Product actions
  const [activeAction, setActiveAction] = useState('add');

  // Category actions
  const [activeCatAction, setActiveCatAction] = useState('add');

  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stockList, setStockList] = useState([]);
  const [stockEdits, setStockEdits] = useState({});
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);

  // Form states
  const [form, setForm] = useState(EMPTY_FORM);
  const [catForm, setCatForm] = useState(EMPTY_CAT_FORM);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Feedback messages
  const [message, setMessage] = useState('');
  const [catMessage, setCatMessage] = useState('');
  const [stockMessage, setStockMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');

  // Load products and stats on mount
  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === 'category') fetchCategories();
    if (activeTab === 'stock') fetchStock();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab]);

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const data = await adminGetStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats');
    }
  };

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const data = await adminGetAllProducts();
      setProducts(data);
    } catch (err) {
      setMessage('Failed to load products.');
    }
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const data = await adminGetAllCategories();
      setCategories(data);
    } catch (err) {
      setCatMessage('Failed to load categories.');
    }
  };

  // Fetch stock list
  const fetchStock = async () => {
    try {
      const data = await adminGetAllStock();
      setStockList(data);
      const edits = {};
      data.forEach((p) => { edits[p.productId] = p.stock; });
      setStockEdits(edits);
    } catch (err) {
      setStockMessage('Failed to load stock data.');
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const data = await adminGetAllUsers();
      setUsers(data);
    } catch (err) {
      setUserMessage('Failed to load users.');
    }
  };

  // Handle stock input change
  const handleStockChange = (productId, value) => {
    setStockEdits((prev) => ({ ...prev, [productId]: value }));
  };

  // Save updated stock
  const handleStockSave = async (productId) => {
    try {
      const newStock = parseInt(stockEdits[productId]);
      await adminUpdateStock(productId, newStock);
      setStockMessage('Stock updated successfully!');
      fetchStock();
      fetchStats(); // Refresh stats so low stock count updates
    } catch (err) {
      setStockMessage('Failed to update stock.');
    }
  };

  // Handle product form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle category form changes
  const handleCatChange = (e) => {
    const { name, value } = e.target;
    setCatForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Add Product
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await adminCreateProduct({
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        categoryId: form.categoryId ? parseInt(form.categoryId) : null,
      });
      setMessage('Product added successfully!');
      setForm(EMPTY_FORM);
      fetchProducts();
      fetchStats();
    } catch (err) {
      setMessage('Failed to add product.');
    }
  };

  // Pre-fill form for editing
  const handleSelectForEdit = (product) => {
    setSelectedProduct(product);
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      stock: product.stock || '',
      categoryId: product.categoryId || '',
      imageUrl: product.imageUrl || '',
      isAvailable: product.isAvailable ?? true,
      bestSeller: product.bestSeller ?? false,
    });
  };

  // Handle Edit Product
  const handleEdit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      await adminUpdateProduct(selectedProduct.productId, {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        categoryId: form.categoryId ? parseInt(form.categoryId) : null,
      });
      setMessage('Product updated successfully!');
      setSelectedProduct(null);
      setForm(EMPTY_FORM);
      fetchProducts();
    } catch (err) {
      setMessage('Failed to update product.');
    }
  };

  // Handle Delete Product
  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminDeleteProduct(productId);
      setMessage('Product deleted successfully!');
      fetchProducts();
      fetchStats();
    } catch (err) {
      setMessage('Failed to delete product.');
    }
  };

  // Handle Add Category
  const handleCatAdd = async (e) => {
    e.preventDefault();
    try {
      await adminCreateCategory(catForm);
      setCatMessage('Category added successfully!');
      setCatForm(EMPTY_CAT_FORM);
      fetchCategories();
      fetchStats();
    } catch (err) {
      setCatMessage('Failed to add category.');
    }
  };

  // Pre-fill form for category edit
  const handleSelectCatForEdit = (category) => {
    setSelectedCategory(category);
    setCatForm({
      categoryName: category.categoryName || '',
      imageUrl: category.imageUrl || '',
    });
  };

  // Handle Edit Category
  const handleCatEdit = async (e) => {
    e.preventDefault();
    if (!selectedCategory) return;
    try {
      await adminUpdateCategory(selectedCategory.categoryId, catForm);
      setCatMessage('Category updated successfully!');
      setSelectedCategory(null);
      setCatForm(EMPTY_CAT_FORM);
      fetchCategories();
    } catch (err) {
      setCatMessage('Failed to update category.');
    }
  };

  // Handle Delete Category
  const handleCatDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await adminDeleteCategory(categoryId);
      setCatMessage('Category deleted successfully!');
      fetchCategories();
      fetchStats();
    } catch (err) {
      setCatMessage('Failed to delete category.');
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminDeleteUser(userId);
      setUserMessage('User deleted successfully!');
      fetchUsers();
      fetchStats();
    } catch (err) {
      setUserMessage('Failed to delete user.');
    }
  };

  return (
    <div className="admin-wrapper">

      {/* ── SIDEBAR ── */}
      <aside className="admin-sidebar">
        {/* INKA brand logo in sidebar */}
        <div className="admin-sidebar-logo">INKA</div>

        {/* Navigation items */}
        <nav className="admin-nav">
          <button
            className={activeTab === 'dashboard' ? 'admin-nav-item active' : 'admin-nav-item'}
            onClick={() => setActiveTab('dashboard')}
          >
            {/* Dashboard icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Dashboard
          </button>

          <button
            className={activeTab === 'products' ? 'admin-nav-item active' : 'admin-nav-item'}
            onClick={() => setActiveTab('products')}
          >
            {/* Products icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            Products
          </button>

          <button
            className={activeTab === 'category' ? 'admin-nav-item active' : 'admin-nav-item'}
            onClick={() => setActiveTab('category')}
          >
            {/* Category icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
            Category
          </button>

          <button
            className={activeTab === 'stock' ? 'admin-nav-item active' : 'admin-nav-item'}
            onClick={() => setActiveTab('stock')}
          >
            {/* Stock icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            Stock
          </button>

          <button
            className={activeTab === 'users' ? 'admin-nav-item active' : 'admin-nav-item'}
            onClick={() => setActiveTab('users')}
          >
            {/* Users icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
            Users
          </button>
        </nav>

        {/* Back to site link at bottom of sidebar */}
        <a href="/" className="admin-back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back to site
        </a>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="admin-main">

        {/* ── DASHBOARD TAB ── */}
        {activeTab === 'dashboard' && (
          <div className="admin-content">
            {/* Greeting header */}
            <div className="dashboard-header">
              <h1 className="dashboard-greeting">Overview</h1>
              <p className="dashboard-subtitle">Here's what's happening with your store today.</p>
            </div>

            {/* Stat cards grid */}
            <div className="dashboard-stats">

              <div className="stat-card">
                <div className="stat-icon stat-icon-products">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                </div>
                <div className="stat-info">
                  <span className="stat-label">Total Products</span>
                  <span className="stat-value">{stats?.totalProducts ?? '—'}</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon stat-icon-categories">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
                </div>
                <div className="stat-info">
                  <span className="stat-label">Categories</span>
                  <span className="stat-value">{stats?.totalCategories ?? '—'}</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon stat-icon-users">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                </div>
                <div className="stat-info">
                  <span className="stat-label">Total Users</span>
                  <span className="stat-value">{stats?.totalUsers ?? '—'}</span>
                </div>
              </div>

              {/* Low stock card — highlighted in amber if any */}
              <div className={`stat-card ${stats?.lowStockCount > 0 ? 'stat-card-warning' : ''}`}>
                <div className="stat-icon stat-icon-stock">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </div>
                <div className="stat-info">
                  <span className="stat-label">Low Stock Items</span>
                  <span className="stat-value">{stats?.lowStockCount ?? '—'}</span>
                </div>
              </div>

            </div>

            {/* Quick action buttons */}
            <div className="dashboard-quick-actions">
              <p className="dashboard-section-label">Quick Actions</p>
              <div className="quick-action-row">
                <button className="quick-action-btn" onClick={() => { setActiveTab('products'); setActiveAction('add'); }}>
                  + Add Product
                </button>
                <button className="quick-action-btn" onClick={() => { setActiveTab('category'); setActiveCatAction('add'); }}>
                  + Add Category
                </button>
                <button className="quick-action-btn" onClick={() => setActiveTab('stock')}>
                  Manage Stock
                </button>
                <button className="quick-action-btn" onClick={() => setActiveTab('users')}>
                  View Users
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUCTS TAB ── */}
        {activeTab === 'products' && (
          <div className="admin-content">
            <h2 className="admin-section-title">Products</h2>
            <div className="admin-actions">
              <button className={activeAction === 'add' ? 'active' : ''} onClick={() => { setActiveAction('add'); setForm(EMPTY_FORM); setSelectedProduct(null); }}>Add</button>
              <button className={activeAction === 'edit' ? 'active' : ''} onClick={() => setActiveAction('edit')}>Edit</button>
              <button className={activeAction === 'delete' ? 'active' : ''} onClick={() => setActiveAction('delete')}>Delete</button>
            </div>

            {message && <p className="admin-message">{message}</p>}

            {/* ── ADD FORM ── */}
            {activeAction === 'add' && (
              <form className="admin-form" onSubmit={handleAdd}>
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleChange} required />
                <label>Description</label>
                <input name="description" value={form.description} onChange={handleChange} />
                <label>Price</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} required />
                <label>Stock</label>
                <input name="stock" type="number" value={form.stock} onChange={handleChange} required />
                <label>Category ID</label>
                <input name="categoryId" type="number" value={form.categoryId} onChange={handleChange} />
                <label>Image URL</label>
                <input name="imageUrl" value={form.imageUrl} onChange={handleChange} />
                <label className="checkbox-row">
                  <input name="isAvailable" type="checkbox" checked={form.isAvailable} onChange={handleChange} />
                  Available
                </label>
                <label className="checkbox-row">
                  <input name="bestSeller" type="checkbox" checked={form.bestSeller} onChange={handleChange} />
                  Best Seller
                </label>
                <div className="admin-form-buttons">
                  <button type="submit" className="btn-save">Save</button>
                  <button type="button" className="btn-cancel" onClick={() => setForm(EMPTY_FORM)}>Cancel</button>
                </div>
              </form>
            )}

            {/* ── EDIT PANEL ── */}
            {activeAction === 'edit' && (
              <div className="admin-edit-panel">
                {!selectedProduct && (
                  <div className="admin-product-list">
                    {/* Clean table header instead of plain text ── */}
                    <div className="admin-list-header">
                      <span>Product Name</span>
                      <span>Action</span>
                    </div>
                    {products.map((p) => (
                      <div key={p.productId} className="admin-product-row">
                        <span>{p.name}</span>
                        <button onClick={() => handleSelectForEdit(p)}>Edit</button>
                      </div>
                    ))}
                  </div>
                )}
                {selectedProduct && (
                  <form className="admin-form" onSubmit={handleEdit}>
                    <p className="editing-label">Editing: <strong>{selectedProduct.name}</strong></p>
                    <label>Name</label>
                    <input name="name" value={form.name} onChange={handleChange} required />
                    <label>Description</label>
                    <input name="description" value={form.description} onChange={handleChange} />
                    <label>Price</label>
                    <input name="price" type="number" value={form.price} onChange={handleChange} required />
                    <label>Stock</label>
                    <input name="stock" type="number" value={form.stock} onChange={handleChange} required />
                    <label>Category ID</label>
                    <input name="categoryId" type="number" value={form.categoryId} onChange={handleChange} />
                    <label>Image URL</label>
                    <input name="imageUrl" value={form.imageUrl} onChange={handleChange} />
                    <label className="checkbox-row">
                      <input name="isAvailable" type="checkbox" checked={form.isAvailable} onChange={handleChange} />
                      Available
                    </label>
                    <label className="checkbox-row">
                      <input name="bestSeller" type="checkbox" checked={form.bestSeller} onChange={handleChange} />
                      Best Seller
                    </label>
                    <div className="admin-form-buttons">
                      <button type="submit" className="btn-save">Save</button>
                      <button type="button" className="btn-cancel" onClick={() => { setSelectedProduct(null); setForm(EMPTY_FORM); }}>Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* ── DELETE PANEL ── */}
            {activeAction === 'delete' && (
              <div className="admin-product-list">
                {/* Clean table header instead of plain text ── */}
                <div className="admin-list-header">
                  <span>Product Name</span>
                  <span>Action</span>
                </div>
                {products.map((p) => (
                  <div key={p.productId} className="admin-product-row">
                    <span>{p.name}</span>
                    <button className="btn-delete" onClick={() => handleDelete(p.productId)}>Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── CATEGORY TAB ── */}
        {activeTab === 'category' && (
          <div className="admin-content">
            <h2 className="admin-section-title">Category</h2>
            <div className="admin-actions">
              <button className={activeCatAction === 'add' ? 'active' : ''} onClick={() => { setActiveCatAction('add'); setCatForm(EMPTY_CAT_FORM); setSelectedCategory(null); }}>Add</button>
              <button className={activeCatAction === 'edit' ? 'active' : ''} onClick={() => setActiveCatAction('edit')}>Edit</button>
              <button className={activeCatAction === 'delete' ? 'active' : ''} onClick={() => setActiveCatAction('delete')}>Delete</button>
            </div>

            {catMessage && <p className="admin-message">{catMessage}</p>}

            {/* ── CATEGORY ADD FORM ── */}
            {activeCatAction === 'add' && (
              <form className="admin-form" onSubmit={handleCatAdd}>
                <label>Category Name</label>
                <input name="categoryName" value={catForm.categoryName} onChange={handleCatChange} required />
                <label>Image URL</label>
                <input name="imageUrl" value={catForm.imageUrl} onChange={handleCatChange} />
                <div className="admin-form-buttons">
                  <button type="submit" className="btn-save">Save</button>
                  <button type="button" className="btn-cancel" onClick={() => setCatForm(EMPTY_CAT_FORM)}>Cancel</button>
                </div>
              </form>
            )}

            {/* ── CATEGORY EDIT PANEL ── */}
            {activeCatAction === 'edit' && (
              <div className="admin-edit-panel">
                {!selectedCategory && (
                  <div className="admin-product-list">
                    {/* Clean table header instead of plain text ── */}
                    <div className="admin-list-header">
                      <span>Category Name</span>
                      <span>Action</span>
                    </div>
                    {categories.map((c) => (
                      <div key={c.categoryId} className="admin-product-row">
                        <span>{c.categoryName}</span>
                        <button onClick={() => handleSelectCatForEdit(c)}>Edit</button>
                      </div>
                    ))}
                  </div>
                )}
                {selectedCategory && (
                  <form className="admin-form" onSubmit={handleCatEdit}>
                    <p className="editing-label">Editing: <strong>{selectedCategory.categoryName}</strong></p>
                    <label>Category Name</label>
                    <input name="categoryName" value={catForm.categoryName} onChange={handleCatChange} required />
                    <label>Image URL</label>
                    <input name="imageUrl" value={catForm.imageUrl} onChange={handleCatChange} />
                    <div className="admin-form-buttons">
                      <button type="submit" className="btn-save">Save</button>
                      <button type="button" className="btn-cancel" onClick={() => { setSelectedCategory(null); setCatForm(EMPTY_CAT_FORM); }}>Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* ── CATEGORY DELETE PANEL ── */}
            {activeCatAction === 'delete' && (
              <div className="admin-product-list">
                {/* Clean table header instead of plain text ── */}
                <div className="admin-list-header">
                  <span>Category Name</span>
                  <span>Action</span>
                </div>
                {categories.map((c) => (
                  <div key={c.categoryId} className="admin-product-row">
                    <span>{c.categoryName}</span>
                    <button className="btn-delete" onClick={() => handleCatDelete(c.categoryId)}>Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── STOCK TAB ── */}
        {activeTab === 'stock' && (
          <div className="admin-content">
            <h2 className="admin-section-title">Stock</h2>
            {stockMessage && <p className="admin-message">{stockMessage}</p>}

            <div className="admin-stock-table">
              <div className="admin-stock-header">
                <span>Product</span>
                <span>Stock</span>
                <span></span>
              </div>
              {stockList.map((p) => (
                <div key={p.productId} className="admin-stock-row">
                  <div>
                    <span className="admin-stock-name">{p.name}</span>
                    {p.stock <= 5 && p.stock > 0 && <span className="stock-warning">Low</span>}
                    {p.stock === 0 && <span className="stock-out">Out</span>}
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={stockEdits[p.productId] ?? p.stock}
                    onChange={(e) => handleStockChange(p.productId, e.target.value)}
                    className="stock-input"
                  />
                  <button className="btn-save" onClick={() => handleStockSave(p.productId)}>Save</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === 'users' && (
          <div className="admin-content">
            <h2 className="admin-section-title">Users</h2>
            {userMessage && <p className="admin-message">{userMessage}</p>}

            {/* Users table */}
            <div className="admin-stock-table">
              <div className="admin-users-header">
                <span>Name</span>
                <span>Email</span>
                <span>Role</span>
                <span></span>
              </div>
              {users.map((u) => (
                <div key={u.customerId} className="admin-users-row">
                  <span className="admin-stock-name">{u.name || '—'}</span>
                  <span className="user-email">{u.email}</span>
                  {/* Role badge — ADMIN gets black, USER gets grey */}
                  <span className={u.role === 'ADMIN' ? 'role-badge role-admin' : 'role-badge role-user'}>
                    {u.role}
                  </span>
                  {/* Prevent admin from deleting themselves */}
                  {u.email !== userDetails?.email && (
                    <button className="btn-delete" onClick={() => handleDeleteUser(u.customerId)}>Delete</button>
                  )}
                  {/* Show a dash if this is the currently logged in admin */}
                  {u.email === userDetails?.email && (
                    <span className="user-you-badge">You</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}