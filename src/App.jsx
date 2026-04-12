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
        <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-sm">
          <div className="flex justify-between items-center px-8 h-20 w-full max-w-[1920px] mx-auto">
            {/* Brand Logo */}
            <Link to="/" className="text-2xl font-bold text-primary font-headline tracking-tight hover:opacity-80 transition-opacity">
              Bazario
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-8 font-headline tracking-tight">
              {user ? (
                <>
                  <Link to="/" className="text-primary font-semibold hover:text-secondary transition-colors duration-300">
                    Products
                  </Link>
                  <Link to="/cart" className="text-on-surface/70 hover:text-secondary transition-colors duration-300">
                    Cart
                  </Link>
                  <Link to="/orders" className="text-on-surface/70 hover:text-secondary transition-colors duration-300">
                    My Orders
                  </Link>
                  {profile?.user_type === "seller" && (
                    <Link to="/seller-dashboard" className="hidden lg:block text-on-surface/70 hover:text-secondary transition-colors duration-300">
                      Seller Dashboard
                    </Link>
                  )}
                  <div className="flex items-center gap-4 ml-4">
                    <span className="text-sm font-medium text-on-surface-variant truncate max-w-[150px]">
                      {profile?.username || user.email}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="px-4 py-2 text-sm bg-error text-on-error rounded-full hover:bg-opacity-90 transition-colors shadow-sm"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="px-5 py-2 text-primary font-medium hover:bg-surface-container rounded-full transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="px-5 py-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold rounded-full hover:shadow-md transition-all">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Content wrapper with top padding to account for fixed navbar */}
        <div className="pt-20">

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
      </div>
      <Analytics />
    </Router>
  );
};

export default App;
