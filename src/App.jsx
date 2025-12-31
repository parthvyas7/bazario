import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import PropTypes from "prop-types";
import { Analytics } from "@vercel/analytics/react";
import { useEffect } from "react";

import {
  ProductListing,
  ShoppingCart,
  SellerDashboard,
  BuyerOrders,
  SellerProfilePage,
  LoginForm,
  RegisterForm,
} from "./components";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";

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
  const { user, profile, initialize, signOut } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/" className="hover:text-blue-600">
              <h1 className="text-2xl font-bold">Bazario</h1>
            </Link>
            <div className="flex items-center space-x-6">
              {user ? (
                <div className="flex items-center space-x-6">
                  <Link to="/cart" className="hover:text-blue-600">
                    Cart
                  </Link>
                  <Link to="/orders" className="hover:text-blue-600">
                    My Orders
                  </Link>
                  {profile?.user_type === "seller" && (
                    <Link
                      to="/seller-dashboard"
                      className="hover:text-blue-600"
                    >
                      Seller Dashboard
                    </Link>
                  )}
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">
                      {profile?.username || user.email}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/" element={<ProductListing />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
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
            path="/checkout"
            element={
              <ProtectedRoute requiredRole="buyer">
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-confirmation"
            element={
              <ProtectedRoute requiredRole="buyer">
                <OrderConfirmation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute requiredRole="buyer">
                <BuyerOrders />
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
      <Analytics />
    </Router>
  );
};

export default App;
