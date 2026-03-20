import { useState, useEffect } from 'react';
import axios from 'axios';

function Stars({ rating }) {
    return (
        <span>
            {[1, 2, 3, 4, 5].map(s => (
                <span key={s} style={{ color: s <= rating ? '#111' : '#ddd', fontSize: 13 }}>★</span>
            ))}
        </span>
    );
}

export default function MyReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyReviews = async () => {
            try {
                // axios interceptor automatically adds Authorization: Bearer <token>
                const response = await axios.get('/api/reviews/my-reviews');
                setReviews(response.data);
            } catch (err) {
                setError('Failed to load reviews.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyReviews();
    }, []);

    if (loading) return <p className="placeholder-text">Loading your reviews...</p>;
    if (error) return <p className="placeholder-text">{error}</p>;

    if (reviews.length === 0) {
        return (
            <div className="tab-pane">
                <p className="placeholder-text">You have no previous reviews.</p>
            </div>
        );
    }

    return (
        <div className="tab-pane">
            {reviews.map(review => (
                <div key={review.reviewId} style={{
                    borderBottom: '1px solid #e5e5e5',
                    padding: '20px 0',
                }}>
                    {/* Product name */}
                    <p style={{ margin: '0 0 6px', fontSize: 13, color: '#888', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        {review.productName}
                    </p>

                    {/* Rating + date row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <Stars rating={review.rating} />
                        <span style={{ fontSize: 11, color: '#aaa', fontFamily: 'monospace' }}>
                            {new Date(review.createdAt).toLocaleDateString('en-GB', {
                                day: '2-digit', month: 'short', year: 'numeric'
                            })}
                        </span>
                    </div>

                    {/* Review body */}
                    {review.body && (
                        <p style={{ margin: 0, fontSize: 13, color: '#444', lineHeight: 1.7 }}>
                            {review.body}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}