import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import {
  adminGetAllProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} from '../../services/adminProductService';
// Category service — added for Commit 2
import {
  adminGetAllCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} from '../../services/adminCategoryService';
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

  // Which panel action is active for products: 'add' | 'edit' | 'delete'
  const [activeAction, setActiveAction] = useState('add');

  // Which panel action is active for categories: 'add' | 'edit' | 'delete'
  const [activeCatAction, setActiveCatAction] = useState('add');

  // All products loaded from backend
  const [products, setProducts] = useState([]);

  // All categories loaded from backend
  const [categories, setCategories] = useState([]);

  // Form data for product add/edit
  const [form, setForm] = useState(EMPTY_FORM);

  // Form data for category add/edit
  const [catForm, setCatForm] = useState(EMPTY_CAT_FORM);

  // Product currently selected for edit or delete
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Category currently selected for edit
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Feedback message shown after product actions
  const [message, setMessage] = useState('');

  // Feedback message shown after category actions
  const [catMessage, setCatMessage] = useState('');

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Load categories when category tab is opened
  useEffect(() => {
    if (activeTab === 'category') {
      fetchCategories();
    }
  }, [activeTab]);

  // Fetch all products from backend
  const fetchProducts = async () => {
    try {
      const data = await adminGetAllProducts();
      setProducts(data);
    } catch (err) {
      setMessage('Failed to load products.');
    }
  };

  // Fetch all categories from backend
  const fetchCategories = async () => {
    try {
      const data = await adminGetAllCategories();
      setCategories(data);
    } catch (err) {
      setCatMessage('Failed to load categories.');
    }
  };

  // Handle product form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle category form field changes
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
    } catch (err) {
      setCatMessage('Failed to add category.');
    }
  };

  // When user clicks Edit on a category — pre-fill the form
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
    } catch (err) {
      setCatMessage('Failed to delete category.');
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
                    <p>Select a product to edit:</p>
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

        {/* ── CATEGORY TAB ── */}
        {activeTab === 'category' && (
          <div className="admin-content">
            <div className="admin-actions">
              <button
                className={activeCatAction === 'add' ? 'active' : ''}
                onClick={() => { setActiveCatAction('add'); setCatForm(EMPTY_CAT_FORM); setSelectedCategory(null); }}
              >
                Add
              </button>
              <button
                className={activeCatAction === 'edit' ? 'active' : ''}
                onClick={() => setActiveCatAction('edit')}
              >
                Edit
              </button>
              <button
                className={activeCatAction === 'delete' ? 'active' : ''}
                onClick={() => setActiveCatAction('delete')}
              >
                Delete
              </button>
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
                    <p>Select a category to edit:</p>
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
                <p>Select a category to delete:</p>
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

        {/* Stock tab — placeholder until Commit 3 */}
        {activeTab === 'stock' && <p className="coming-soon">Stock management — coming in Commit 3.</p>}

        {/* Users tab — placeholder until Commit 4 */}
        {activeTab === 'users' && <p className="coming-soon">User management — coming in Commit 4.</p>}

      </main>
    </div>
  );
}