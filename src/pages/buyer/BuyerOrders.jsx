import { useState, useEffect } from "react";
import supabase from "../../utils/supabase";

const BuyerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*, products(*))")
      .eq("buyer_id", user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
    } else {
      setOrders(data);
    }
    setLoading(false);
  };

  const handleCancelOrder = async (orderId) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: "Cancelled" })
      .eq("id", orderId)
      .eq("status", "Pending");

    if (error) {
      console.error("Error cancelling order:", error);
      alert("Cannot cancel this order. It may have already been processed.");
    } else {
      fetchOrders();
    }
  };

  if (loading) {
    return (
      <div className="pt-24 pb-12 px-6 max-w-screen-2xl mx-auto min-h-screen">
        <p className="text-on-surface-variant font-medium animate-pulse">Loading orders...</p>
      </div>
    );
  }

  const activeOrdersCount = orders.filter(o => o.status === "Pending" || o.status === "Shipped").length;
  const deliveredOrdersCount = orders.filter(o => o.status === "Delivered").length;
  const latestOrder = orders.find(o => o.status === "Pending" || o.status === "Shipped") || orders[0];

  return (
    <div className="pt-8 pb-12 px-6 max-w-screen-2xl mx-auto min-h-screen">
      <section className="space-y-8">
        {/* Dashboard Welcome & Quick Stats */}
        <header className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-full mb-2">
            <h1 className="text-3xl font-extrabold font-headline tracking-tighter text-on-surface">Overview</h1>
            <p className="text-on-surface-variant font-body mb-2">Manage your purchases and track active deliveries.</p>
          </div>
          
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex items-center justify-between group overflow-hidden relative border border-outline-variant/10">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Active Orders</p>
              <h2 className="text-3xl font-bold font-headline text-primary">
                {activeOrdersCount < 10 ? `0${activeOrdersCount}` : activeOrdersCount}
              </h2>
            </div>
            <span className="material-symbols-outlined text-4xl text-primary/10 group-hover:scale-125 transition-transform" style={{fontVariationSettings: "'FILL' 1"}}>package_2</span>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-primary opacity-20"></div>
          </div>
          
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex items-center justify-between group overflow-hidden relative border border-outline-variant/10">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Delivered items</p>
              <h2 className="text-3xl font-bold font-headline text-tertiary-container">
                {deliveredOrdersCount < 10 ? `0${deliveredOrdersCount}` : deliveredOrdersCount}
              </h2>
            </div>
            <span className="material-symbols-outlined text-4xl text-tertiary-container/10 group-hover:scale-125 transition-transform" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-tertiary-container opacity-20"></div>
          </div>
          
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex items-center justify-between group overflow-hidden relative border border-outline-variant/10">
            <div>
              <p className="text-sm font-medium text-on-surface-variant">Rewards Points</p>
              <h2 className="text-3xl font-bold font-headline text-secondary">2,450</h2>
            </div>
            <span className="material-symbols-outlined text-4xl text-secondary/10 group-hover:scale-125 transition-transform" style={{fontVariationSettings: "'FILL' 1"}}>loyalty</span>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-secondary opacity-20"></div>
          </div>
        </header>

        {/* Track Status / Recent Order Activity Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Recent Orders List */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-bold font-headline text-xl text-primary">Recent Orders</h3>
            </div>
            
            {orders.length === 0 ? (
              <div className="bg-surface-container-low p-8 rounded-xl text-center border border-outline-variant/10">
                <span className="material-symbols-outlined text-outline-variant text-4xl mb-2">inbox</span>
                <p className="text-on-surface-variant font-medium">You have no orders yet.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4 border border-outline-variant/10">
                  <div className="flex justify-between items-start border-b border-surface-container-highest pb-4">
                    <div>
                      <h4 className="font-bold text-on-surface font-headline">Order #{order.id.slice(0,8).toUpperCase()}</h4>
                      <p className="text-xs text-on-surface-variant">
                        Ordered on {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold font-headline text-on-surface"><span className="text-secondary">$</span>{order.total_amount.toFixed(2)}</p>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded leading-none inline-block mt-1
                        ${order.status === "Pending" ? "bg-secondary-fixed text-on-secondary-fixed" : 
                          order.status === "Shipped" ? "bg-tertiary-container/10 text-tertiary-container" : 
                          order.status === "Delivered" ? "bg-on-surface-variant/10 text-on-surface-variant" : 
                          "bg-error-container text-on-error-container"}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center group">
                        <div className="w-16 h-16 bg-surface-container-low rounded-lg overflow-hidden shrink-0 border border-outline-variant/10">
                          <img 
                            src={item.products.image_url || "/placeholder-image.png"} 
                            alt={item.products.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm text-on-surface line-clamp-1">{item.products.title}</p>
                          <p className="text-xs text-on-surface-variant">Qty: {item.quantity} • ${item.price_at_purchase.toFixed(2)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 flex justify-end gap-2">
                    {order.status === "Pending" && (
                      <button 
                        onClick={() => handleCancelOrder(order.id)}
                        className="text-xs font-bold px-4 py-2 rounded-full text-error border border-error/50 hover:bg-error-container transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                    <button className="text-xs font-bold px-4 py-2 rounded-full bg-primary text-white hover:bg-primary-container transition-colors shadow-sm">
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Tracking & Status Visual */}
          <div className="lg:col-span-2 space-y-6">
            {latestOrder && (
              <div className="bg-primary text-white p-6 rounded-2xl relative overflow-hidden shadow-lg">
                <h3 className="font-headline font-bold text-lg mb-4">
                  {latestOrder.status === 'Delivered' ? 'Latest Delivery' : 'Latest Shipment'}
                </h3>
                <div className="flex flex-col gap-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-white" style={{fontVariationSettings: "'FILL' 1"}}>{latestOrder.status === 'Delivered' ? 'inventory_2' : 'local_shipping'}</span>
                    </div>
                    <div>
                      <p className="text-xs text-primary-fixed-dim">Current Status</p>
                      <p className="text-sm font-bold">{latestOrder.status}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${latestOrder.status !== 'Cancelled' ? 'bg-secondary' : 'bg-surface-tint'}`}></div>
                      <div className={`flex-1 h-0.5 ${(latestOrder.status === 'Shipped' || latestOrder.status === 'Delivered') ? 'bg-secondary' : 'bg-primary-container'}`}></div>
                      <div className={`w-2 h-2 rounded-full ${(latestOrder.status === 'Shipped' || latestOrder.status === 'Delivered') ? 'bg-secondary' : 'bg-primary-container'}`}></div>
                      <div className={`flex-1 h-0.5 ${latestOrder.status === 'Delivered' ? 'bg-secondary' : 'bg-primary-container'}`}></div>
                      <div className={`w-2 h-2 rounded-full ${latestOrder.status === 'Delivered' ? 'bg-secondary' : 'bg-primary-container'}`}></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-primary-fixed-dim uppercase tracking-wider">
                      <span>Pending</span>
                      <span>Shipped</span>
                      <span>Delivered</span>
                    </div>
                  </div>
                  <p className="text-xs italic text-primary-fixed-dim">Order ID: #{latestOrder.id.slice(0,8).toUpperCase()}</p>
                </div>
                {/* Decorative background element */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"></div>
              </div>
            )}
            
            {/* Contextual Action Items */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-surface-container-high p-4 rounded-xl border border-transparent hover:border-primary/20 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary text-xl">support_agent</span>
                  <div>
                    <p className="text-xs font-bold text-primary">Need Help?</p>
                    <p className="text-[10px] text-on-surface-variant">Contact Bazario Support</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default BuyerOrders;
