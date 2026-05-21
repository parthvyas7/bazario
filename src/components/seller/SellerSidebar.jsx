import React from 'react';

const SellerSidebar = ({ activeTab, setActiveTab, profile, onSignOut }) => {
  return (
    <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 z-40 bg-[#f6f2f8] flex-col p-6 gap-2 font-['Plus_Jakarta_Sans'] font-medium text-[#15157d]">
      <div className="mb-10 px-2">
        <h1 className="text-xl font-black text-[#15157d]">Seller Studio</h1>
        <p className="text-xs text-[#1b1b1f]/60 mt-1 uppercase tracking-wider">The Digital Seller</p>
      </div>
      <nav className="flex flex-col gap-2 flex-grow">
        <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-sm transition-all duration-200 ${activeTab === 'overview' ? 'bg-white text-[#15157d]' : 'text-[#1b1b1f]/60 hover:bg-[#eae7ed] hover:translate-x-1'}`}>
          <span className="material-symbols-outlined">dashboard</span>
          <span>Overview</span>
        </button>
        <button onClick={() => setActiveTab('products')} className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-sm transition-all duration-200 ${activeTab === 'products' ? 'bg-white text-[#15157d]' : 'text-[#1b1b1f]/60 hover:bg-[#eae7ed] hover:translate-x-1'}`}>
          <span className="material-symbols-outlined">inventory_2</span>
          <span>Inventory</span>
        </button>
        <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-sm transition-all duration-200 ${activeTab === 'orders' ? 'bg-white text-[#15157d]' : 'text-[#1b1b1f]/60 hover:bg-[#eae7ed] hover:translate-x-1'}`}>
          <span className="material-symbols-outlined">shopping_bag</span>
          <span>Orders</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-sm transition-all duration-200 ${activeTab === 'settings' ? 'bg-white text-[#15157d]' : 'text-[#1b1b1f]/60 hover:bg-[#eae7ed] hover:translate-x-1'}`}>
          <span className="material-symbols-outlined">settings</span>
          <span>Store Settings</span>
        </button>
      </nav>
      <div className="mt-auto space-y-4">
        <button onClick={() => setActiveTab('add_product')} className="w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-95 transition-transform active:opacity-80">
          <span className="material-symbols-outlined text-sm">add</span>
          Add New Product
        </button>
        <div className="flex flex-col gap-2 pt-4 border-t border-outline-variant/20">
          <div className="flex items-center gap-3 px-2">
            <img alt="Seller Profile" className="w-10 h-10 rounded-full object-cover" src={profile?.logo_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuBi3Dho0MjP66VJu4kYQ9V0ijWPW9C5s8-p1Ntzj6VJgQGtb4hs7-TASXK2ABMsNn7iK-GLslbFHHFgWLHrscR6rcUkUFr6Y0pXRGlAQdPO6vXUnZsXx3CPSuow23PnWqu7l6kKOYLw6ixDWa03Z9YJ5JvUKw_ybpxxQBnXrdWpvDtvic8xqi4A6Pg-jCqhb8j2r1haIkju6fl6gzEaZAGNvlc6MeBZyDPyUSVI2_H0RRbnRlGCePXfirnuofmvhbd4GzoExZindOk"} />
            <div className="overflow-hidden flex-grow">
              <p className="text-sm font-bold truncate">{profile?.store_name || "My Store"}</p>
              <p className="text-[10px] opacity-60 truncate">{profile?.full_name || profile?.email || "Seller"}</p>
            </div>
          </div>
          <button 
            onClick={onSignOut} 
            className="w-full mt-2 py-2 px-4 text-xs font-bold bg-[#f1edeb] text-error hover:bg-error/10 hover:text-error rounded-lg flex items-center justify-center gap-2 border border-outline-variant/25 transition-all"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SellerSidebar;
