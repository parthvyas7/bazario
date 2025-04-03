import { useState, useEffect } from 'react';
import supabase from '../../utils/supabase';
import { useCartStore } from '../../stores/cartStore';
import { useNavigate } from 'react-router-dom';

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*, sellers(store_name)');
    
    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data);
    }
    setLoading(false);
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleViewSellerStore = (sellerId) => {
    navigate(`/seller/${sellerId}`);
  };

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <input 
        type="text" 
        placeholder="Search products..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredProducts.map(product => (
          <div 
            key={product.id} 
            className="border rounded p-4 shadow-md hover:shadow-lg transition-shadow"
          >
            <img 
              src={product.image_url || '/placeholder-image.png'} 
              alt={product.name} 
              className="w-full h-48 object-cover mb-4"
            />
            <h3 className="text-xl font-bold mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <p className="text-lg font-semibold mb-2">${product.price}</p>
            <p className="text-sm text-gray-500 mb-2">
              Store: {product.sellers?.store_name || 'Unknown'}
            </p>
            <div className="flex justify-between">
              <button 
                onClick={() => handleAddToCart(product)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add to Cart
              </button>
              <button 
                onClick={() => handleViewSellerStore(product.seller_id)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                View Store
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListing;