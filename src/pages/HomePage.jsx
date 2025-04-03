import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { useAuthStore } from '../stores/authStore';
import ProductCard from '../components/common/ProductCard';
import FeaturedCategories from '../components/common/FeaturedCategories';
import Banner from '../components/common/Banner';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // Get featured products (e.g., products with high ratings)
        const featured = await productService.getFeaturedProducts();
        setFeaturedProducts(featured);

        // Get newest products
        const newest = await productService.getNewArrivals();
        setNewArrivals(newest);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderUserSpecificContent = () => {
    if (!user) {
      return (
        <div className="bg-gray-50 p-8 rounded-lg text-center my-8">
          <h2 className="text-2xl font-semibold mb-4">Join Our Marketplace Today!</h2>
          <p className="mb-6">Sign up now to start buying or selling on our platform.</p>
          <div className="flex justify-center gap-4">
            <Link to="/auth/register" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Register
            </Link>
            <Link to="/auth/login" className="border border-blue-600 text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50 transition-colors">
              Login
            </Link>
          </div>
        </div>
      );
    }

    if (user.role === 'buyer') {
      return (
        <div className="bg-blue-50 p-6 rounded-lg my-8">
          <h2 className="text-xl font-semibold mb-2">Welcome back, {user.firstName || 'Buyer'}!</h2>
          <p className="mb-4">Continue shopping or check your orders.</p>
          <div className="flex gap-4">
            <Link to="/buyer/orders" className="text-blue-600 hover:underline">
              View My Orders
            </Link>
            <Link to="/buyer/cart" className="text-blue-600 hover:underline">
              Go to Cart
            </Link>
          </div>
        </div>
      );
    }

    if (user.role === 'seller') {
      return (
        <div className="bg-green-50 p-6 rounded-lg my-8">
          <h2 className="text-xl font-semibold mb-2">Welcome back, {user.firstName || 'Seller'}!</h2>
          <p className="mb-4">Manage your store or check your orders.</p>
          <div className="flex gap-4">
            <Link to="/seller/dashboard" className="text-green-600 hover:underline">
              Seller Dashboard
            </Link>
            <Link to="/seller/orders" className="text-green-600 hover:underline">
              View Orders
            </Link>
          </div>
        </div>
      );
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-500 my-8">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Banner />
      
      {renderUserSpecificContent()}
      
      <FeaturedCategories />

      {/* Featured Products Section */}
      <section className="my-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-blue-600 hover:underline">
            View All
          </Link>
        </div>
        
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No featured products available at the moment.</p>
        )}
      </section>

      {/* New Arrivals Section */}
      <section className="my-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">New Arrivals</h2>
          <Link to="/products?sort=newest" className="text-blue-600 hover:underline">
            View All
          </Link>
        </div>
        
        {newArrivals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No new products available at the moment.</p>
        )}
      </section>
    </div>
  );
};

export default HomePage;