import { useState, useEffect } from 'react';
import supabase from '../../utils/supabase';

import { useAuthStore } from '../../stores/authStore';

import SellerSidebar from './SellerSidebar';
import SellerMobileNav from './SellerMobileNav';
import DashboardContent from './DashboardContent';
import InventoryContent from './InventoryContent';
import AddProductContent from './AddProductContent';
import StoreSetupContent from './StoreSetupContent';

const SellerDashboard = () => {
  const { profile, signOut } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image_url: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, products, orders, settings, add_product

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
    const { data: { user } } = await supabase.auth.getUser();

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update({
          ...newProduct,
          price: parseFloat(newProduct.price) || 0,
        })
        .eq("id", editingProduct.id);

      if (error) console.error("Error updating product:", error);
      else {
        setNewProduct({ name: "", description: "", price: "", image_url: "" });
        setEditingProduct(null);
        setActiveTab('products');
        fetchSellerData();
      }
    } else {
      const { error } = await supabase.from("products").insert({
        ...newProduct,
        seller_id: user.id,
        price: parseFloat(newProduct.price) || 0,
      });

      if (error) console.error("Error adding product:", error);
      else {
        setNewProduct({ name: "", description: "", price: "", image_url: "" });
        setActiveTab('products');
        fetchSellerData();
      }
    }
  };

  const handleStartEdit = (product) => {
    setActiveTab('add_product');
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
    setActiveTab('products');
  };

  const handleDeleteProduct = async (productId) => {
    if(!window.confirm("Are you sure you want to delete this product?")) return;
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) console.error("Error deleting product:", error);
    else fetchSellerData();
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
    <div className="flex bg-surface min-h-screen font-body">
      <SellerSidebar activeTab={activeTab} setActiveTab={setActiveTab} profile={profile} onSignOut={handleSignOut} />
      
      <main className="flex-1 md:ml-64 flex flex-col bg-surface-bright pb-24 md:pb-0">
        {activeTab === 'overview' && (
          <DashboardContent 
            totalSales={totalSales} 
            activeOrdersCount={activeOrdersCount} 
            products={products} 
            orders={orders} 
            onSignOut={handleSignOut}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 'products' && (
          <InventoryContent 
            products={products} 
            onStartEdit={handleStartEdit} 
            onDeleteProduct={handleDeleteProduct} 
          />
        )}
        {activeTab === 'add_product' && (
          <AddProductContent 
            newProduct={newProduct} 
            setNewProduct={setNewProduct} 
            handleAddProduct={handleAddProduct} 
            editingProduct={editingProduct} 
            handleCancelEdit={handleCancelEdit} 
          />
        )}
        {activeTab === 'settings' && (
          <StoreSetupContent onSignOut={handleSignOut} />
        )}
        {activeTab === 'orders' && (
          <div className="flex-1 p-8 min-h-screen">
            <h2 className="font-headline text-3xl font-extrabold text-primary mb-6">Manage Orders</h2>
            {orders.length === 0 ? (
               <div className="text-center py-12 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
                 <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">inbox</span>
                 <p className="text-on-surface-variant font-medium">No orders received yet.</p>
               </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
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
                        <p className="font-bold text-lg text-primary">₹{order.total_amount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <SellerMobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default SellerDashboard;