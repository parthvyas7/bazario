import { Routes, Route, Navigate } from "react-router-dom";

// Layout Components
import MainLayout from "../components/layout/MainLayout";
import SellerLayout from "../components/layout/SellerLayout";

// Auth Pages
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

// Shared Pages
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import ProductDetail from "../pages/ProductDetail";
import Checkout from "../pages/Checkout";
import OrderConfirmation from "../pages/OrderConfirmation";

// Buyer Pages
import BuyerOrders from "../pages/buyer/BuyerOrders";
import SellerProfile from "../pages/buyer/SellerProfile";

// Seller Pages
import SellerDashboard from "../pages/seller/SellerDashboard";
import SellerOrders from "../pages/seller/SellerOrders";
import SellerProducts from "../pages/seller/SellerProducts";

// Route Protection
import PrivateRouteWrapper from "../pages/PrivateRouteWrapper";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Main Layout Routes */}
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/sellers/:sellerId" element={<SellerProfile />} />

        {/* Auth Routes */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        {/* Protected Buyer Routes */}
        <Route
          path="/buyer/orders"
          element={
            <PrivateRouteWrapper allowedRoles={["buyer"]}>
              <BuyerOrders />
            </PrivateRouteWrapper>
          }
        />

        <Route
          path="/checkout"
          element={
            <PrivateRouteWrapper allowedRoles={["buyer"]}>
              <Checkout />
            </PrivateRouteWrapper>
          }
        />

        <Route
          path="/order-confirmation/:orderId"
          element={
            <PrivateRouteWrapper allowedRoles={["buyer"]}>
              <OrderConfirmation />
            </PrivateRouteWrapper>
          }
        />
      </Route>

      {/* Seller Layout Routes */}
      <Route
        element={
          <PrivateRouteWrapper allowedRoles={["seller"]}>
            <SellerLayout />
          </PrivateRouteWrapper>
        }
      >
        <Route
          path="/seller"
          element={<Navigate to="/seller/dashboard" replace />}
        />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/products" element={<SellerProducts />} />
        <Route path="/seller/orders" element={<SellerOrders />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
