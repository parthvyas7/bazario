import React from 'react';

const SellerMobileNav = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-t border-outline-variant/20 z-50 flex justify-around items-center px-4">
      <button onClick={() => setActiveTab('overview')} className={`flex flex-col items-center gap-1 ${activeTab === 'overview' ? 'text-[#15157d]' : 'text-[#1b1b1f]/60'}`}>
        <span className="material-symbols-outlined">dashboard</span>
        <span className="text-[10px] font-bold">Overview</span>
      </button>
      <button onClick={() => setActiveTab('products')} className={`flex flex-col items-center gap-1 ${activeTab === 'products' ? 'text-[#15157d]' : 'text-[#1b1b1f]/60'}`}>
        <span className="material-symbols-outlined">inventory_2</span>
        <span className="text-[10px] font-medium">Stock</span>
      </button>
      <div className="relative -top-6">
        <button onClick={() => setActiveTab('add_product')} className="w-12 h-12 bg-secondary text-white rounded-full shadow-lg flex items-center justify-center">
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>
      <button onClick={() => setActiveTab('orders')} className={`flex flex-col items-center gap-1 ${activeTab === 'orders' ? 'text-[#15157d]' : 'text-[#1b1b1f]/60'}`}>
        <span className="material-symbols-outlined">shopping_bag</span>
        <span className="text-[10px] font-medium">Orders</span>
      </button>
      <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-[#15157d]' : 'text-[#1b1b1f]/60'}`}>
        <span className="material-symbols-outlined">settings</span>
        <span className="text-[10px] font-medium">Store</span>
      </button>
    </nav>
  );
};

export default SellerMobileNav;
