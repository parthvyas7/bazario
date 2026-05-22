import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProductStore } from '../stores/productStore';
import { useCartStore } from '../stores/cartStore';
import { ProductReviews } from '../components/buyer/ProductReviews';
import { SellerInfo } from '../components/buyer/SellerInfo';
import { RelatedProducts } from '../components/buyer/RelatedProducts';
import supabase from '../utils/supabase';
import { formatPrice } from '../utils/services';

const ProductDetail = () => {
  const { productId } = useParams();
  const { getProduct, currentProduct, isLoading } = useProductStore();
  const { cart, addToCart, updateQuantity } = useCartStore();
  const [activeTab, setActiveTab] = useState('specs');
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Custom added state variables
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isNotified, setIsNotified] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const imageConfigs = [
    { id: 0, label: 'Default View', className: 'object-cover w-full h-full' },
    { id: 1, label: 'Full View', className: 'object-contain p-4 bg-white/50 w-full h-full' },
    { id: 2, label: 'Close-up View', className: 'object-cover scale-150 origin-center w-full h-full' }
  ];

  // Reset states when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
    setIsNotified(false);
    setNotification(null);
    setIsLightboxOpen(false);
  }, [productId]);

  const handleNotifyMe = () => {
    setIsNotified(true);
    setNotification({
      type: 'success',
      message: `Success! You will be notified as soon as ${currentProduct?.name} is back in stock.`
    });
    // Auto dismiss notification after 5s
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    setReviewsLoading(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, buyers(full_name)")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setReviews(data);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    getProduct(productId);
    fetchReviews();
  }, [getProduct, productId, fetchReviews]);

  const handleAddToCart = () => {
    addToCart(currentProduct, 1);
  };

  const handleBuyNow = async () => {
    await addToCart(currentProduct, 1);
    navigate('/cart');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const reviewsCount = reviews.length;
  const averageRating = reviewsCount > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount
    : 0;

  return (
    <main className="pt-28 pb-20 px-4 md:px-8 max-w-[1440px] mx-auto min-h-screen">
      {/* Floating Toast Notification */}
      {notification && (
        <div className="fixed bottom-8 right-8 z-50 p-4 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-800/80 flex items-center gap-3 max-w-sm animate-bounce">
          <span className="material-symbols-outlined text-secondary">
            {notification.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span className="text-sm font-semibold">{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-auto hover:text-secondary flex items-center">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Lightbox / Popout Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 transition-all duration-300"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close button */}
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-200"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
          
          {/* Large image */}
          <div 
            className="relative max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl bg-black/50 shadow-2xl flex items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
          >
            <img 
              className={`max-w-full max-h-[85vh] object-contain rounded-2xl ${imageConfigs[selectedImageIndex].id === 2 ? 'scale-125' : ''}`} 
              src={currentProduct?.imageUrl || currentProduct?.image_url} 
              alt={currentProduct.name} 
            />
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-on-surface-variant uppercase tracking-widest">
        <Link className="hover:text-primary transition-colors" to="/">Home</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <a className="hover:text-primary transition-colors" href="#">{currentProduct?.category || 'Category'}</a>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-on-surface line-clamp-1">{currentProduct?.name}</span>
      </nav>

      {currentProduct && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Product Image Gallery (Bento-ish layout) */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
            <div className="flex md:flex-col gap-4 order-2 md:order-1 no-scrollbar overflow-x-auto">
              {imageConfigs.map((config, index) => (
                <div
                  key={config.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden cursor-pointer bg-surface-container-lowest shrink-0 transition-all ${
                    selectedImageIndex === index 
                      ? 'ring-2 ring-primary scale-95 shadow-sm' 
                      : 'hover:ring-2 ring-outline-variant opacity-80 hover:opacity-100'
                  }`}
                >
                  <img 
                    className={`w-full h-full object-cover`} 
                    src={currentProduct?.imageUrl || currentProduct?.image_url} 
                    alt={config.label} 
                  />
                </div>
              ))}
            </div>
            
            <div className="flex-1 relative group order-1 md:order-2 overflow-visible">
              <div 
                onClick={() => setIsLightboxOpen(true)}
                className="aspect-[4/5] rounded-xl overflow-hidden bg-surface-container-low transition-transform duration-500 hover:scale-[1.02] cursor-zoom-in relative"
              >
                <img 
                  className={`w-full h-full transition-all duration-300 ${imageConfigs[selectedImageIndex].className}`} 
                  src={currentProduct?.imageUrl || currentProduct?.image_url} 
                  alt={currentProduct.name} 
                />
                {/* Hover indication */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="material-symbols-outlined text-white text-3xl drop-shadow-md">zoom_in</span>
                </div>
              </div>
              
              {/* Optional Edition badge */}
              {currentProduct.price > 1000 && (
                <div className="absolute -bottom-4 -right-4 bg-secondary-fixed p-4 rounded-xl shadow-lg hidden md:block">
                  <span className="text-on-secondary-fixed text-xs font-bold uppercase tracking-wider">Premium Selection</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <section>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-secondary text-sm">
                  {[...Array(5)].map((_, i) => {
                    const starValue = i + 1;
                    let fillVal = 0;
                    let starIcon = 'star';
                    if (averageRating >= starValue) {
                      fillVal = 1;
                    } else if (averageRating >= starValue - 0.5) {
                      fillVal = 1;
                      starIcon = 'star_half';
                    } else {
                      fillVal = 0;
                    }
                    return (
                      <span key={i} className="material-symbols-outlined text-sm select-none" style={{fontVariationSettings: `'FILL' ${fillVal}`}}>
                        {starIcon}
                      </span>
                    );
                  })}
                </div>
                <span className="text-xs font-medium text-on-surface-variant">
                  {reviews.length > 0 ? `(${averageRating.toFixed(1)} / ${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'})` : '(0.0 / 0 reviews)'}
                </span>
              </div>
              <h1 className="text-4xl font-extrabold text-primary mb-4 leading-tight">{currentProduct.name}</h1>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-headline font-bold text-secondary">₹</span>
                <span className="text-5xl font-headline font-black text-on-surface tracking-tighter">
                    {formatPrice(currentProduct.price)}
                </span>
              </div>
              
              <div className="space-y-6 text-on-surface-variant leading-relaxed">
                <p className="text-lg">{currentProduct.description}</p>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 rounded-xl bg-surface-container-low">
                    <span className="text-xs uppercase tracking-widest block mb-1">Availability</span>
                    <span className="text-on-surface font-semibold">{currentProduct.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              {currentProduct.stock_quantity <= 0 ? (
                <button 
                  onClick={handleNotifyMe}
                  disabled={isNotified}
                  className={`w-full h-16 rounded-full text-white text-lg font-bold shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
                    isNotified 
                      ? 'bg-success/80 shadow-success/10 cursor-default' 
                      : 'bg-primary hover:bg-primary-container shadow-primary/20 hover:scale-[1.01]'
                  }`}
                >
                  <span className="material-symbols-outlined">
                    {isNotified ? 'check_circle' : 'notifications'}
                  </span>
                  {isNotified ? 'Notification Registered' : 'Notify me'}
                </button>
              ) : (
                <>
                  {(() => {
                    const cartItem = cart.find(item => item.product_id === currentProduct.id);
                    if (cartItem) {
                      return (
                        <div className="flex-1 h-16 rounded-full border-2 border-primary text-primary text-lg font-bold flex items-center justify-between px-6 bg-surface-container-low shadow-sm">
                          <button 
                            onClick={() => updateQuantity(currentProduct.id, cartItem.quantity - 1)}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:text-error transition-colors shadow-xs"
                          >
                            <span className="material-symbols-outlined">remove</span>
                          </button>
                          <span className="w-10 text-center font-headline font-black text-xl">{cartItem.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(currentProduct.id, cartItem.quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:text-primary transition-colors shadow-xs"
                          >
                            <span className="material-symbols-outlined">add</span>
                          </button>
                        </div>
                      );
                    }
                    return (
                      <button 
                        onClick={handleAddToCart}
                        className="flex-1 h-16 rounded-full border-2 border-primary text-primary text-lg font-bold hover:bg-primary/5 active:scale-[0.98] transition-all"
                      >
                        Add to Cart
                      </button>
                    );
                  })()}
                  <button 
                    onClick={handleBuyNow}
                    className="flex-1 h-16 rounded-full bg-gradient-to-r from-secondary to-secondary-container text-white text-lg font-bold shadow-lg shadow-secondary/20 hover:scale-[1.01] active:scale-[0.98] transition-all"
                  >
                    Buy Now
                  </button>
                </>
              )}
            </div>

            {/* Seller Info Card */}
            <SellerInfo sellerId={currentProduct.seller_id} />
          </div>
        </div>
      )}

      {/* Tabs: Specs & Description & Reviews */}
      <section className="mt-24">
        <div className="flex gap-12 border-b border-outline-variant mb-8 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('specs')}
            className={`pb-4 border-b-2 font-bold whitespace-nowrap ${activeTab === 'specs' ? 'border-secondary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary transition-colors'}`}
          >
            Product Details
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 border-b-2 font-bold whitespace-nowrap ${activeTab === 'reviews' ? 'border-secondary text-primary' : 'border-transparent text-on-surface-variant hover:text-primary transition-colors'}`}
          >
            Reviews ({reviewsCount})
          </button>
        </div>

        {activeTab === 'specs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-primary">Specifications</h4>
              <ul className="space-y-4">
                <li className="flex justify-between py-2 border-b border-surface-container-highest">
                  <span className="text-on-surface-variant">Name</span>
                  <span className="font-semibold text-right">{currentProduct?.name}</span>
                </li>
                <li className="flex justify-between py-2 border-b border-surface-container-highest">
                  <span className="text-on-surface-variant">Category</span>
                  <span className="font-semibold text-right truncate pl-4">{currentProduct?.category || 'General'}</span>
                </li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-primary">Quality Assurance</h4>
              <p className="text-on-surface-variant leading-relaxed">
                Every item is rigorously inspected to ensure quality and authenticity. Bazario&apos;s product catalog maintains the highest standards of craftsmanship.
              </p>
              <div className="flex gap-4 items-center">
                <span className="material-symbols-outlined text-secondary">verified</span>
                <span className="text-sm font-medium text-on-surface">Verified Authentic</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <ProductReviews 
              productId={productId} 
              reviews={reviews} 
              loading={reviewsLoading} 
              onReviewSubmitted={fetchReviews} 
            />
          </div>
        )}
      </section>

      {/* Related Products */}
      <div className="mt-32">
        <RelatedProducts 
          categoryId={currentProduct?.categoryId || currentProduct?.category} 
          currentProductId={productId} 
        />
      </div>
    </main>
  );
};

export default ProductDetail;