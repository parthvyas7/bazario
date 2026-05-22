import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import { useCartStore } from "./stores/cartStore";
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
import BuyerHome from "./pages/BuyerHome";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, profile, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && profile?.user_type !== requiredRole) {
    if (profile?.user_type === "seller") {
      return <Navigate to="/seller-dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
};

const SellerRedirectGuard = () => {
  const { profile, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) return null;

  if (profile?.user_type === "seller" && location.pathname !== "/seller-dashboard") {
    return <Navigate to="/seller-dashboard" replace />;
  }

  return null;
};

const App = () => {
  const { user, profile, isInitialized, initialize, signOut } = useAuthStore();
  const { cart, fetchCart } = useCartStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isInitialized) {
      if (user) {
        if (profile?.user_type === "buyer") {
          fetchCart(user.id);
        }
      } else {
        fetchCart(null);
      }
    }
  }, [isInitialized, user, profile, fetchCart]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <SellerRedirectGuard />
      <div className="min-h-screen bg-gray-100">
        {profile?.user_type !== "seller" && (
          <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-sm">
            <div className="flex justify-between items-center px-8 h-20 w-full max-w-[1920px] mx-auto">
              {/* Brand Logo */}
              <Link
                to={profile?.user_type === "seller" ? "/seller-dashboard" : "/"}
                className="text-2xl font-bold text-primary font-headline tracking-tight hover:opacity-80 transition-opacity"
              >
                Bazario
              </Link>

              {/* Navigation Links */}
              <div className="flex items-center gap-8 font-headline tracking-tight">
                <Link
                  to="/products"
                  className="text-primary font-semibold hover:text-secondary transition-colors duration-300"
                >
                  Products
                </Link>

                <Link
                  to="/cart"
                  className="relative p-2 text-on-surface/70 hover:text-secondary transition-colors duration-300 flex items-center"
                  aria-label="Shopping Cart"
                >
                  <span className="material-symbols-outlined text-2xl">shopping_cart</span>
                  {cart.reduce((total, item) => total + item.quantity, 0) > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white animate-pulse">
                      {cart.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  )}
                </Link>

                {user ? (
                  <>
                    {profile?.user_type === "buyer" && (
                      <Link
                        to="/orders"
                        className="text-on-surface/70 hover:text-secondary transition-colors duration-300"
                      >
                        My Orders
                      </Link>
                    )}
                    <div className="flex items-center gap-4 ml-4">
                      <span className="text-sm font-medium text-on-surface-variant truncate max-w-[150px]">
                        {profile?.store_name || profile?.full_name || user.email}
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
                    <Link
                      to="/login"
                      className="px-5 py-2 text-primary font-medium hover:bg-surface-container rounded-full transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-5 py-2 bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold rounded-full hover:shadow-md transition-all"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </nav>
        )}

        {/* Content wrapper with top padding to account for fixed navbar */}
        <div className={profile?.user_type === "seller" ? "" : "pt-20"}>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                profile?.user_type === "seller" ? (
                  <Navigate to="/seller-dashboard" replace />
                ) : user ? (
                  <Navigate to="/" replace />
                ) : (
                  <LoginForm />
                )
              }
            />
            <Route
              path="/register"
              element={
                profile?.user_type === "seller" ? (
                  <Navigate to="/seller-dashboard" replace />
                ) : user ? (
                  <Navigate to="/" replace />
                ) : (
                  <RegisterForm />
                )
              }
            />
            <Route
              path="/"
              element={
                profile?.user_type === "seller" ? (
                  <Navigate to="/seller-dashboard" replace />
                ) : (
                  <BuyerHome />
                )
              }
            />
            <Route
              path="/products"
              element={
                profile?.user_type === "seller" ? (
                  <Navigate to="/seller-dashboard" replace />
                ) : (
                  <ProductListing />
                )
              }
            />
            <Route
              path="/product/:productId"
              element={
                profile?.user_type === "seller" ? (
                  <Navigate to="/seller-dashboard" replace />
                ) : (
                  <ProductDetail />
                )
              }
            />
            <Route
              path="/seller/:sellerId"
              element={
                profile?.user_type === "seller" ? (
                  <Navigate to="/seller-dashboard" replace />
                ) : (
                  <SellerProfilePage />
                )
              }
            />

            {/* Protected Routes */}
            <Route
              path="/cart"
              element={<ShoppingCart />}
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
            <Route
              path="*"
              element={
                profile?.user_type === "seller" ? (
                  <Navigate to="/seller-dashboard" replace />
                ) : (
                  <Navigate to="/" replace />
                )
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
