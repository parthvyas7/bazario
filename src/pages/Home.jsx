import { useEffect } from 'react';
import { ProductList } from '../components/buyer/ProductList';
import { useProductStore } from '../stores/productStore';
import { FeaturedSellers } from '../components/buyer/FeaturedSellers';
import { HeroSection } from '../components/common/HeroSection';
import { CategoryFilter } from '../components/common/CategoryFilter';

const Home = () => {
  const { fetchProducts, products, isLoading } = useProductStore();
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <CategoryFilter />
      <h2 className="text-2xl font-bold my-6">Featured Products</h2>
      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <ProductList products={products} />
      )}
      <FeaturedSellers />
    </div>
  );
};

export default Home;