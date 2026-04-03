import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import './CartSidebar.css';
import { authService } from '../services/authService';

export default function CartSidebar({ isOpen, onClose }) {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCart = useCallback(async () => {
        const user = authService.getUserDetails();
        if (!user) {
            setCartItems([]);
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(`/api/cart/${user.id}`);
            setCartItems(response.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchCart();
        }
    }, [isOpen, fetchCart]);

    // Listen for cart updates from ProductPage
    useEffect(() => {
        const handleCartUpdate = () => {
            fetchCart();
        };
        window.addEventListener('cart-updated', handleCartUpdate);
        return () => window.removeEventListener('cart-updated', handleCartUpdate);
    }, [fetchCart]);

    const updateQuantity = async (id, newQty) => {
        if (newQty < 1) return;
        try {
            await axios.put(`/api/cart/item/${id}`, { quantity: newQty });
            setCartItems(items =>
                items.map(item =>
                    item.id === id ? { ...item, quantity: newQty } : item
                )
            );
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const removeItem = async (id) => {
        try {
            await axios.delete(`/api/cart/item/${id}`);
            setCartItems(items => items.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const total = cartItems.reduce(
        (sum, item) => sum + ((item.product?.price || item.price || 0) * (item.quantity || 0)),
        0
    );

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;
        try {
            // Get auth details from JWT token
            const user = authService.getUserDetails();
            const customerId = user?.id || 0;
            const customerName = user?.email || 'Guest User';
            const customerEmail = user?.email || 'guest@example.com';

            // Flatten nested product data for clean storage in temp orders
            const flatItems = cartItems.map(item => ({
                productId: item.product?.productId || item.productId || item.id,
                productName: item.product?.name || item.productName || 'Unknown',
                imageUrl: item.product?.imageUrl || item.imageUrl || '',
                price: item.product?.price || item.price || 0,
                quantity: item.quantity || 1,
                originalImageUrl: item.originalImageUrl || null,
                mergedImageUrl: item.mergedImageUrl || null,
            }));

            // Find if any custom design images exist
            const customItem = flatItems.find(item => item.originalImageUrl || (item.imageUrl && item.imageUrl.includes('merged')));

            await axios.post('/api/temp-orders/checkout', {
                customerId: customerId,
                customerName: customerName,
                customerEmail: customerEmail,
                totalAmount: total,
                originalImageUrl: customItem?.originalImageUrl || null,
                mergedImageUrl: customItem?.mergedImageUrl || customItem?.imageUrl || null,
                cartItems: flatItems
            });

            setCartItems([]);
            alert('Checkout successful! Sent to Admin Temp Orders.');
            onClose();
        } catch (error) {
            console.error('Checkout failed:', error);
            alert('Checkout failed.');
        }
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`cart-overlay${isOpen ? ' open' : ''}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside className={`cart-sidebar${isOpen ? ' open' : ''}`}>
                <div className="cart-sidebar__header">
                    <h2>Your Cart</h2>
                    <button className="cart-sidebar__close" onClick={onClose} aria-label="Close cart">
                        <X size={22} />
                    </button>
                </div>

                <div className="cart-sidebar__body">
                    {loading ? (
                        <p className="cart-sidebar__empty">Loading...</p>
                    ) : cartItems.length === 0 ? (
                        <p className="cart-sidebar__empty">Your cart is empty.</p>
                    ) : (
                        <ul className="cart-sidebar__list">
                            {cartItems.map(item => (
                                <li key={item.id} className="cart-item">
                                    <div className="cart-item__image">
                                        {item.product?.imageUrl || item.imageUrl ? (
                                            <img src={item.product?.imageUrl || item.imageUrl} alt={item.product?.name || item.productName} />
                                        ) : (
                                            <div className="cart-item__image-placeholder">INKA</div>
                                        )}
                                    </div>
                                    <div className="cart-item__details">
                                        <p className="cart-item__name">{item.product?.name || item.productName}</p>
                                        <p className="cart-item__price">
                                            LKR {(item.product?.price || item.price)?.toLocaleString()}
                                        </p>
                                        <div className="cart-item__quantity">
                                            <button
                                                className="cart-item__qty-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="cart-item__qty">{item.quantity}</span>
                                            <button
                                                className="cart-item__qty-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                aria-label="Increase quantity"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        className="cart-item__remove"
                                        onClick={() => removeItem(item.id)}
                                        aria-label="Remove item"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-sidebar__footer">
                        <div className="cart-sidebar__total">
                            <span>Subtotal</span>
                            <span className="cart-sidebar__total-price">
                                LKR {total.toLocaleString()}
                            </span>
                        </div>
                        <button className="cart-sidebar__checkout" onClick={handleCheckout} disabled={cartItems.length === 0}>
                            CHECKOUT
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
}
