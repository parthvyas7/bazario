import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../../stores/productStore';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';

const ProductList = () => {
  const { products, fetchProducts, isLoading, error, filters, setFilters } = useProductStore();
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState({});
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, filters]);
  
  const handleAddToCart = async (productId) => {
    if (!user) return;
    await addItem(user.id, productId, quantity[productId] || 1);
    setQuantity(prev => ({ ...prev, [productId]: 1 }));
  };
  
  const handleQuantityChange = (productId, value) => {
    setQuantity(prev => ({ ...prev, [productId]: value }));
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ [name]: value });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Products</h2>
      
      {/* Filter Section */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-2">Filters</h3>
        <div className="flex flex-wrap gap-4">
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={filters.category || ''}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Home">Home</option>
              <option value="Beauty">Beauty</option>
              <option value="Books">Books</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
          
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Price
            </label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice || ''}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Min Price"
              min="0"
            />
          </div>
          
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Price
            </label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice || ''}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Max Price"
              min="0"
            />
          </div>
          
          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              name="searchQuery"
              value={filters.searchQuery || ''}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Search products..."
            />
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center">
          <p className="text-gray-600">Loading products...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {product.images && product.images.length > 0 ? (
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
              
              <div className="p-4">
                <Link to={`/product/${product.id}`} className="block">
                  <h3 className="text-lg font-semibold mb-1 hover:text-blue-600">
                    {product.name}
                  </h3>
                </Link>
                
                <p className="text-gray-600 text-sm mb-2">
                  Seller: {product.sellers?.store_name || 'Unknown'}
                </p>
                
                <p className="text-gray-800 font-bold mb-2">
                  ${product.price.toFixed(2)}
                </p>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center mt-2">
                  <input
                    type="number"
                    min="1"
                    max={product.stock_quantity}
                    value={quantity[product.id] || 1}
                    onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                    className="w-16 px-2 py-1 border rounded mr-2 text-center"
                  />
                  
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    disabled={!user}
                    className="flex-1 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Add to Cart
                  </button>
                </div>
                
                {!user && (
                  <p className="text-xs text-red-500 mt-1">
                    Please <Link to="/login" className="underline">login</Link> to add items to cart
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
