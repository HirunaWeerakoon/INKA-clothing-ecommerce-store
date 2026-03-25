import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import {
  adminGetAllProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} from '../../services/adminProductService';
import './AdminPanel.css';

// Empty form state used for Add and reset after Edit
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

export default function AdminPanel() {
  // Redirect non-admin users away immediately
  const navigate = useNavigate();

  useEffect(() => {
    const userDetails = authService.getUserDetails();
    const isAdmin = userDetails && userDetails.role === 'ADMIN';
    if (!isAdmin) {
      navigate('/'); // Send non-admins back to home
    }
  }, [navigate]);

  // Which sidebar tab is active: 'products' | 'category' | 'stock' | 'users'
  const [activeTab, setActiveTab] = useState('products');

  // Which panel action is active: 'add' | 'edit' | 'delete'
  const [activeAction, setActiveAction] = useState('add');

  // All products loaded from backend
  const [products, setProducts] = useState([]);

  // Form data for add/edit
  const [form, setForm] = useState(EMPTY_FORM);

  // The product currently selected for edit or delete
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Feedback message shown after actions
  const [message, setMessage] = useState('');

  // Load all products when component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch all products from backend
  const fetchProducts = async () => {
    try {
      const data = await adminGetAllProducts();
      setProducts(data);
    } catch (err) {
      setMessage('Failed to load products.');
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle Add Product form submission
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
    } catch (err) {
      setMessage('Failed to add product.');
    }
  };

  // When user clicks Edit on a product — pre-fill the form
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

  // Handle Edit Product form submission
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
    } catch (err) {
      setMessage('Failed to delete product.');
    }
  };

  return (
    <div className="admin-wrapper">
      {/* Sidebar navigation */}
      <aside className="admin-sidebar">
        <button
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        {/* Category tab — coming in Commit 2 */}
        <button
          className={activeTab === 'category' ? 'active' : ''}
          onClick={() => setActiveTab('category')}
        >
          Category
        </button>
        {/* Stock tab — coming in Commit 3 */}
        <button
          className={activeTab === 'stock' ? 'active' : ''}
          onClick={() => setActiveTab('stock')}
        >
          Stock
        </button>
        {/* Users tab — coming in Commit 4 */}
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </aside>

      {/* Main content area */}
      <main className="admin-main">

        {/* ── PRODUCTS TAB ── */}
        {activeTab === 'products' && (
          <div className="admin-content">

            {/* Add / Edit / Delete sub-tabs */}
            <div className="admin-actions">
              <button
                className={activeAction === 'add' ? 'active' : ''}
                onClick={() => { setActiveAction('add'); setForm(EMPTY_FORM); setSelectedProduct(null); }}
              >
                Add
              </button>
              <button
                className={activeAction === 'edit' ? 'active' : ''}
                onClick={() => setActiveAction('edit')}
              >
                Edit
              </button>
              <button
                className={activeAction === 'delete' ? 'active' : ''}
                onClick={() => setActiveAction('delete')}
              >
                Delete
              </button>
            </div>

            {/* Feedback message */}
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
                {/* Product list to pick from */}
                {!selectedProduct && (
                  <div className="admin-product-list">
                    <p>Select a product to edit:</p>
                    {products.map((p) => (
                      <div key={p.productId} className="admin-product-row">
                        <span>{p.name}</span>
                        <button onClick={() => handleSelectForEdit(p)}>Edit</button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Edit form pre-filled with selected product */}
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
                <p>Select a product to delete:</p>
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

        {/* Category tab — placeholder until Commit 2 */}
        {activeTab === 'category' && <p className="coming-soon">Category management .</p>}

        {/* Stock tab — placeholder until Commit 3 */}
        {activeTab === 'stock' && <p className="coming-soon">Stock management.</p>}

        {/* Users tab — placeholder until Commit 4 */}
        {/* Will include: view all users, filter by role, delete users */}
        {activeTab === 'users' && <p className="coming-soon">User management.</p>}

      </main>
    </div>
  );
}