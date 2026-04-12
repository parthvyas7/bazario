import { useCentralStore } from "../store/store";
import useProducts from "../hooks/useProducts";
import { useNavigate } from "react-router-dom";

const ProductListing = () => {
  const { isPending, error, data: products, isFetching } = useProducts();
  const { addToCart, removeFromCart, cart } = useCentralStore((state) => state);
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    cart.find((item) => item.id === product.id)
      ? removeFromCart(product)
      : addToCart(product);
  };

  if (isPending) return <div className="p-8 text-center text-on-surface">Loading curated collection...</div>;
  if (error) return <div className="p-8 text-center text-error">An error has occurred: {error.message}</div>;

  return (
    <main className="pb-20">
      {/* Hero Section: Editorial Promotional Banner */}
      <section className="px-8 mb-16 pt-8">
        <div className="relative w-full h-[500px] rounded-xl overflow-hidden bg-primary-container flex items-center">
          <div className="absolute inset-0 z-0">
            <img 
              className="w-full h-full object-cover opacity-60" 
              alt="close-up of vibrant handcrafted Indian textiles" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA49RvVNURMpLm7qBiZPx0ZO4EP604ngRxdWCsNrQFVaze25Om4auJ4PA60JPKhwxiS6VmWX0nGfwMhiu-OIuqde30ksvPRgXttxSe_IFZNy-x-krGJ8t_aPxGhWG8AzxmXEP8TKsNUoPMebO9EE1ziP61hCqMfMXwMDq9X-wVey9BVcS6hALDMfWNrpBy58ZuM69D5tKYR6sQSGvGK8yGROTnhDhw3NHfMyu9rotx9B6ve-1KjCVmIaA4PWV6UaRduD0TI3uE50qE"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/40 to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-2xl pl-12 text-white">
            <span className="font-headline font-bold uppercase tracking-widest text-secondary mb-4 block">The Indian Curator</span>
            <h1 className="text-6xl font-headline font-extrabold tracking-tight mb-6 leading-tight">Authentic Indian Craftsmanship, Reimagined.</h1>
            <p className="text-xl text-primary-fixed leading-relaxed mb-8 font-body">From artisanal home decor to cutting-edge electronics, discover the best of Bharat’s creative landscape.</p>
            <button className="px-8 py-4 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-headline font-bold shadow-lg hover:scale-105 transition-transform">Explore the Collection</button>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="px-8 mb-20 bg-surface-container-low py-16 -mx-8">
        <div className="max-w-[1920px] mx-auto px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-headline font-extrabold tracking-tight text-primary">Featured Selection</h2>
              <p className="text-on-surface-variant font-body mt-2">Curated by our editors for exceptional quality and design.</p>
              {isFetching && <p className="text-sm text-secondary mt-2">Updating catalog...</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-surface-container-lowest rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                <div 
                  className="relative h-64 mb-6 rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 bg-surface-variant" 
                    alt={product.name} 
                    src={product.image_url || `https://via.placeholder.com/400?text=${encodeURIComponent(product.name)}`}
                  />
                  <button className="absolute top-3 right-3 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-primary hover:text-secondary transition-colors">
                    <span className="material-symbols-outlined shrink-0 text-[20px]" style={{fontVariationSettings: "'FILL' 0"}}>favorite</span>
                  </button>
                </div>
                <div className="space-y-1 mb-4 flex-grow">
                  <h3 
                    className="font-headline font-bold text-lg text-on-surface line-clamp-1 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant font-medium">Sold by <span className="text-primary font-semibold">{product.seller?.username || 'Verified Seller'}</span></p>
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex items-baseline gap-1">
                    <span className="text-secondary font-headline font-bold">₹</span>
                    <span className="text-xl font-headline font-extrabold text-on-surface">{product.price}</span>
                  </div>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className={`h-10 px-4 rounded-full flex items-center justify-center transition-colors font-semibold text-sm ${
                      cart.find((item) => item.id === product.id) 
                        ? "bg-surface-variant text-on-surface hover:bg-surface-dim"
                        : "bg-primary text-white hover:bg-secondary"
                    }`}
                  >
                    {cart.find((item) => item.id === product.id) ? "Remove" : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Statement / Trust Banner */}
      <section className="px-8 py-20 bg-primary text-white text-center">
        <div className="max-w-4xl mx-auto">
          <span className="material-symbols-outlined text-6xl text-secondary mb-6 shrink-0" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
          <h2 className="text-4xl font-headline font-black mb-6 tracking-tight">The Bazaar Quality Promise</h2>
          <p className="text-xl font-body text-primary-fixed-dim leading-relaxed">
            We personally vet every seller in the Bazario ecosystem. From the materials used in your apparel to the source code in your tech, we ensure everything meets the highest standards of Indian excellence.
          </p>
        </div>
      </section>
    </main>
  );
};

export default ProductListing;
