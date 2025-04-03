import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../utils/supabase';
import { useCartStore } from '../../stores/cartStore';

const SellerProfilePage = () => {
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { sellerId } = useParams();
  const { addToCart } = useCartStore();

  useEffect(() => {
    fetchSellerDetails();
  }, [sellerId]);

  const fetchSellerDetails = async () => {
    setLoading(true);
    try {
      // Fetch seller details
      const { data: sellerData, error: sellerError } = await supabase
        .from('sellers')
        .select('*')
        .eq('id', sellerId)
        .single();

      // Fetch seller's products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', sellerId);

      if (sellerError) throw sellerError;
      if (productsError) throw productsError;

      setSeller(sellerData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching seller details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading seller profile...</div>;
  if (!seller) return <div>Seller not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex items-center mb-6">
          <img 
            src={seller.profile_image || '/default-avatar.png'} 
            alt={seller.store_name} 
            className="w-24 h-24 rounded-full mr-6 object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold">{seller.store_name}</h2>
            <p className="text-gray-600">{seller.bio}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Contact Information</h3>
            <p>{seller.contact_email}</p>
            <p>{seller.phone_number}</p>
          </div>
          <div>
            <h3 className="font-semibold">Store Details</h3>
            <p>Established: {new Date(seller.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">Products from {seller.store_name}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map(product => (
          <div 
            key={product.id} 
            className="border rounded p-4 shadow-md hover:shadow-lg transition-shadow"
          >
            <img 
              src={product.image_url || '/placeholder-image.png'} 
              alt={product.name} 
              className="w-full h-48 object-cover mb-4"
            />
            <h4 className="text-lg font-bold mb-2">{product.name}</h4>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <p className="text-lg font-semibold mb-4">${product.price}</p>
            <button 
              onClick={() => addToCart(product)}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerProfilePage;