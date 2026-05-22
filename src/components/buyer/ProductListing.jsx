import { useState, useEffect } from 'react';
import supabase from '../../utils/supabase';
import { useCartStore } from '../../stores/cartStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useNavigate, Link, useSearchParams } from "react-router-dom";

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { cart, addToCart, updateQuantity } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const navigate = useNavigate();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // newest, priceAsc, priceDesc

  // Mobile sidebar state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync category and search query from URL parameters
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      setSelectedCategory(catParam);
    } else {
      setSelectedCategory('All');
    }

    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    } else {
      setSearchTerm('');
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*, sellers(store_name)')
      .eq('visibility', 'Listed');
    
    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data);
    }
    setLoading(false);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setSortBy('newest');
    setSearchParams({});
  };

  // Filter and Sort logic
  const filteredProducts = products
    .filter(product => {
      // 1. Search term match
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 2. Category match
      const matchesCategory = 
        selectedCategory === 'All' || 
        product.category === selectedCategory;
      
      // 3. Price match
      const priceNum = Number(product.price);
      const matchesMinPrice = minPrice === '' || priceNum >= Number(minPrice);
      const matchesMaxPrice = maxPrice === '' || priceNum <= Number(maxPrice);
      
      // 4. Stock match
      const matchesStock = !inStockOnly || product.stock_quantity > 0;

      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesStock;
    })
    .sort((a, b) => {
      if (sortBy === 'priceAsc') {
        return Number(a.price) - Number(b.price);
      }
      if (sortBy === 'priceDesc') {
        return Number(b.price) - Number(a.price);
      }
      // default: newest (created_at DESC)
      return new Date(b.created_at) - new Date(a.created_at);
    });

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

  const handleViewSellerStore = (e, sellerId) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/seller/${sellerId}`);
  };

  const categories = [
    { name: 'All', icon: 'grid_view' },
    { name: 'Electronics', icon: 'devices' },
    { name: 'Fashion', icon: 'checkroom' },
    { name: 'Home', icon: 'chair' },
    { name: 'Jewelry', icon: 'diamond' },
    { name: 'Beauty', icon: 'spa' },
    { name: 'Literature', icon: 'menu_book' },
    { name: 'Art', icon: 'palette' }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pt-6 pb-24 font-body">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8">
        
        {/* Header Title Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-headline font-black text-primary tracking-tight">Browse Products</h1>
            <p className="text-on-surface-variant font-body mt-2">Discover curated goods from independent Indian sellers.</p>
          </div>
          <div className="text-sm font-semibold text-on-surface-variant">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </div>
        </div>

        {/* Toolbar: Sort and Mobile Filter Toggle */}
        <div className="flex justify-end gap-4 mb-8">
          <div className="flex gap-4 w-full md:w-auto justify-end">
            {/* Sort Dropdown */}
            <div className="relative min-w-[220px] flex-grow md:flex-grow-0">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">sort</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-12 pr-8 py-4 rounded-xl border border-gray-200 bg-white shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface font-body font-semibold cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">keyboard_arrow_down</span>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="md:hidden flex items-center justify-center gap-2 px-6 py-4 bg-white border border-gray-200 rounded-xl shadow-sm text-primary font-bold hover:bg-gray-50 transition-colors"
            >
              <span className="material-symbols-outlined">filter_list</span>
              Filters
            </button>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="flex gap-8 items-start">
          
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden md:block w-80 flex-shrink-0 bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm sticky top-28">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-headline font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">filter_alt</span> Filters
              </h2>
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1"
              >
                Reset All
              </button>
            </div>

            {/* Categories Filter */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              <h3 className="text-sm font-headline font-bold text-on-surface uppercase tracking-wider mb-4">Categories</h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryChange(cat.name)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
                      selectedCategory === cat.name
                        ? 'bg-primary text-white font-semibold'
                        : 'text-on-surface/75 hover:bg-gray-50 hover:text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-xl">{cat.icon}</span>
                      <span className="text-sm">{cat.name}</span>
                    </div>
                    {selectedCategory === cat.name && (
                      <span className="material-symbols-outlined text-sm">check</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              <h3 className="text-sm font-headline font-bold text-on-surface uppercase tracking-wider mb-4">Price Range</h3>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">₹</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                </div>
                <span className="text-gray-400 text-xs">to</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">₹</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Stock Filter */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <span className="text-sm font-medium text-on-surface/80 group-hover:text-primary transition-colors">
                  In Stock Only
                </span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-grow">
            {loading ? (
              <div className="flex justify-center items-center py-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const isFavorited = isInWishlist(product.id);
                  const isOutOfStock = product.stock_quantity <= 0;

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between min-h-[450px] h-full relative"
                    >
                      <div>
                        {/* Image & Wishlist Button */}
                        <div className="relative h-56 mb-5 rounded-xl overflow-hidden bg-gray-50">
                          <Link to={`/product/${product.id}`} className="block w-full h-full">
                            <img
                              src={product.image_url || "/placeholder-image.png"}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </Link>
                          {/* Wishlist Toggle Button */}
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

                          {/* Out of Stock Badge */}
                          {isOutOfStock && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                              <span className="bg-error text-on-error px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                                Out of Stock
                              </span>
                            </div>
                          )}

                          {/* Category Tag */}
                          {product.category && (
                            <span className="absolute bottom-3 left-3 bg-primary-fixed-dim/95 text-on-primary-fixed text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
                              {product.category}
                            </span>
                          )}
                        </div>

                        {/* Title & Seller Info */}
                        <div className="space-y-1 mb-4">
                          <Link
                            to={`/product/${product.id}`}
                            className="font-headline font-bold text-lg text-on-surface line-clamp-1 hover:text-primary transition-colors block"
                          >
                            {product.name}
                          </Link>
                          <div className="flex justify-between items-center text-xs">
                            <p className="text-on-surface-variant font-medium">
                              Sold by{' '}
                              <button
                                onClick={(e) => handleViewSellerStore(e, product.seller_id)}
                                className="text-primary font-semibold hover:underline"
                              >
                                {product.sellers?.store_name || "Unknown"}
                              </button>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Pricing and Action Buttons */}
                      <div className="flex justify-between items-center mt-auto border-t border-gray-50 pt-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-secondary font-headline font-bold">₹</span>
                          <span className="text-2xl font-headline font-extrabold text-on-surface">
                            {Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                          </span>
                        </div>

                        <div className="flex gap-2">
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
                                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-xs transition-colors ${
                                  isOutOfStock
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-primary text-white hover:bg-secondary'
                                }`}
                                title={isOutOfStock ? "Out of stock" : "Add to Cart"}
                              >
                                <span className="material-symbols-outlined text-sm">shopping_bag</span>
                              </button>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-2xl py-20 px-4 text-center shadow-xs">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">inventory_2</span>
                <h3 className="text-xl font-headline font-bold text-primary mb-2">No Products Found</h3>
                <p className="text-on-surface-variant max-w-md mx-auto mb-6">
                  We couldn't find any products matching your search query or selected filters. Try broadening your criteria!
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-primary text-white rounded-full font-bold shadow-sm hover:bg-secondary transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Mobile Drawer Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          ></div>

          {/* Drawer Content */}
          <div className="relative w-full max-w-sm bg-white h-full flex flex-col p-6 overflow-y-auto shadow-2xl transition-transform animate-slide-left">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
              <h2 className="text-xl font-headline font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">filter_alt</span> Filters
              </h2>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Categories Filter */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              <h3 className="text-sm font-headline font-bold text-on-surface uppercase tracking-wider mb-4">Categories</h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => {
                      handleCategoryChange(cat.name);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
                      selectedCategory === cat.name
                        ? 'bg-primary text-white font-semibold'
                        : 'text-on-surface/75 hover:bg-gray-50 hover:text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-xl">{cat.icon}</span>
                      <span className="text-sm">{cat.name}</span>
                    </div>
                    {selectedCategory === cat.name && (
                      <span className="material-symbols-outlined text-sm">check</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              <h3 className="text-sm font-headline font-bold text-on-surface uppercase tracking-wider mb-4">Price Range</h3>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">₹</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                </div>
                <span className="text-gray-400 text-xs">to</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">₹</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Stock Filter */}
            <div className="mb-8">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4.5 h-4.5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <span className="text-sm font-medium text-on-surface/80 group-hover:text-primary transition-colors">
                  In Stock Only
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-auto">
              <button
                onClick={() => {
                  handleResetFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors text-center text-sm"
              >
                Reset All
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-secondary transition-colors text-center text-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListing;