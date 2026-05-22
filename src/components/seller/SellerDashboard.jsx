import { useState, useEffect } from 'react';
import supabase from '../../utils/supabase';
import { useAuthStore } from '../../stores/authStore';
import { formatPrice } from '../../utils/services';

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
    title: '',
    description: '',
    price: '',
    image_url: '',
    category: 'Home & Living',
    stock_quantity: 1,
    sku: '',
    visibility: 'Listed',
    shipping_profile: 'Standard'
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
      .select('*, buyers!buyer_id(full_name), order_items(*, products(*))')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    if (productsError) console.error('Products fetch error:', productsError);
    if (ordersError) console.error('Orders fetch error:', ordersError);

    setProducts(productsData || []);
    setOrders(ordersData || []);
    setLoading(false);
  };

  const handleAddProduct = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();

    const productData = {
      name: newProduct.name,
      title: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price) || 0,
      image_url: newProduct.image_url,
      category: newProduct.category || 'Home & Living',
      stock_quantity: parseInt(newProduct.stock_quantity) ?? 1,
      sku: newProduct.sku || null,
      visibility: newProduct.visibility || 'Listed',
      shipping_profile: newProduct.shipping_profile || 'Standard'
    };

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProduct.id);

      if (error) {
        console.error("Error updating product:", error);
        return { success: false, error: error.message };
      } else {
        setNewProduct({
          name: '',
          title: '',
          description: '',
          price: '',
          image_url: '',
          category: 'Home & Living',
          stock_quantity: 1,
          sku: '',
          visibility: 'Listed',
          shipping_profile: 'Standard'
        });
        setEditingProduct(null);
        setActiveTab('products');
        fetchSellerData();
        return { success: true };
      }
    } else {
      const { error } = await supabase.from("products").insert({
        ...productData,
        seller_id: user.id,
      });

      if (error) {
        console.error("Error adding product:", error);
        return { success: false, error: error.message };
      } else {
        setNewProduct({
          name: '',
          title: '',
          description: '',
          price: '',
          image_url: '',
          category: 'Home & Living',
          stock_quantity: 1,
          sku: '',
          visibility: 'Listed',
          shipping_profile: 'Standard'
        });
        setActiveTab('products');
        fetchSellerData();
        return { success: true };
      }
    }
  };

  const handleStartEdit = (product) => {
    setActiveTab('add_product');
    setEditingProduct(product);
    setNewProduct({
      name: product.name || '',
      title: product.name || '',
      description: product.description || '',
      price: product.price || '',
      image_url: product.image_url || '',
      category: product.category || 'Home & Living',
      stock_quantity: product.stock_quantity ?? 1,
      sku: product.sku || '',
      visibility: product.visibility || 'Listed',
      shipping_profile: product.shipping_profile || 'Standard'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setNewProduct({
      name: '',
      title: '',
      description: '',
      price: '',
      image_url: '',
      category: 'Home & Living',
      stock_quantity: 1,
      sku: '',
      visibility: 'Listed',
      shipping_profile: 'Standard'
    });
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

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    if (!window.confirm(`Are you sure you want to update the status of this order to ${newStatus}?`)) return;
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status: " + error.message);
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
                         <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                           Placed on {new Date(order.created_at).toLocaleDateString()}
                         </p>
                       </div>
                       <div className="flex items-center gap-4">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border
                               ${order.status === "Pending" ? "bg-secondary/10 text-secondary border-secondary/20" : 
                                 order.status === "Shipped" ? "bg-primary-fixed text-primary border-primary/20" : 
                                 order.status === "Delivered" ? "bg-tertiary-container/10 text-tertiary-container border-tertiary-container/20" : 
                                 "bg-error-container/10 text-error border-error/20"}`}
                         >
                           {order.status}
                         </span>
                         <p className="font-bold text-lg text-primary">₹{formatPrice(order.total_amount)}</p>
                       </div>
                     </div>

                     {/* Order items list */}
                     <div className="space-y-3">
                       {order.order_items?.map((item) => (
                         <div key={item.id} className="flex items-center gap-4 bg-surface-bright p-3 rounded-xl border border-outline-variant/5">
                           <img
                             src={item.products?.image_url || "/placeholder-image.png"}
                             alt={item.products?.name}
                             className="w-12 h-12 rounded-lg object-cover bg-surface-container-highest flex-shrink-0"
                             onError={(e) => {
                               e.target.src = "/placeholder-image.png";
                             }}
                           />
                           <div className="flex-1 min-w-0">
                             <p className="text-sm font-bold text-on-surface truncate">{item.products?.name || "Deleted Product"}</p>
                             <p className="text-xs text-on-surface-variant font-semibold">
                               Qty: {item.quantity} • ₹{formatPrice(item.price_at_purchase || item.products?.price || 0)}
                             </p>
                           </div>
                         </div>
                       ))}
                     </div>

                     {/* Order footer with customer and status actions */}
                     <div className="mt-6 pt-4 border-t border-surface-container-highest flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                       <div className="text-xs text-on-surface-variant font-medium">
                         Customer: <span className="font-bold text-on-surface">{order.buyers?.full_name || "Guest Buyer"}</span>
                       </div>
                       <div className="flex gap-2 w-full sm:w-auto justify-end">
                         {order.status === "Pending" && (
                           <>
                             <button
                               onClick={() => handleUpdateOrderStatus(order.id, "Cancelled")}
                               className="px-4 py-2 border border-error/30 text-error hover:bg-error/5 text-xs font-bold rounded-full transition-colors"
                             >
                               Cancel Order
                             </button>
                             <button
                               onClick={() => handleUpdateOrderStatus(order.id, "Shipped")}
                               className="px-4 py-2 bg-primary text-white hover:bg-primary/90 text-xs font-bold rounded-full transition-colors shadow-sm"
                             >
                               Ship Order
                             </button>
                           </>
                         )}
                         {order.status === "Shipped" && (
                           <>
                             <button
                               onClick={() => handleUpdateOrderStatus(order.id, "Cancelled")}
                               className="px-4 py-2 border border-error/30 text-error hover:bg-error/5 text-xs font-bold rounded-full transition-colors"
                             >
                               Cancel Order
                             </button>
                             <button
                               onClick={() => handleUpdateOrderStatus(order.id, "Delivered")}
                               className="px-4 py-2 bg-tertiary text-white hover:opacity-90 text-xs font-bold rounded-full transition-colors shadow-sm"
                             >
                               Mark Delivered
                             </button>
                           </>
                         )}
                         {(order.status === "Delivered" || order.status === "Cancelled") && (
                           <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5 py-2">
                             <span className="material-symbols-outlined text-sm">
                               {order.status === "Delivered" ? "check_circle" : "cancel"}
                             </span>
                             {order.status === "Delivered" ? "Order completed and delivered" : "Order cancelled"}
                           </span>
                         )}
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