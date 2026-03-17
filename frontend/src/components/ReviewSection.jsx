import React, { useState, useEffect } from 'react';
import { getReviewsByProduct, getAverageRating, createReview } from '../services/reviewService';
import { authService } from '../services/authService';
import './ReviewSection.css';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

// ── Stars display ────────────────────────────────────────────────────────────
function Stars({ rating, interactive = false, size = 16, onChange }) {
    const [hovered, setHovered] = useState(0);
    const display = interactive && hovered ? hovered : rating;

    return (
        <div className="rv-stars">
            {[1, 2, 3, 4, 5].map((s) => (
                <span
                    key={s}
                    className={`rv-star${s <= display ? '' : ' empty'}${interactive ? ' interactive' : ''}`}
                    style={{ fontSize: size }}
                    onMouseEnter={() => interactive && setHovered(s)}
                    onMouseLeave={() => interactive && setHovered(0)}
                    onClick={() => interactive && onChange && onChange(s)}
                >
                    ★
                </span>
            ))}
        </div>
    );
}

// ── Rating breakdown bar ─────────────────────────────────────────────────────
function RatingBar({ label, count, total }) {
    const pct = total > 0 ? (count / total) * 100 : 0;
    return (
        <div className="rv-bar-row">
            <span className="rv-bar-label">{label}</span>
            <div className="rv-bar-track">
                <div className="rv-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="rv-bar-count">{count}</span>
        </div>
    );
}

