import React from "react";

const DashboardContent = ({
  totalSales,
  activeOrdersCount,
  products,
  orders,
}) => {
  return (
    <div className="mt-20 p-8 flex flex-col gap-8 max-w-[1400px] mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h3 className="text-4xl font-extrabold tracking-tight text-primary">
            Overview
          </h3>
          <p className="text-on-surface-variant mt-2">
            Welcome back to your curation space. Here is your store's pulse
            today.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-surface-container-high rounded-full font-semibold text-sm hover:bg-surface-container-highest transition-colors">
            View Analytics
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-primary to-primary-container text-white rounded-full font-semibold text-sm shadow-md hover:scale-[0.98] transition-transform">
            Download Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <p className="text-sm font-medium text-on-surface-variant mb-1">
            Total Sales
          </p>
          <h4 className="text-3xl font-black text-primary">
            ${totalSales.toFixed(2)}
          </h4>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-tertiary-container bg-tertiary-container/10 w-fit px-2 py-1 rounded">
            <span
              className="material-symbols-outlined text-xs"
              data-icon="trending_up"
            >
              trending_up
            </span>
            +12.5% vs last month
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
            8 urgent dispatch
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
            92% in stock
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
            <a
              className="text-sm font-semibold text-secondary hover:underline"
              href="#"
            >
              View All Orders
            </a>
          </div>
          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-5 px-6 py-4 bg-surface-container-high rounded-t-xl text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              <div className="col-span-1">Order ID</div>
              <div className="col-span-1">Customer</div>
              <div className="col-span-1">Product</div>
              <div className="col-span-1">Amount</div>
              <div className="col-span-1 text-right">Status</div>
            </div>

            <div className="grid grid-cols-5 px-6 py-5 bg-surface-container-lowest items-center group hover:bg-white transition-colors">
              <div className="col-span-1 font-mono text-sm">#BZ-9042</div>
              <div className="col-span-1 text-sm font-semibold">
                Kabir Singh
              </div>
              <div className="col-span-1 text-sm truncate pr-4 italic">
                Handcrafted Ceramic Vase
              </div>
              <div className="col-span-1 text-sm font-bold text-primary">
                ₹ 4,200
              </div>
              <div className="col-span-1 text-right">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-secondary/10 text-secondary border border-secondary/20">
                  Pending
                </span>
              </div>
            </div>

            <div className="grid grid-cols-5 px-6 py-5 bg-surface-container-lowest items-center group hover:bg-white transition-colors">
              <div className="col-span-1 font-mono text-sm">#BZ-9038</div>
              <div className="col-span-1 text-sm font-semibold">
                Ananya Iyer
              </div>
              <div className="col-span-1 text-sm truncate pr-4 italic">
                Indigo Cotton Saree
              </div>
              <div className="col-span-1 text-sm font-bold text-primary">
                ₹ 12,800
              </div>
              <div className="col-span-1 text-right">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-primary-fixed text-primary border border-primary/20">
                  Shipped
                </span>
              </div>
            </div>

            <div className="grid grid-cols-5 px-6 py-5 bg-surface-container-lowest items-center group hover:bg-white transition-colors">
              <div className="col-span-1 font-mono text-sm">#BZ-8991</div>
              <div className="col-span-1 text-sm font-semibold">Rohan Das</div>
              <div className="col-span-1 text-sm truncate pr-4 italic">
                Walnut Wood Lamp
              </div>
              <div className="col-span-1 text-sm font-bold text-primary">
                ₹ 8,450
              </div>
              <div className="col-span-1 text-right">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-tertiary-container/10 text-tertiary-container border border-tertiary-container/20">
                  Delivered
                </span>
              </div>
            </div>

            <div className="grid grid-cols-5 px-6 py-5 bg-surface-container-lowest items-center group hover:bg-white transition-colors rounded-b-xl">
              <div className="col-span-1 font-mono text-sm">#BZ-8985</div>
              <div className="col-span-1 text-sm font-semibold">Meera Sen</div>
              <div className="col-span-1 text-sm truncate pr-4 italic">
                Brass Spice Box
              </div>
              <div className="col-span-1 text-sm font-bold text-primary">
                ₹ 2,900
              </div>
              <div className="col-span-1 text-right">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-tertiary-container/10 text-tertiary-container border border-tertiary-container/20">
                  Delivered
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col gap-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
              Quick Actions
            </h4>
            <div className="flex flex-col gap-3">
              <button className="w-full p-4 bg-white rounded-xl flex items-center gap-4 hover:shadow-md hover:translate-y-[-2px] transition-all group">
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
                    Expand your curated list
                  </p>
                </div>
              </button>
              <button className="w-full p-4 bg-white rounded-xl flex items-center gap-4 hover:shadow-md hover:translate-y-[-2px] transition-all group">
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
              <button className="w-full p-4 bg-white rounded-xl flex items-center gap-4 hover:shadow-md hover:translate-y-[-2px] transition-all group">
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
              <button className="mt-3 text-white/90 text-sm font-semibold flex items-center gap-2 hover:gap-4 transition-all">
                Learn More{" "}
                <span
                  className="material-symbols-outlined text-sm"
                  data-icon="arrow_forward"
                >
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardContent;
