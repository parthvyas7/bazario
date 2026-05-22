import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProductStore } from '../stores/productStore';
import { useCartStore } from '../stores/cartStore';
import { ProductReviews } from '../components/buyer/ProductReviews';
import { SellerInfo } from '../components/buyer/SellerInfo';
import { RelatedProducts } from '../components/buyer/RelatedProducts';
import supabase from '../utils/supabase';

const ProductDetail = () => {
  const { productId } = useParams();
  const { getProduct, currentProduct, isLoading } = useProductStore();
  const { addToCart } = useCartStore();
  const [activeTab, setActiveTab] = useState('specs');
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

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
              {/* Dummy thumbnails since we only have one imageUrl */}
              <div className="w-20 h-20 rounded-xl overflow-hidden cursor-pointer ring-2 ring-primary bg-surface-container-lowest shrink-0">
                <img className="w-full h-full object-cover" src={currentProduct?.imageUrl || currentProduct?.image_url} alt={currentProduct.name} />
              </div>
              <div className="w-20 h-20 rounded-xl overflow-hidden cursor-pointer hover:ring-2 ring-outline-variant bg-surface-container-lowest transition-all shrink-0">
                <img className="w-full h-full object-cover opacity-80 hover:opacity-100" src={currentProduct?.imageUrl || currentProduct?.image_url} alt="Thumbnail 2" />
              </div>
              <div className="w-20 h-20 rounded-xl overflow-hidden cursor-pointer hover:ring-2 ring-outline-variant bg-surface-container-lowest transition-all shrink-0">
                <img className="w-full h-full object-cover opacity-80 hover:opacity-100" src={currentProduct?.imageUrl || currentProduct?.image_url} alt="Thumbnail 3" />
              </div>
            </div>
            
            <div className="flex-1 relative group order-1 md:order-2 overflow-visible">
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-surface-container-low transition-transform duration-500 hover:scale-[1.02]">
                <img className="w-full h-full object-cover" src={currentProduct?.imageUrl || currentProduct?.image_url} alt={currentProduct.name} />
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
                <span className="text-5xl font-headline font-black text-on-surface tracking-tighter">{Number(currentProduct.price).toFixed(2)}</span>
              </div>
              
              <div className="space-y-6 text-on-surface-variant leading-relaxed">
                <p className="text-lg">{currentProduct.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-surface-container-low">
                    <span className="text-xs uppercase tracking-widest block mb-1">Availability</span>
                    <span className="text-on-surface font-semibold">{currentProduct.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-container-low">
                    <span className="text-xs uppercase tracking-widest block mb-1">Condition</span>
                    <span className="text-on-surface font-semibold">Brand New</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <button 
                onClick={handleAddToCart}
                disabled={currentProduct.stock_quantity <= 0}
                className="flex-1 h-16 rounded-full border-2 border-primary text-primary text-lg font-bold hover:bg-primary/5 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                disabled={currentProduct.stock_quantity <= 0}
                className="flex-1 h-16 rounded-full bg-gradient-to-r from-secondary to-secondary-container text-white text-lg font-bold shadow-lg shadow-secondary/20 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
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
                Every item is rigorously inspected to ensure quality and authenticity. Bazario&apos;s curated collection maintains the highest standards of craftsmanship.
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