// ── Single review card ───────────────────────────────────────────────────────
function ReviewCard({ review }) {
    const [helpful, setHelpful] = useState(0);
    const [voted, setVoted] = useState(false);

    const initials = review.customerName
        ? review.customerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '??';

    const formattedDate = new Date(review.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
    });

    return (
        <div className="rv-card">
            <div className="rv-card-header">
                <div className="rv-card-left">
                    {/* Show Google profile photo if available, else initials */}
                    {review.customerPictureUrl
                        ? <img src={review.customerPictureUrl} alt={review.customerName} className="rv-avatar" />
                        : <div className="rv-avatar">{initials}</div>
                    }
                    <div>
                        <p className="rv-author-name">{review.customerName}</p>
                        <div className="rv-badges">
                            <span className="rv-verified">Verified purchase</span>
                            {review.sizePurchased && (
                                <span className="rv-size-tag">Size: {review.sizePurchased}</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="rv-card-right">
                    <Stars rating={review.rating} size={13} />
                    <p className="rv-card-date">{formattedDate}</p>
                </div>
            </div>

            {review.title && <p className="rv-card-title">{review.title}</p>}
            <p className="rv-card-body">{review.body}</p>

            <button
                className={`rv-helpful-btn${voted ? ' voted' : ''}`}
                onClick={() => { if (!voted) { setHelpful(h => h + 1); setVoted(true); } }}
            >
                {voted ? '✓ Helpful' : `Helpful (${helpful})`}
            </button>
        </div>
    );
}

// ── Main ReviewSection ───────────────────────────────────────────────────────
export default function ReviewSection({ productId }) {
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('recent');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [size, setSize] = useState('');

    // Check if user is logged in
    const isLoggedIn = authService.isAuthenticated();

    // Fetch reviews when component mounts or productId changes
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [reviewsData, avgData] = await Promise.all([
                    getReviewsByProduct(productId),
                    getAverageRating(productId)
                ]);
                setReviews(reviewsData);
                setAvgRating(avgData);
            } catch (err) {
                console.error('Error fetching reviews:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [productId]);

    // Handle review submission
    const handleSubmit = async () => {
        if (!rating || !body.trim()) return;
        setError('');
        try {
            const newReview = await createReview({
                productId,
                rating,
                title,
                body,
                sizePurchased: size
            });
            // Add new review to the top of the list instantly
            setReviews(prev => [newReview, ...prev]);
            setAvgRating(prev => {
                const total = reviews.length + 1;
                return Math.round(((prev * reviews.length + rating) / total) * 10) / 10;
            });
            setSubmitted(true);
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Please log in to submit a review.');
            } else if (err.response?.data) {
                setError(err.response.data);
            } else {
                setError('Something went wrong. Please try again.');
            }
        }
    };

    // Sort reviews
    const sorted = [...reviews].sort((a, b) => {
        if (sortBy === 'high') return b.rating - a.rating;
        if (sortBy === 'low') return a.rating - b.rating;
        return new Date(b.createdAt) - new Date(a.createdAt); // recent
    });

    // Breakdown per star
    const breakdown = [5, 4, 3, 2, 1].map(n => ({
        label: String(n),
        count: reviews.filter(r => r.rating === n).length
    }));

    if (loading) return <p className="rv-loading">Loading reviews...</p>;

    return (
        <div className="rv-root">

            {/* ── Summary ── */}
            <div className="rv-summary">
                <div>
                    <p className="rv-score">{avgRating.toFixed(1)}</p>
                    <Stars rating={Math.round(avgRating)} size={18} />
                    <p className="rv-total">{reviews.length} REVIEWS</p>
                </div>
                <div className="rv-bars">
                    {breakdown.map(b => (
                        <RatingBar key={b.label} label={b.label} count={b.count} total={reviews.length} />
                    ))}
                </div>
            </div>

            {/* ── Write a review / login prompt ── */}
            {submitted ? (
                <div className="rv-success">
                    <p>Review submitted — thank you.</p>
                </div>
            ) : isLoggedIn ? (
                <div className="rv-form">
                    <p className="rv-form-label">Write a review</p>

                    <div className="rv-field">
                        <label className="rv-field-label">Your rating</label>
                        <Stars rating={rating} interactive size={22} onChange={setRating} />
                    </div>

                    <div className="rv-field">
                        <input
                            className="rv-input"
                            placeholder="Review title (optional)"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="rv-field">
                        <textarea
                            className="rv-textarea"
                            placeholder="Share your experience with this product..."
                            value={body}
                            onChange={e => setBody(e.target.value)}
                        />
                    </div>

                    <div className="rv-field">
                        <label className="rv-field-label">Size purchased</label>
                        <div className="rv-size-row">
                            {SIZES.map(s => (
                                <button
                                    key={s}
                                    className={`rv-size-btn${size === s ? ' selected' : ''}`}
                                    onClick={() => setSize(s)}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && <p className="rv-error">{error}</p>}

                    <button
                        className="rv-submit-btn"
                        onClick={handleSubmit}
                        disabled={!rating || !body.trim()}
                    >
                        Submit Review
                    </button>
                </div>
            ) : (
                <div className="rv-login-prompt">
                    <p>Sign in with Google to leave a review.<br />Your experience helps others choose with confidence.</p>
                    <button
                        className="rv-login-btn"
                        onClick={() => { window.location.href = 'http://localhost:8080/oauth2/authorization/google'; }}
                    >
                        Sign in with Google
                    </button>
                </div>
            )}

            {/* ── Sort bar ── */}
            {reviews.length > 0 && (
                <div className="rv-sort-bar">
                    <p className="rv-sort-label">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
                    <div className="rv-sort-options">
                        {[
                            { id: 'recent', label: 'Newest' },
                            { id: 'high', label: 'Highest' },
                            { id: 'low', label: 'Lowest' }
                        ].map(opt => (
                            <button
                                key={opt.id}
                                className={`rv-sort-btn${sortBy === opt.id ? ' active' : ''}`}
                                onClick={() => setSortBy(opt.id)}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Review list ── */}
            {sorted.map(review => (
                <ReviewCard key={review.reviewId} review={review} />
            ))}

            {reviews.length === 0 && (
                <p className="rv-empty">No reviews yet. Be the first to share your experience.</p>
            )}
        </div>
    );
}