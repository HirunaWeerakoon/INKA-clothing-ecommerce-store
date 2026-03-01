import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AccountLayout from './pages/Account/AccountLayout';
import MyDetails from './pages/Account/MyDetails';
import MyOrders from './pages/Account/MyOrders';
import MyReviews from './pages/Account/MyReviews';

function AppLayout() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<div className="placeholder-page">Home Page Placeholder</div>} />
          <Route path="shop" element={<div className="placeholder-page">Shop Placeholder</div>} />
          <Route path="custom" element={<div className="placeholder-page">Custom Placeholder</div>} />
          <Route path="about" element={<div className="placeholder-page">About Placeholder</div>} />

          <Route path="account" element={<AccountLayout />}>
            <Route index element={<Navigate to="details" replace />} />
            <Route path="details" element={<MyDetails />} />
            <Route path="orders" element={<MyOrders />} />
            <Route path="reviews" element={<MyReviews />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
