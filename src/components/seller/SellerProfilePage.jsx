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

  if (loading) {
    return (
      <div className="pt-24 pb-12 px-6 max-w-screen-2xl mx-auto min-h-[70vh]">
        <p className="text-on-surface-variant font-medium animate-pulse">Loading storefront...</p>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="pt-24 pb-12 px-6 max-w-screen-2xl mx-auto min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-outline-variant text-6xl mb-4">store_off</span>
          <h2 className="text-2xl font-bold font-headline text-primary mb-2">Store Not Found</h2>
          <p className="text-on-surface-variant">The curator you are looking for does not exist or has closed their shop.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface font-body pt-20">
      {/* Store Hero Section */}
      <div className="relative bg-surface-container-low overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary/5 via-secondary/5 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="max-w-screen-2xl mx-auto px-6 py-16 md:py-24 relative z-10 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-shrink-0 w-40 h-40 md:w-56 md:h-56 relative rounded-full p-2 bg-gradient-to-br from-primary to-secondary">
            <img 
              src={seller.profile_image || '/default-avatar.png'} 
              alt={seller.store_name} 
              className="w-full h-full rounded-full object-cover border-4 border-surface shadow-2xl"
            />
            {/* Elite Badge */}
            <div className="absolute -bottom-2 md:bottom-2 -right-2 md:-right-6 bg-secondary text-white px-4 py-2 rounded-full font-headline font-bold text-[10px] md:text-xs tracking-widest uppercase shadow-xl flex items-center gap-1 border-2 border-surface">
              <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
              Elite Tier
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tight text-primary leading-tight">
              {seller.store_name || "Untitled Store"}
            </h1>
            <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl mx-auto md:mx-0">
              {seller.bio || "A curator of fine goods and aesthetic collections."}
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium">
                <span className="material-symbols-outlined text-outline">calendar_month</span>
                <span>Est. {new Date(seller.created_at).getFullYear()}</span>
              </div>
              {seller.contact_email && (
                <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium">
                  <span className="material-symbols-outlined text-outline">mail</span>
                  <span>{seller.contact_email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Catalog Section */}
      <div className="max-w-screen-2xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between border-b border-surface-container-highest pb-6 mb-12">
          <div>
            <p className="text-xs font-headline font-bold uppercase tracking-widest text-primary/40 mb-1">The Gallery</p>
            <h2 className="text-3xl font-headline font-bold text-primary">Curated Collection</h2>
          </div>
          <p className="text-sm font-bold text-on-surface-variant hidden md:block">{products.length} Items Available</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-lowest rounded-3xl border border-outline-variant/10">
            <span className="material-symbols-outlined text-6xl text-outline-variant/50 mb-4">inventory_2</span>
            <h3 className="text-xl font-bold font-headline text-on-surface mb-2">The Gallery is Empty</h3>
            <p className="text-on-surface-variant max-w-md mx-auto">This curator hasn't added any products to their collection yet. Check back soon for new arrivals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => (
              <div 
                key={product.id} 
                className="group flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-outline-variant/10 hover:border-primary/20"
              >
                <div className="aspect-[4/5] relative overflow-hidden bg-surface-container-low">
                  <img 
                    src={product.image_url || '/placeholder-image.png'} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h4 className="font-headline font-bold text-lg text-on-surface line-clamp-1 mb-2 group-hover:text-primary transition-colors">{product.name}</h4>
                  <p className="text-sm font-body text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">{product.description}</p>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-surface-container-highest">
                    <p className="font-headline font-black text-xl text-primary">₹{product.price.toFixed(2)}</p>
                    <button 
                      onClick={() => addToCart(product)}
                      className="w-10 h-10 rounded-full bg-surface-container-high text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-300"
                      aria-label={`Add ${product.name} to bag`}
                    >
                      <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>shopping_bag</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProfilePage;