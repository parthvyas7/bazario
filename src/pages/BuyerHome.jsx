import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../utils/supabase';
import { useCartStore } from '../stores/cartStore';
import { useWishlistStore } from '../stores/wishlistStore';

const BuyerHome = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const { cart, addToCart, updateQuantity } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      // 1. Fetch featured products (limit 8)
      const { data: featuredData, error: featuredErr } = await supabase
        .from('products')
        .select('*, sellers(store_name)')
        .eq('visibility', 'Listed')
        .limit(8);

      if (featuredErr) throw featuredErr;
      setFeaturedProducts(featuredData || []);

      // 2. Fetch new arrivals (limit 4, sorted by created_at DESC)
      const { data: arrivalsData, error: arrivalsErr } = await supabase
        .from('products')
        .select('*, sellers(store_name)')
        .eq('visibility', 'Listed')
        .order('created_at', { ascending: false })
        .limit(4);

      if (arrivalsErr) throw arrivalsErr;
      setNewArrivals(arrivalsData || []);

    } catch (err) {
      console.error('Error fetching home page data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleToggleWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${categoryName}`);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => {
        setNewsletterSubscribed(false);
      }, 5000);
    }
  };

  // Helper for Bento Grid slots fallback
  const getBentoProduct = (index, fallbackTitle, fallbackPrice, fallbackCategory, fallbackImg) => {
    if (newArrivals[index]) return newArrivals[index];
    return {
      id: 'placeholder',
      name: fallbackTitle,
      price: fallbackPrice,
      category: fallbackCategory,
      image_url: fallbackImg,
      description: 'Handcrafted premium curation'
    };
  };

  const categories = [
    { name: 'Electronics', icon: 'devices' },
    { name: 'Fashion', icon: 'checkroom' },
    { name: 'Home', icon: 'chair' },
    { name: 'Jewelry', icon: 'diamond' },
    { name: 'Beauty', icon: 'spa' },
    { name: 'Literature', icon: 'menu_book' },
    { name: 'Art', icon: 'palette' }
  ];

  const p0 = getBentoProduct(0, 'The Heritage Brogue', 4999, 'Fashion', 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80');
  const p1 = getBentoProduct(1, 'Artisanal Earthware Set', 1850, 'Home', 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80');
  const p2 = getBentoProduct(2, 'Lume Brass Hanging Lamp', 3200, 'Home', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80');
  const p3 = getBentoProduct(3, 'Optic X10 India Edition', 84999, 'Electronics', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80');

  return (
    <div className="flex flex-col min-h-screen font-body text-on-surface bg-surface">
      <main className="flex-grow pt-8 pb-20">
        {/* Hero Section: Editorial Promotional Banner */}
        <section className="px-8 mb-16">
          <div className="relative w-full h-[500px] rounded-2xl overflow-hidden bg-primary-container flex items-center">
            <div className="absolute inset-0 z-0">
              <img className="w-full h-full object-cover opacity-60" alt="Hero background" src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80"/>
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/40 to-transparent"></div>
            </div>
            <div className="relative z-10 max-w-2xl pl-12 text-white">
              <span className="font-headline font-bold uppercase tracking-widest text-secondary mb-4 block">The Indian Curator</span>
              <h1 className="text-6xl font-headline font-extrabold tracking-tight mb-6 leading-tight">Authentic Indian Craftsmanship, Reimagined.</h1>
              <p className="text-xl text-primary-fixed leading-relaxed mb-8 font-body">From artisanal home decor to cutting-edge electronics, discover the best of Bharat’s creative landscape.</p>
              <Link to="/products" className="px-8 py-4 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-headline font-bold shadow-lg hover:scale-105 transition-transform inline-block">Explore the Collection</Link>
            </div>
          </div>
        </section>

        {/* Horizontal Category Navigation */}
        <section className="px-8 mb-16">
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide no-scrollbar justify-between">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => handleCategoryClick(cat.name)}
                className="flex-shrink-0 flex flex-col items-center gap-3 cursor-pointer group flex-1 min-w-[100px]"
              >
                <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm hover:shadow-md">
                  <span className="material-symbols-outlined text-primary text-3xl group-hover:text-white transition-colors">{cat.icon}</span>
                </div>
                <span className="font-headline text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* New Arrivals: Asymmetric Bento Grid */}
        <section className="px-8 mb-24">
          <h2 className="text-3xl font-headline font-extrabold mb-8 tracking-tight flex items-center gap-2">
            New Arrivals <span className="w-12 h-1 bg-secondary rounded-full"></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[600px]">
            {/* Slot 1: Major Card (Latest Product) */}
            <div className="md:col-span-2 md:row-span-2 bg-surface-container-lowest border border-gray-100 rounded-2xl overflow-hidden relative group shadow-sm hover:shadow-md transition-shadow">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={p0.name} src={p0.image_url || "/placeholder-image.png"}/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>
              
              {/* Wishlist heart button */}
              {p0.id !== 'placeholder' && (
                <button
                  onClick={(e) => handleToggleWishlist(e, p0)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-primary shadow-sm hover:scale-115 transition-transform z-20"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontVariationSettings: isInWishlist(p0.id) ? "'FILL' 1" : "'FILL' 0",
                      color: isInWishlist(p0.id) ? '#e11d48' : 'inherit'
                    }}
                  >
                    favorite
                  </span>
                </button>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                <span className="text-secondary font-headline font-bold text-xs uppercase tracking-wider mb-2 block">{p0.category || 'NEW ARRIVAL'}</span>
                <Link to={p0.id === 'placeholder' ? '/products' : `/product/${p0.id}`} className="hover:underline">
                  <h3 className="text-white text-3xl font-headline font-bold line-clamp-1 mb-2">{p0.name}</h3>
                </Link>
                <p className="text-gray-300 text-sm font-medium line-clamp-2 mb-4 max-w-lg">{p0.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-secondary font-headline font-bold">₹</span>
                  <span className="text-2xl font-headline font-extrabold text-white">
                    {Number(p0.price).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Slot 2: Top Right Square (2nd Product) */}
            <div className="bg-surface-container-lowest border border-gray-100 rounded-2xl overflow-hidden relative group shadow-sm hover:shadow-md transition-shadow">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={p1.name} src={p1.image_url || "/placeholder-image.png"}/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              {/* Wishlist button */}
              {p1.id !== 'placeholder' && (
                <button
                  onClick={(e) => handleToggleWishlist(e, p1)}
                  className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-primary shadow-sm hover:scale-115 transition-transform z-20"
                >
                  <span
                    className="material-symbols-outlined text-xl"
                    style={{
                      fontVariationSettings: isInWishlist(p1.id) ? "'FILL' 1" : "'FILL' 0",
                      color: isInWishlist(p1.id) ? '#e11d48' : 'inherit'
                    }}
                  >
                    favorite
                  </span>
                </button>
              )}

              <div className="absolute bottom-4 left-4 right-4 z-10">
                <span className="text-secondary font-headline font-bold text-[10px] uppercase tracking-wider block">{p1.category || 'HOME'}</span>
                <Link to={p1.id === 'placeholder' ? '/products' : `/product/${p1.id}`} className="text-white font-headline font-bold line-clamp-1 hover:underline mb-1">{p1.name}</Link>
                <span className="text-white/95 font-bold text-sm">₹{Number(p1.price).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Slot 3: Bottom Right Square (3rd Product) */}
            <div className="bg-surface-container-lowest border border-gray-100 rounded-2xl overflow-hidden relative group shadow-sm hover:shadow-md transition-shadow">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={p2.name} src={p2.image_url || "/placeholder-image.png"}/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              {/* Wishlist button */}
              {p2.id !== 'placeholder' && (
                <button
                  onClick={(e) => handleToggleWishlist(e, p2)}
                  className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-primary shadow-sm hover:scale-115 transition-transform z-20"
                >
                  <span
                    className="material-symbols-outlined text-xl"
                    style={{
                      fontVariationSettings: isInWishlist(p2.id) ? "'FILL' 1" : "'FILL' 0",
                      color: isInWishlist(p2.id) ? '#e11d48' : 'inherit'
                    }}
                  >
                    favorite
                  </span>
                </button>
              )}

              <div className="absolute bottom-4 left-4 right-4 z-10">
                <span className="text-secondary font-headline font-bold text-[10px] uppercase tracking-wider block">{p2.category || 'HOME'}</span>
                <Link to={p2.id === 'placeholder' ? '/products' : `/product/${p2.id}`} className="text-white font-headline font-bold line-clamp-1 hover:underline mb-1">{p2.name}</Link>
                <span className="text-white/95 font-bold text-sm">₹{Number(p2.price).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Slot 4: Bottom Wide Block (4th Product) */}
            <div className="md:col-span-2 bg-surface-container-lowest border border-gray-100 rounded-2xl overflow-hidden relative group shadow-sm hover:shadow-md transition-shadow">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={p3.name} src={p3.image_url || "/placeholder-image.png"}/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              {/* Wishlist button */}
              {p3.id !== 'placeholder' && (
                <button
                  onClick={(e) => handleToggleWishlist(e, p3)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-primary shadow-sm hover:scale-115 transition-transform z-20"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontVariationSettings: isInWishlist(p3.id) ? "'FILL' 1" : "'FILL' 0",
                      color: isInWishlist(p3.id) ? '#e11d48' : 'inherit'
                    }}
                  >
                    favorite
                  </span>
                </button>
              )}

              <div className="absolute bottom-6 left-6 right-6 z-10 flex justify-between items-end">
                <div>
                  <span className="bg-secondary text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">{p3.category || 'PREMIUM TECH'}</span>
                  <Link to={p3.id === 'placeholder' ? '/products' : `/product/${p3.id}`} className="text-white text-2xl font-headline font-bold hover:underline block line-clamp-1">{p3.name}</Link>
                </div>
                <div className="text-white font-headline font-bold text-lg whitespace-nowrap bg-black/40 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/10">
                  ₹{Number(p3.price).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Grid */}
        <section className="px-8 mb-24 bg-surface-container-low py-16 -mx-8">
          <div className="max-w-[1920px] mx-auto px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl font-headline font-extrabold tracking-tight text-primary">Featured Selection</h2>
                <p className="text-on-surface-variant font-body mt-2">Curated by our editors for exceptional quality and design.</p>
              </div>
              <Link to="/products" className="flex items-center gap-2 text-primary font-bold hover:text-secondary group transition-colors">
                View All <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {loading ? (
                <div className="col-span-full flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : featuredProducts.length > 0 ? (
                featuredProducts.map((product) => {
                  const isFavorited = isInWishlist(product.id);
                  const isOutOfStock = product.stock_quantity <= 0;

                  return (
                    <div key={product.id} className="bg-surface-container-lowest border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between min-h-[420px] h-full">
                      <div>
                        <div className="relative h-56 mb-6 rounded-lg overflow-hidden bg-gray-50">
                          <Link to={`/product/${product.id}`} className="block w-full h-full">
                            <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={product.name} src={product.image_url || "/placeholder-image.png"}/>
                          </Link>
                          <button
                            onClick={(e) => handleToggleWishlist(e, product)}
                            className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-primary shadow-sm hover:scale-110 active:scale-95 transition-transform"
                          >
                            <span
                              className="material-symbols-outlined transition-colors duration-300"
                              style={{
                                fontVariationSettings: isFavorited ? "'FILL' 1" : "'FILL' 0",
                                color: isFavorited ? '#e11d48' : 'inherit'
                              }}
                            >
                              favorite
                            </span>
                          </button>

                          {isOutOfStock && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                              <span className="bg-error text-on-error px-3 py-1 rounded-full text-xxs font-bold uppercase tracking-wider shadow-sm">
                                Out of Stock
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-1 mb-4">
                          <Link to={`/product/${product.id}`} className="font-headline font-bold text-lg text-on-surface line-clamp-1 hover:text-primary transition-colors block">{product.name}</Link>
                          <p className="text-xs text-on-surface-variant font-medium">Sold by <span className="text-primary font-semibold">{product.sellers?.store_name || "Unknown"}</span></p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-auto border-t border-gray-50 pt-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-secondary font-headline font-bold">₹</span>
                          <span className="text-xl font-headline font-extrabold text-on-surface">
                            {Number(product.price).toLocaleString('en-IN')}
                          </span>
                        </div>
                        {(() => {
                          const cartItem = cart.find(item => item.product_id === product.id);
                          if (cartItem) {
                            return (
                              <div className="flex items-center bg-surface-container-high rounded-full px-2 h-10 gap-2 border border-outline-variant/30">
                                <button 
                                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateQuantity(product.id, cartItem.quantity - 1); }}
                                  className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-on-surface hover:text-error transition-colors shadow-xs"
                                >
                                  <span className="material-symbols-outlined text-sm">remove</span>
                                </button>
                                <span className="font-headline font-bold text-sm w-4 text-center">{cartItem.quantity}</span>
                                <button 
                                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateQuantity(product.id, cartItem.quantity + 1); }}
                                  className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-on-surface hover:text-primary transition-colors shadow-xs"
                                >
                                  <span className="material-symbols-outlined text-sm">add</span>
                                </button>
                              </div>
                            );
                          }
                          return (
                            <button
                              disabled={isOutOfStock}
                              onClick={(e) => handleAddToCart(e, product)}
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-xs ${
                                isOutOfStock
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-primary text-white hover:bg-secondary'
                              }`}
                            >
                              <span className="material-symbols-outlined text-sm">shopping_bag</span>
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12 text-on-surface-variant">No featured products found.</div>
              )}
            </div>
          </div>
        </section>

        {/* Quality Statement / Trust Banner */}
        <section className="px-8 py-20 bg-primary text-white text-center rounded-2xl mx-8 shadow-md">
          <div className="max-w-4xl mx-auto">
            <span className="material-symbols-outlined text-6xl text-secondary mb-6">verified</span>
            <h2 className="text-4xl font-headline font-black mb-6 tracking-tight">The Bazaar Quality Promise</h2>
            <p className="text-xl font-body text-primary-fixed-dim leading-relaxed">
              We personally vet every seller in the Bazario ecosystem. From the materials used in your apparel to the source code in your tech, we ensure everything meets the highest standards of Indian excellence.
            </p>
          </div>
        </section>
      </main>

      {/* Modern Premium Footer */}
      <footer className="bg-slate-900 text-slate-400 font-body">
        <div className="max-w-[1920px] mx-auto px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
            {/* Column 1: Brand Info */}
            <div className="md:col-span-2 space-y-6">
              <Link to="/" className="text-3xl font-bold text-white font-headline tracking-tight hover:opacity-95 transition-opacity inline-block">
                Bazario
              </Link>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                Curating authentic Indian craftsmanship and premium design. We connect you with verified independent local creators across Bharat.
              </p>
              {/* Social icons */}
              <div className="flex gap-4">
                {[
                  {
                    name: 'facebook',
                    url: 'https://facebook.com',
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                      </svg>
                    )
                  },
                  {
                    name: 'instagram',
                    url: 'https://instagram.com',
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                      </svg>
                    )
                  },
                  {
                    name: 'twitter',
                    url: 'https://twitter.com',
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    )
                  },
                  {
                    name: 'youtube',
                    url: 'https://youtube.com',
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    )
                  }
                ].map((social) => (
                  <a
                    key={social.name}
                    href="#"
                    aria-label={social.name}
                    className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center hover:border-secondary hover:text-secondary hover:scale-105 transition-all text-slate-400"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Shop links */}
            <div className="space-y-4">
              <h4 className="text-white font-headline font-bold uppercase tracking-wider text-sm">Shop Collections</h4>
              <ul className="space-y-2.5 text-sm">
                {categories.slice(0, 5).map((cat) => (
                  <li key={cat.name}>
                    <button
                      onClick={() => handleCategoryClick(cat.name)}
                      className="hover:text-white transition-colors text-left"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
                <li>
                  <Link to="/products" className="hover:text-white transition-colors">
                    All Products
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div className="space-y-4">
              <h4 className="text-white font-headline font-bold uppercase tracking-wider text-sm">Company</h4>
              <ul className="space-y-2.5 text-sm">
                {['About Us', 'Careers', 'Store Locations', 'Affiliates', 'Press Kit'].map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase().replace(/ /g, '-')}`} className="hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Help/Support */}
            <div className="space-y-4">
              <h4 className="text-white font-headline font-bold uppercase tracking-wider text-sm">Help & Support</h4>
              <ul className="space-y-2.5 text-sm">
                {['Track Order', 'Shipping & Delivery', 'Returns & Refunds', 'FAQs', 'Contact Support'].map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase().replace(/ /g, '-')}`} className="hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter section */}
          <div className="border-t border-b border-slate-800/80 py-12 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-md">
              <h4 className="text-white font-headline font-bold text-lg mb-1">Subscribe to our newsletter</h4>
              <p className="text-sm text-slate-400">Receive curated designer collections, stories behind craft, and exclusive early access.</p>
            </div>
            
            <form onSubmit={handleNewsletterSubmit} className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full sm:w-80 px-5 py-3.5 bg-slate-800/50 rounded-xl border border-slate-800 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/25 transition-all text-white placeholder-slate-500 text-sm"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-secondary text-white font-bold rounded-xl hover:bg-opacity-90 active:scale-98 transition-all text-sm whitespace-nowrap shadow-sm"
              >
                Join Curation
              </button>
            </form>
          </div>

          {/* Newsletter subscription feedback */}
          {newsletterSubscribed && (
            <div className="mb-8 p-4 bg-secondary/10 border border-secondary/20 rounded-xl flex items-center gap-3 text-secondary text-sm animate-fade-in">
              <span className="material-symbols-outlined">celebration</span>
              <span>Thank you! You have successfully subscribed to the Bazario curation newsletter.</span>
            </div>
          )}

          {/* Bottom Copyright & Footer Meta */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <p>&copy; {new Date().getFullYear()} Bazario Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#security" className="hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BuyerHome;
