import React from 'react';
import { Link } from 'react-router-dom';

const SellerTopNav = () => {
  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 z-30 h-20 bg-[#fbf8fe]/60 backdrop-blur-xl flex justify-between items-center px-8 text-[#15157d] font-['Plus_Jakarta_Sans'] tracking-tight shadow-sm">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold">Bazario</h2>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex gap-6">
          <Link to="/" className="text-[#1b1b1f]/70 hover:text-[#b02f00] transition-colors duration-300">Marketplace</Link>
          <Link to="/cart" className="text-[#1b1b1f]/70 hover:text-[#b02f00] transition-colors duration-300">Cart</Link>
        </div>
        <div className="h-8 w-[1px] bg-outline-variant/30 hidden md:block"></div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined cursor-pointer hover:scale-95 transition-transform">person</span>
          <button className="hidden lg:block font-semibold hover:text-[#b02f00] transition-colors">Seller Dashboard</button>
        </div>
      </div>
    </header>
  );
};

export default SellerTopNav;
