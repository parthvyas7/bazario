import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from './stores/authStore'; 
import PropTypes from 'prop-types';

import { ProductListing, ShoppingCart, SellerDashboard, OrdersPage, SellerProfilePage, LoginForm, RegisterForm } from './components';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, profile } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && profile?.user_type !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Bazario</h1>
            <div className="flex space-x-4">
              <Link to="/" className="hover:text-blue-600">Home</Link>
              <Link to="/cart" className="hover:text-blue-600">Cart</Link>
              <Link to="/orders" className="hover:text-blue-600">My Orders</Link>
              <Link to="/seller-dashboard" className="hover:text-blue-600">Seller Dashboard</Link>
              {/* Add login/logout buttons based on auth state */}
            </div>
          </div>
        </nav>

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/" element={<ProductListing />} />
          <Route path="/seller/:sellerId" element={<SellerProfilePage />} />

          {/* Protected Routes */}
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute requiredRole="buyer">
                <ShoppingCart />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute requiredRole="buyer">
                <OrdersPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/seller-dashboard" 
            element={
              <ProtectedRoute requiredRole="seller">
                <SellerDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;