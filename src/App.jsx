import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import { useCartStore } from "./stores/cartStore";
import PropTypes from "prop-types";
import { Analytics } from "@vercel/analytics/react";
import { useEffect, useState, useRef } from "react";
import supabase from "./utils/supabase";

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
import Payment from "./pages/Payment";
import { formatPrice } from "./utils/services";

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

const Navbar = ({ profile, user, handleSignOut, cart }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  // Sync searchQuery with URL param if on products page
  useEffect(() => {
    if (location.pathname === "/products") {
      const params = new URLSearchParams(location.search);
      setSearchQuery(params.get("search") || "");
    } else {
      setSearchQuery("");
    }
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
      }
      setIsSearching(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, name, price, image_url, category")
          .eq("visibility", "Listed")
          .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`)
          .limit(5);

        if (!error && data) {
          setSuggestions(data);
        }
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleSuggestionClick = (productId) => {
    setShowSuggestions(false);
    setSearchQuery("");
    navigate(`/product/${productId}`);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-sm border-b border-outline-variant/10">
      <div className="flex justify-between items-center px-8 h-20 w-full max-w-[1920px] mx-auto gap-6">
        {/* Brand Logo */}
        <Link
          to={profile?.user_type === "seller" ? "/seller-dashboard" : "/"}
          className="text-2xl font-bold text-primary font-headline tracking-tight hover:opacity-80 transition-opacity flex-shrink-0"
        >
          Bazario
        </Link>

        {/* Global Search Bar */}
        <div ref={searchRef} className="relative flex-grow max-w-xl mx-4">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-on-surface-variant pointer-events-none">
              search
            </span>
            <input
              type="text"
              placeholder="Search products, categories..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full pl-12 pr-10 py-2.5 rounded-full border border-outline-variant/30 bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface font-body text-sm shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSuggestions([]);
                }}
                className="absolute right-4 text-on-surface-variant hover:text-primary flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
          </form>

          {/* Suggestions Dropdown */}
          {showSuggestions && (suggestions.length > 0 || (searchQuery.trim().length > 0 && isSearching)) && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white/95 backdrop-blur-md border border-outline-variant/20 rounded-2xl shadow-xl overflow-hidden z-50 max-h-[400px] overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-sm text-on-surface-variant animate-pulse">
                  Searching...
                </div>
              ) : (
                <div className="py-2">
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSuggestionClick(item.id)}
                      className="w-full flex items-center gap-4 px-4 py-3 hover:bg-surface-container-high/60 transition-colors text-left border-b border-surface-container-highest/20 last:border-b-0"
                    >
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover bg-surface-container-low flex-shrink-0"
                      />
                      <div className="flex-grow min-w-0">
                        <h4 className="text-sm font-semibold text-primary truncate">
                          {item.name}
                        </h4>
                        <span className="text-xs text-on-surface-variant bg-surface-container-highest px-2 py-0.5 rounded-full mt-1 inline-block">
                          {item.category}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-secondary flex-shrink-0">
                        ₹{formatPrice(item.price)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-8 font-headline tracking-tight flex-shrink-0">

          <Link
            to="/cart"
            className="relative p-2 text-on-surface/70 hover:text-secondary transition-colors duration-300 flex items-center"
            aria-label="Shopping Cart"
          >
            <span className="material-symbols-outlined text-2xl">shopping_cart</span>
            {cart.reduce((total, item) => total + item.quantity, 0) > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white">
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
                  {profile?.store_name || user?.user_metadata?.name || user?.user_metadata?.full_name || profile?.full_name || user?.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm bg-error text-on-error rounded-full hover:bg-opacity-90 transition-colors shadow-sm font-semibold"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="px-5 py-2 text-primary font-semibold hover:bg-surface-container rounded-full transition-colors"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  profile: PropTypes.object,
  user: PropTypes.object,
  handleSignOut: PropTypes.func.isRequired,
  cart: PropTypes.array.isRequired,
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
          <Navbar profile={profile} user={user} handleSignOut={handleSignOut} cart={cart} />
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
              path="/payment"
              element={
                <ProtectedRoute requiredRole="buyer">
                  <Payment />
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
