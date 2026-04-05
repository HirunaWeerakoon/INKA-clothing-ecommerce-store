import { Link } from 'react-router-dom';

export default function CheckoutSuccess() {
    return (
        <div className="placeholder-page">
            <h1>Payment successful</h1>
            <p>Your payment was received. Thank you for your order.</p>
            <Link to="/account/orders">View orders</Link>
        </div>
    );
}
