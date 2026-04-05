import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import './CartSidebar.css';
import { authService } from '../services/authService';
import { checkoutService } from '../services/checkoutService';

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
            await axios.put(`/api/cart/${id}`, { quantity: newQty });
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
            await axios.delete(`/api/cart/${id}`);
            setCartItems(items => items.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const total = cartItems.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
        0
    );

    const handleCheckout = async () => {
        const user = authService.getUserDetails();
        if (!user) {
            alert('Please log in to checkout.');
            return;
        }
        try {
            const response = await checkoutService.createCartSession(user.id);
            if (response?.url) {
                window.location.href = response.url;
            } else {
                alert('Unable to start checkout.');
            }
        } catch (error) {
            console.error('Error starting checkout:', error);
            alert('Unable to start checkout.');
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
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.productName} />
                                        ) : (
                                            <div className="cart-item__image-placeholder">INKA</div>
                                        )}
                                    </div>
                                    <div className="cart-item__details">
                                        <p className="cart-item__name">{item.productName}</p>
                                        <p className="cart-item__price">
                                            LKR {item.price?.toLocaleString()}
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
                        <button className="cart-sidebar__checkout" onClick={handleCheckout}>CHECKOUT</button>
                    </div>
                )}
            </aside>
        </>
    );
}
