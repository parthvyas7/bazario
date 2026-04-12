import { useState, useEffect } from 'react';
import supabase from '../../utils/supabase';

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image_url: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, products, orders

  useEffect(() => {
    fetchSellerData();
  }, []);

  const fetchSellerData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    // Fetch seller's products
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    // Fetch seller's orders
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    if (productsError) console.error('Products fetch error:', productsError);
    if (ordersError) console.error('Orders fetch error:', ordersError);

    setProducts(productsData || []);
    setOrders(ordersData || []);
    setLoading(false);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (editingProduct) {
      // Update existing product
      const { error } = await supabase
        .from("products")
        .update({
          ...newProduct,
          price: parseFloat(newProduct.price),
        })
        .eq("id", editingProduct.id);

      if (error) {
        console.error("Error updating product:", error);
      } else {
        setNewProduct({ name: "", description: "", price: "", image_url: "" });
        setEditingProduct(null);
        fetchSellerData();
      }
    } else {
      // Add new product
      const { error } = await supabase.from("products").insert({
        ...newProduct,
        seller_id: user.id,
        price: parseFloat(newProduct.price),
      });

      if (error) {
        console.error("Error adding product:", error);
      } else {
        setNewProduct({ name: "", description: "", price: "", image_url: "" });
        fetchSellerData();
      }
    }
  };

  const handleStartEdit = (product) => {
    setActiveTab('products');
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url || "",
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setNewProduct({ name: "", description: "", price: "", image_url: "" });
  };

  const handleDeleteProduct = async (productId) => {
    if(!window.confirm("Are you sure you want to delete this product?")) return;
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      console.error("Error deleting product:", error);
    } else {
      fetchSellerData();
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      console.error("Error updating order status:", error);
    } else {
      fetchSellerData();
    }
  };

  if (loading) {
    return (
      <div className="pt-24 pb-12 px-6 max-w-screen-2xl mx-auto min-h-screen">
        <p className="text-on-surface-variant font-medium animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  const totalSales = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const activeOrdersCount = orders.filter(o => o.status === "Pending" || o.status === "Shipped").length;
  
  return (
    <div className="flex bg-surface min-h-screen">
      {/* Side Navigation (Desktop via padding, visual via sticky) */}
      <aside className="hidden md:flex w-64 fixed left-0 top-0 pt-24 h-screen bg-surface-container-low flex-col p-6 border-r border-outline-variant/10 z-10">
        <div className="mb-8 px-2">
          <h1 className="text-xl font-black text-primary font-headline tracking-tight">Seller Studio</h1>
          <p className="text-xs text-on-surface-variant mt-1 uppercase tracking-wider font-body">The Digital Curator</p>
        </div>
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${activeTab === 'overview' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            <span className="material-symbols-outlined" style={{fontVariationSettings: activeTab === 'overview' ? "'FILL' 1" : "'FILL' 0"}}>dashboard</span>
            <span>Overview</span>
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${activeTab === 'products' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            <span className="material-symbols-outlined" style={{fontVariationSettings: activeTab === 'products' ? "'FILL' 1" : "'FILL' 0"}}>inventory_2</span>
            <span>Inventory</span>
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${activeTab === 'orders' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            <span className="material-symbols-outlined" style={{fontVariationSettings: activeTab === 'orders' ? "'FILL' 1" : "'FILL' 0"}}>shopping_bag</span>
            <span>Orders</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 md:ml-64 pt-24 pb-12 px-6 lg:px-12 max-w-[1400px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary font-headline capitalize">
              {activeTab}
            </h3>
            <p className="text-on-surface-variant mt-2 font-body">
              {activeTab === 'overview' && "Welcome back to your curation space. Here is your store's pulse today."}
              {activeTab === 'products' && "Manage your curated product catalog."}
              {activeTab === 'orders' && "Track and fulfill customer orders."}
            </p>
          </div>
          {activeTab === 'overview' && (
             <div className="flex gap-3">
              <button 
                onClick={() => setActiveTab('products')}
                className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-container text-white rounded-full font-bold text-sm shadow-md hover:scale-[0.98] transition-transform"
              >
                Add Product
              </button>
            </div>
          )}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-surface-container-lowest p-6 rounded-2xl relative overflow-hidden group border border-outline-variant/10 shadow-sm">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                <p className="text-sm font-medium text-on-surface-variant mb-1 relative z-10">Total Sales</p>
                <h4 className="text-3xl font-black text-primary font-headline relative z-10">${totalSales.toFixed(2)}</h4>
              </div>
              
              <div className="bg-surface-container-lowest p-6 rounded-2xl relative overflow-hidden group border border-outline-variant/10 shadow-sm">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                <p className="text-sm font-medium text-on-surface-variant mb-1 relative z-10">Active Orders</p>
                <h4 className="text-3xl font-black text-on-surface font-headline relative z-10">{activeOrdersCount}</h4>
              </div>
              
              <div className="bg-surface-container-lowest p-6 rounded-2xl relative overflow-hidden group border border-outline-variant/10 shadow-sm">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-container/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                <p className="text-sm font-medium text-on-surface-variant mb-1 relative z-10">Total Products</p>
                <h4 className="text-3xl font-black text-on-surface font-headline relative z-10">{products.length}</h4>
              </div>
              
              <div className="bg-surface-container-lowest p-6 rounded-2xl relative overflow-hidden group border-r-4 border-secondary border-y border-l border-outline-variant/10 shadow-sm">
                <p className="text-sm font-medium text-on-surface-variant mb-1">Store Rating</p>
                <h4 className="text-3xl font-black text-on-surface font-headline">4.8 <span className="text-lg font-medium text-on-surface-variant">/ 5.0</span></h4>
                <div className="mt-2 flex items-center gap-1">
                  {[1,2,3,4,5].map(star => (
                    <span key={star} className={`material-symbols-outlined ${star === 5 ? 'text-on-surface-variant' : 'text-secondary'}`} style={{fontVariationSettings: "'FILL' 1", fontSize: '18px'}}>{star === 5 ? 'star_half' : 'star'}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-surface-container-highest flex justify-between items-center">
                <h4 className="text-xl font-bold text-primary font-headline">Recent Orders</h4>
                <button onClick={() => setActiveTab('orders')} className="text-sm font-bold text-secondary hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-body">
                  <thead className="bg-surface-container-low text-xs uppercase tracking-wider font-bold text-on-surface-variant">
                    <tr>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-highest">
                    {orders.slice(0, 5).map(order => (
                      <tr key={order.id} className="hover:bg-surface-container-lowest transition-colors">
                        <td className="px-6 py-4 font-mono text-sm">#{order.id.slice(0,8).toUpperCase()}</td>
                        <td className="px-6 py-4 font-bold text-primary">${order.total_amount.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                            ${order.status === "Pending" ? "bg-secondary/10 text-secondary border border-secondary/20" : 
                              order.status === "Shipped" ? "bg-primary-fixed text-primary border border-primary/20" : 
                              order.status === "Delivered" ? "bg-tertiary-container/10 text-tertiary-container border border-tertiary-container/20" : 
                              "bg-error-container text-error border border-error/20"}`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="3" className="px-6 py-8 text-center text-on-surface-variant font-medium">No orders yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Add/Edit Product Form */}
            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 shadow-sm">
              <h3 className="text-xl font-bold font-headline mb-6 text-primary">
                {editingProduct ? "Edit Product Details" : "Add New Product"}
              </h3>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Product Name</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                    className="w-full p-3 bg-surface-container-low border border-transparent focus:border-primary rounded-xl outline-none transition-colors font-medium text-on-surface"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Price ($)</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                    step="0.01"
                    className="w-full p-3 bg-surface-container-low border border-transparent focus:border-primary rounded-xl outline-none transition-colors font-medium text-on-surface"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Image URL</label>
                  <input
                    type="text"
                    value={newProduct.image_url}
                    onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                    className="w-full p-3 bg-surface-container-low border border-transparent focus:border-primary rounded-xl outline-none transition-colors font-medium text-on-surface"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    required
                    rows="4"
                    className="w-full p-3 bg-surface-container-low border border-transparent focus:border-primary rounded-xl outline-none transition-colors font-medium text-on-surface resize-y"
                  />
                </div>
                <div className="md:col-span-2 flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary/90 transition-colors shadow-md text-sm"
                  >
                    {editingProduct ? "Save Changes" : "Create Product"}
                  </button>
                  {editingProduct && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="bg-surface-container-high text-on-surface font-bold py-3 px-8 rounded-full hover:bg-surface-container-highest transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden flex flex-col group hover:-translate-y-1 transition-all duration-300">
                  <div className="aspect-square relative overflow-hidden bg-surface-container-low">
                    <img
                      src={product.image_url || "/placeholder-image.png"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h4 className="font-bold font-headline text-on-surface line-clamp-1 mb-1">{product.name}</h4>
                    <p className="font-bold text-primary mb-4">${product.price.toFixed(2)}</p>
                    
                    <div className="mt-auto flex gap-2">
                      <button
                        onClick={() => handleStartEdit(product)}
                        className="flex-1 bg-surface-container-high text-primary font-bold py-2 rounded-lg hover:bg-primary-fixed transition-colors text-xs flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 bg-error-container/30 text-error font-bold py-2 rounded-lg hover:bg-error-container transition-colors text-xs flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {products.length === 0 && (
              <div className="text-center py-12 text-on-surface-variant font-medium">
                Your inventory is currently empty. Add your first product above.
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {orders.length === 0 ? (
               <div className="text-center py-12 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
                 <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">inbox</span>
                 <p className="text-on-surface-variant font-medium">No orders received yet.</p>
               </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-surface-container-highest pb-4 mb-4">
                    <div>
                      <h4 className="font-bold font-headline text-lg">Order #{order.id.slice(0,8).toUpperCase()}</h4>
                      <p className="text-xs text-on-surface-variant font-medium">
                        Placed on {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                            ${order.status === "Pending" ? "bg-secondary/10 text-secondary" : 
                              order.status === "Shipped" ? "bg-primary-fixed text-primary" : 
                              order.status === "Delivered" ? "bg-tertiary-container/10 text-tertiary-container" : 
                              "bg-error-container text-error"}`}
                      >
                        {order.status}
                      </span>
                      <p className="font-bold text-lg text-primary">${order.total_amount.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-surface-container-low p-3 rounded-xl">
                        <div className="flex items-center gap-3">
                          <img src={item.products?.image_url || '/placeholder-image.png'} className="w-10 h-10 rounded-md object-cover" alt="product" />
                          <div>
                            <span className="font-bold text-sm block line-clamp-1">{item.products?.name || 'Unknown Product'}</span>
                            <span className="text-xs text-on-surface-variant">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-bold text-sm text-on-surface">${item.price_at_time?.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 justify-end">
                    {order.status === "Pending" && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, "Shipped")}
                        className="bg-primary hover:bg-primary-container text-white px-5 py-2 rounded-full font-bold text-xs transition-colors shadow-sm"
                      >
                        Mark as Shipped
                      </button>
                    )}
                    {order.status === "Shipped" && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, "Delivered")}
                        className="bg-tertiary-container hover:bg-tertiary text-white px-5 py-2 rounded-full font-bold text-xs transition-colors shadow-sm"
                      >
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation overrides sidebar on small screens */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md border-t border-outline-variant/20 z-50 flex justify-around items-center px-4">
        <button onClick={() => setActiveTab('overview')} className={`flex flex-col items-center gap-1 ${activeTab === 'overview' ? 'text-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined" style={{fontVariationSettings: activeTab === 'overview' ? "'FILL' 1" : "'FILL' 0"}}>dashboard</span>
          <span className="text-[10px] font-bold">Overview</span>
        </button>
        <button onClick={() => setActiveTab('products')} className={`flex flex-col items-center gap-1 ${activeTab === 'products' ? 'text-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined" style={{fontVariationSettings: activeTab === 'products' ? "'FILL' 1" : "'FILL' 0"}}>inventory_2</span>
          <span className="text-[10px] font-bold">Inventory</span>
        </button>
        <button onClick={() => setActiveTab('orders')} className={`flex flex-col items-center gap-1 ${activeTab === 'orders' ? 'text-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined" style={{fontVariationSettings: activeTab === 'orders' ? "'FILL' 1" : "'FILL' 0"}}>shopping_bag</span>
          <span className="text-[10px] font-bold">Orders</span>
        </button>
      </nav>
    </div>
  );
};

export default SellerDashboard;