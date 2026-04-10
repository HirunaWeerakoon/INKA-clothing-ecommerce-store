import { Link } from 'react-router-dom';

export default function CheckoutCancel() {
    return (
        <div className="placeholder-page">
            <h1>Payment cancelled</h1>
            <p>Your payment was cancelled. You can try again from your cart.</p>
            <Link to="/cart">Back to cart</Link>
        </div>
    );
}
