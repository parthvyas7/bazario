import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { sellerService } from '../../utils/sellerService';
import { productService } from '../../utils/productService';
import { ProductList } from '../../components/buyer/ProductList';
import { SellerRating } from '../../components/buyer/SellerRating';
import { CategoryFilter } from '../../components/common/CategoryFilter';

const SellerProfile = () => {
  const { sellerId } = useParams();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchSellerData = async () => {
      setIsLoading(true);
      try {
        const sellerData = await sellerService.getSellerById(sellerId);
        setSeller(sellerData);
        
        const sellerProducts = await productService.getProductsBySeller(sellerId);
        setProducts(sellerProducts);
      } catch (error) {
        console.error('Error fetching seller data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSellerData();
  }, [sellerId]);

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.categoryId === selectedCategory);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {seller && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {seller.profileImageUrl ? (
                <img 
                  src={seller.profileImageUrl} 
                  alt={seller.storeName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl text-gray-500">{seller.storeName.charAt(0)}</span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{seller.storeName}</h1>
              <div className="mb-3">
                <SellerRating sellerId={sellerId} />
              </div>
              <p className="text-gray-700 mb-3">{seller.description}</p>
              <div className="text-sm text-gray-500">
                <p>Member since: {new Date(seller.createdAt).toLocaleDateString()}</p>
                <p>Location: {seller.location}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6">Products by {seller?.storeName}</h2>
      
      <CategoryFilter 
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      
      {filteredProducts.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center mt-8">
          <p className="text-gray-600">
            No products found in this category.
          </p>
        </div>
      ) : (
        <ProductList products={filteredProducts} />
      )}
    </div>
  );
};

export default SellerProfile;
