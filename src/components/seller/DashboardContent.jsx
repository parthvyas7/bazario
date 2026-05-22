import React from "react";
import { formatPrice } from "../../utils/services";

const DashboardContent = ({
  totalSales,
  activeOrdersCount,
  products,
  orders,
  onSignOut,
  setActiveTab,
}) => {
  // 1. Calculate sales trend (percentage change in the last 30 days vs 30 days prior)
  const calculateSalesTrend = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    let currentSales = 0;
    let previousSales = 0;

    orders.forEach((order) => {
      const orderDate = new Date(order.created_at);
      if (orderDate >= thirtyDaysAgo && orderDate <= now) {
        currentSales += order.total_amount || 0;
      } else if (orderDate >= sixtyDaysAgo && orderDate < thirtyDaysAgo) {
        previousSales += order.total_amount || 0;
      }
    });

    if (previousSales === 0) {
      return currentSales > 0 ? 100 : 0;
    }
    return ((currentSales - previousSales) / previousSales) * 100;
  };

  const salesTrend = calculateSalesTrend();
  const salesTrendText = `${salesTrend >= 0 ? "+" : ""}${salesTrend.toFixed(1)}% vs last month`;
  const salesTrendIcon = salesTrend >= 0 ? "trending_up" : "trending_down";
  const salesTrendColorClass = salesTrend >= 0 
    ? "text-tertiary-container bg-tertiary-container/10" 
    : "text-error bg-error/10";

  // 2. Calculate pending dispatch orders
  const pendingDispatchCount = orders.filter((o) => o.status === "Pending").length;

  // 3. Calculate in stock percentage
  const inStockPercentage = products.length > 0 
    ? (products.filter((p) => (p.stock_quantity || 0) > 0).length / products.length) * 100 
    : 0;

  // Helper to summarize products in an order
  const getOrderProductText = (order) => {
    const items = order.order_items || [];
    if (items.length === 0) return "N/A";
    const firstProductName = items[0]?.products?.name || "Unknown Product";
    if (items.length > 1) {
      return `${firstProductName} (+${items.length - 1} more)`;
    }
    return firstProductName;
  };

  return (
    <div className="p-8 flex flex-col gap-8 max-w-[1400px] mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="flex justify-between items-start gap-4 w-full md:w-auto">
          <div>
            <h3 className="text-4xl font-extrabold tracking-tight text-primary">
              Overview
            </h3>
            <p className="text-on-surface-variant mt-2">
              Welcome back to your management space. Here is your store's pulse
              today.
            </p>
          </div>
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="md:hidden p-2 text-error hover:bg-error/10 rounded-full flex items-center justify-center transition-all"
              title="Sign Out"
            >
              <span className="material-symbols-outlined text-2xl">logout</span>
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <button className="px-6 py-3 bg-surface-container-high rounded-full font-semibold text-sm hover:bg-surface-container-highest transition-colors">
              View Analytics
            </button>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg z-50">
              Coming soon...
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-neutral-900"></div>
            </div>
          </div>
          <div className="relative group">
            <button className="px-6 py-3 bg-gradient-to-r from-primary to-primary-container text-white rounded-full font-semibold text-sm shadow-md hover:scale-[0.98] transition-transform">
              Download Report
            </button>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg z-50">
              Coming soon...
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-neutral-900"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <p className="text-sm font-medium text-on-surface-variant mb-1">
            Total Sales
          </p>
          <h4 className="text-3xl font-black text-primary">
            ₹{formatPrice(totalSales)}
          </h4>
          <div className={`mt-4 flex items-center gap-2 text-xs font-bold ${salesTrendColorClass} w-fit px-2 py-1 rounded`}>
            <span
              className="material-symbols-outlined text-xs"
              data-icon={salesTrendIcon}
            >
              {salesTrendIcon}
            </span>
            {salesTrendText}
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <p className="text-sm font-medium text-on-surface-variant mb-1">
            Active Orders
          </p>
          <h4 className="text-3xl font-black text-on-surface">
            {activeOrdersCount}
          </h4>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-secondary bg-secondary/10 w-fit px-2 py-1 rounded">
            <span
              className="material-symbols-outlined text-xs"
              data-icon="timer"
            >
              timer
            </span>
            {pendingDispatchCount} pending dispatch
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-container/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <p className="text-sm font-medium text-on-surface-variant mb-1">
            Total Products
          </p>
          <h4 className="text-3xl font-black text-on-surface">
            {products.length}
          </h4>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-on-surface-variant bg-surface-container-high w-fit px-2 py-1 rounded">
            <span
              className="material-symbols-outlined text-xs"
              data-icon="inventory"
            >
              inventory
            </span>
            {inStockPercentage.toFixed(0)}% in stock
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl relative overflow-hidden group border-r-4 border-secondary">
          <p className="text-sm font-medium text-on-surface-variant mb-1">
            Store Rating
          </p>
          <h4 className="text-3xl font-black text-on-surface">
            4.8 <span className="text-lg text-on-surface-variant">/ 5.0</span>
          </h4>
          <div className="mt-4 flex items-center gap-1">
            <span
              className="material-symbols-outlined text-secondary"
              data-icon="star"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span
              className="material-symbols-outlined text-secondary"
              data-icon="star"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span
              className="material-symbols-outlined text-secondary"
              data-icon="star"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span
              className="material-symbols-outlined text-secondary"
              data-icon="star"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span
              className="material-symbols-outlined text-secondary"
              data-icon="star_half"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star_half
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-bold text-primary">Recent Orders</h4>
            <button
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('orders');
              }}
              className="text-sm font-semibold text-secondary hover:underline bg-transparent border-none p-0 cursor-pointer"
            >
              View All Orders
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-5 px-6 py-4 bg-surface-container-high rounded-t-xl text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              <div className="col-span-1">Order ID</div>
              <div className="col-span-1">Customer</div>
              <div className="col-span-1">Product</div>
              <div className="col-span-1">Amount</div>
              <div className="col-span-1 text-right">Status</div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 bg-surface-container-lowest rounded-b-xl border border-outline-variant/10">
                <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">inbox</span>
                <p className="text-on-surface-variant font-medium">No orders received yet.</p>
              </div>
            ) : (
              orders.slice(0, 4).map((order, index, arr) => (
                <div 
                  key={order.id} 
                  className={`grid grid-cols-5 px-6 py-5 bg-surface-container-lowest items-center group hover:bg-white transition-colors ${
                    index === arr.length - 1 ? 'rounded-b-xl' : ''
                  }`}
                >
                  <div className="col-span-1 font-mono text-sm">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </div>
                  <div className="col-span-1 text-sm font-semibold">
                    {order.buyers?.full_name || "Guest Buyer"}
                  </div>
                  <div className="col-span-1 text-sm truncate pr-4 italic" title={getOrderProductText(order)}>
                    {getOrderProductText(order)}
                  </div>
                  <div className="col-span-1 text-sm font-bold text-primary">
                    ₹{formatPrice(order.total_amount)}
                  </div>
                  <div className="col-span-1 text-right">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                      order.status === "Pending" 
                        ? "bg-secondary/10 text-secondary border-secondary/20" 
                        : order.status === "Shipped" 
                          ? "bg-primary-fixed text-primary border-primary/20" 
                          : order.status === "Delivered" 
                            ? "bg-tertiary-container/10 text-tertiary-container border-tertiary-container/20" 
                            : "bg-error-container/10 text-error border-error/20"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col gap-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
              Quick Actions
            </h4>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setActiveTab && setActiveTab('add_product')}
                className="w-full p-4 bg-white rounded-xl flex items-center gap-4 hover:shadow-md hover:translate-y-[-2px] transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span
                    className="material-symbols-outlined"
                    data-icon="add_circle"
                  >
                    add_circle
                  </span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm">Add New Product</p>
                  <p className="text-[11px] opacity-60">
                    Expand your product catalog
                  </p>
                </div>
              </button>
              <div className="relative group w-full">
                <button className="w-full p-4 bg-white rounded-xl flex items-center gap-4 hover:shadow-md hover:translate-y-[-2px] transition-all group-hover:shadow-md group-hover:translate-y-[-2px]">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                    <span
                      className="material-symbols-outlined"
                      data-icon="campaign"
                    >
                      campaign
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm">Create Campaign</p>
                    <p className="text-[11px] opacity-60">
                      Boost visibility for new drops
                    </p>
                  </div>
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg z-50">
                  Coming soon...
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-neutral-900"></div>
                </div>
              </div>
              <div className="relative group w-full">
                <button className="w-full p-4 bg-white rounded-xl flex items-center gap-4 hover:shadow-md hover:translate-y-[-2px] transition-all group-hover:shadow-md group-hover:translate-y-[-2px]">
                  <div className="w-10 h-10 rounded-lg bg-outline-variant/20 flex items-center justify-center text-on-surface group-hover:bg-on-surface group-hover:text-white transition-colors">
                    <span
                      className="material-symbols-outlined"
                      data-icon="bar_chart"
                    >
                      bar_chart
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm">Store Insights</p>
                    <p className="text-[11px] opacity-60">
                      Analyze buyer behavior
                    </p>
                  </div>
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg z-50">
                  Coming soon...
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-neutral-900"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] flex flex-col justify-end p-6 group">
            <img
              alt="Digital Marketplace Marketing"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              data-alt="Modern neon-lit urban store facade at night with vibrant indigo and coral lighting reflecting on sleek surfaces"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCm32EBzQNzy8Za_MOC2pvsDytjuZtVH7V8muaFzJqw5DwOn1Hr5VLtu05J-bJP4Jm0LqMov_951qzc1ZIMyBTNkrQoeBE8RfYAgLdrHKjXMnZLsyjeTFxh_bAVwapelpe1iLn0GT6--w0bdhFc-SkC7KNmXzlR5AZ4lG0HEOoxonAbxP84SxRikYzq-TqAeR_ZuepdmOPbsRrF0R_QYvuaOVGlXhWfps9DwOYQZxY41nqKKGwvQufKsWhRQSxInOz7PuHVEyNMqVc"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="relative z-10">
              <span className="px-2 py-1 bg-secondary text-white text-[10px] font-bold rounded uppercase mb-2 inline-block">
                New Feature
              </span>
              <h5 className="text-white font-bold text-lg leading-tight">
                Scale your brand with Bazario Prime
              </h5>
              <div className="relative group/prime w-fit">
                <button className="mt-3 text-white/90 text-sm font-semibold flex items-center gap-2 hover:gap-4 transition-all">
                  Learn More{" "}
                  <span
                    className="material-symbols-outlined text-sm"
                    data-icon="arrow_forward"
                  >
                    arrow_forward
                  </span>
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover/prime:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg z-50">
                  Coming soon...
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-neutral-900"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardContent;
