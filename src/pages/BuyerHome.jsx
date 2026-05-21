import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../utils/supabase';
import { useCartStore } from '../stores/cartStore';

const BuyerHome = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCartStore();


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*, sellers(store_name)')
      .limit(4);
    
    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data);
    }
    setLoading(false);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <main className="pt-8 pb-20 font-body text-on-surface bg-surface">
      {/* Hero Section: Editorial Promotional Banner */}
      <section className="px-8 mb-16">
        <div className="relative w-full h-[500px] rounded-xl overflow-hidden bg-primary-container flex items-center">
          <div className="absolute inset-0 z-0">
            <img className="w-full h-full object-cover opacity-60" alt="Hero background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA49RvVNURMpLm7qBiZPx0ZO4EP604ngRxdWCsNrQFVaze25Om4auJ4PA60JPKhwxiS6VmWX0nGfwMhiu-OIuqde30ksvPRgXttxSe_IFZNy-x-krGJ8t_aPxGhWG8AzxmXEP8TKsNUoPMebO9EE1ziP61hCqMfMXwMDq9X-wVey9BVcS6hALDMfWNrpBy58ZuM69D5tKYR6sQSGvGK8yGROTnhDhw3NHfMyu9rotx9B6ve-1KjCVmIaA4PWV6UaRduD0TI3uE50qE"/>
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
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
          {['devices', 'checkroom', 'chair', 'diamond', 'spa', 'menu_book', 'palette'].map((icon, idx) => {
            const labels = ['Electronics', 'Fashion', 'Home', 'Jewelry', 'Beauty', 'Literature', 'Art'];
            return (
              <div key={idx} className="flex-shrink-0 flex flex-col items-center gap-3 cursor-pointer group">
                <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center group-hover:bg-primary-fixed transition-colors">
                  <span className="material-symbols-outlined text-primary text-3xl">{icon}</span>
                </div>
                <span className="font-headline text-sm font-semibold text-on-surface">{labels[idx]}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* New Arrivals: Asymmetric Bento Grid */}
      <section className="px-8 mb-20">
        <h2 className="text-3xl font-headline font-extrabold mb-8 tracking-tight flex items-center gap-2">
          New Arrivals <span className="w-12 h-1 bg-secondary rounded-full"></span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[600px]">
          <div className="md:col-span-2 md:row-span-2 bg-surface-container-lowest rounded-xl overflow-hidden relative group">
            <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="footwear" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhtGptSQwUj3_URa5BZFqJuHhZKtqIxNawbGyA2Nt5IueS9h7DRgW0xe5D01meFRgktD9Z8q_iD2Fza72cd-a18XxsF7Ugr4uTAJFys8ta5n43vbd6kqmHqI0V6kHVpUlP0rv53vG0jr6kR1xL8qWDATobEvS8AO9gVndB_bp8w8QagAIOEcUhk8Qp88C4fgFEfYtb0ytCcpNfL1u3G_DIfoyHT8d0MuLBjP56NGwwbFuwMmEmDrKfxrphzgp-v3Fps3TWC7JnSEo"/>
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-on-surface to-transparent">
              <span className="text-secondary-fixed-dim font-headline font-bold text-sm">FOOTWEAR</span>
              <h3 className="text-white text-3xl font-headline font-bold">The Heritage Brogue</h3>
              <p className="text-surface-container mb-4">Crafted in Kanpur</p>
              <span className="text-2xl font-headline font-bold text-white">₹84.99</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden relative group">
            <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="earthware" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0G2qogz1tBuRZacCbcn7MKAiGDoY4liwTunmSMGuyyaCUOY0hqLqC6-MiiyGg1qYorGSk2itkSZCNDaM-nvSbfqP2ZoVwwSW8T5zBSp05RhCaa6W6XC7AlJSEMrIhxWelxIXcZmleKaGvBppZ6it1MHqnKTABfvqujrW4ktJNuTpedPQ8b6wkQjXCXz1ipnrWoT3ZJ5BqKrK2bEV_CDE05bEzUlH3OA6BWkqKI3Z13_YaJ3EHdzLH1aqwbwJCyrmMDQdVgtd-OaI"/>
            <div className="absolute inset-0 bg-on-surface/20 group-hover:bg-on-surface/40 transition-colors"></div>
            <div className="absolute bottom-4 left-4">
              <h4 className="text-white font-headline font-bold">Earthware Set</h4>
              <span className="text-white/80 font-bold">₹21.00</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden relative group">
            <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="brass lamp" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaQJADG-XcNboh__rQpU-QSbI0TJDANopJLXGRqnOaRNrzsJLrCD3tJh8M5MpWs4l3Rrpg3W5QqYT4mJxMPAT9dYKqhPQVncN-WbOJkNEh5TuzPod_c0Y6J3Xoq7RyOVRdODUmhAlNo1qaDsKpVOywmQqedJwh_Mby6GJjW8WgAo8eMkcTsuRz_jzvicKiiVOnLMu4m-OOj58C_aaNe-u0vkBX_JAggZBs05m8H2xpFeqNQMTLOBQuFTa8GpEqbDkxCxqf67XhPuQ"/>
            <div className="absolute bottom-4 left-4">
              <h4 className="text-white font-headline font-bold">Lume Brass Lamp</h4>
              <span className="text-white/80 font-bold">₹49.50</span>
            </div>
          </div>
          <div className="md:col-span-2 bg-surface-container-lowest rounded-xl overflow-hidden relative group">
            <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="camera" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGjkw5snpfihx2jmSUlH9LF00iE_1wR4LXibDNv9Pva0IZE5GMQfJK4Nm_WN0rIPW5WrZqRcEOmusNOQbXUpTmQBoibTzmefZn1ojILUljOcQCE7N6Gd5pQRK9gUPB-zyH2ywJ2SvoaoVQ_f5SfHuAwPKqYxDKBZYxAGA3wIc6-k1tGVna0blSW0SOy3Io4dtmIHa-F5WokKo26O-S1BxKDYjv75YQ4olJeAupmwUq_fYwiBXFHKr1bMw3pqAk3GVG3UWn0UnEVUA"/>
            <div className="absolute top-4 left-4 bg-secondary px-3 py-1 rounded-full text-white text-xs font-bold">PREMIUM TECH</div>
            <div className="absolute bottom-8 left-8">
              <h4 className="text-white text-2xl font-headline font-bold">Optic X10 India Edition</h4>
              <span className="text-white/90 font-bold text-xl">₹1,240.00</span>
            </div>
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
            </div>
            <Link to="/products" className="flex items-center gap-2 text-primary font-bold group">
              View All <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="bg-surface-container-lowest rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
                  <div>
                    <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
                      <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={product.name} src={product.image_url || "/placeholder-image.png"}/>
                      <button className="absolute top-3 right-3 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>favorite</span>
                      </button>
                    </div>
                    <div className="space-y-1 mb-4">
                      <Link to={`/product/${product.id}`} className="font-headline font-bold text-lg text-on-surface line-clamp-1 hover:text-primary transition-colors">{product.name}</Link>
                      <p className="text-xs text-on-surface-variant font-medium">Sold by <span className="text-primary font-semibold">{product.sellers?.store_name || "Unknown"}</span></p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-auto">
                    <div className="flex items-baseline gap-1">
                      <span className="text-secondary font-headline font-bold">₹</span>
                      <span className="text-xl font-headline font-extrabold text-on-surface">{product.price}</span>
                    </div>
                    <button onClick={() => handleAddToCart(product)} className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
                      <span className="material-symbols-outlined text-sm">shopping_bag</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">No featured products found.</div>
            )}
          </div>
        </div>
      </section>

      {/* Quality Statement / Trust Banner */}
      <section className="px-8 py-20 bg-primary text-white text-center rounded-2xl mx-8">
        <div className="max-w-4xl mx-auto">
          <span className="material-symbols-outlined text-6xl text-secondary mb-6">verified</span>
          <h2 className="text-4xl font-headline font-black mb-6 tracking-tight">The Bazaar Quality Promise</h2>
          <p className="text-xl font-body text-primary-fixed-dim leading-relaxed">
            We personally vet every seller in the Bazario ecosystem. From the materials used in your apparel to the source code in your tech, we ensure everything meets the highest standards of Indian excellence.
          </p>
        </div>
      </section>
    </main>
  );
};

export default BuyerHome;
