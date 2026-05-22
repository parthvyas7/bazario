import React, { useState, useEffect } from 'react';
import { formatPrice } from '../../utils/services';

const InventoryContent = ({ products, onStartEdit, onDeleteProduct }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All"); // All, Live, Private
  const [selectedStock, setSelectedStock] = useState("All"); // All, Low Stock, Out of Stock
  const [selectedCategory, setSelectedCategory] = useState("All"); // All, categoryName
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Calculate low stock count (based on all products)
  const lowStockCount = products.filter(p => (p.stock_quantity || 0) <= 5).length;
  
  // Calculate total inventory value (based on all products)
  const totalInventoryValue = products.reduce((sum, p) => {
    const price = typeof p.price === 'number' ? p.price : parseFloat(p.price || 0);
    const qty = parseInt(p.stock_quantity) || 0;
    return sum + (price * qty);
  }, 0);

  const formattedValue = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(totalInventoryValue);

  // Dynamic category list
  const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];

  // Filtering logic
  const filteredProducts = products.filter(product => {
    // 1. Search Query filter
    const nameMatch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const descMatch = product.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const skuMatch = product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const matchesSearch = searchQuery === "" || nameMatch || descMatch || skuMatch;

    // 2. Status/Visibility filter
    const matchesStatus = selectedStatus === "All" ||
      (selectedStatus === "Live" && product.visibility !== "Private") ||
      (selectedStatus === "Private" && product.visibility === "Private");

    // 3. Stock filter
    const matchesStock = selectedStock === "All" ||
      (selectedStock === "Low Stock" && (product.stock_quantity || 0) > 0 && (product.stock_quantity || 0) <= 5) ||
      (selectedStock === "Out of Stock" && (product.stock_quantity || 0) === 0);

    // 4. Category filter
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesStock && matchesCategory;
  });

  // Reset page to 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, selectedStock, selectedCategory]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="flex-1 p-8 min-h-screen">
      <header className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="font-headline text-3xl font-extrabold text-primary tracking-tighter">
            Product Inventory
          </h2>
          <p className="text-on-surface-variant font-medium mt-1">
            Manage your product collection and stock levels.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <span
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
              data-icon="search"
            >
              search
            </span>
            <input
              className="bg-surface-container-highest border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all w-64 text-on-surface placeholder:text-outline"
              placeholder="Search products..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl flex items-center gap-2 transition-colors ${
              showFilters || selectedStatus !== "All" || selectedStock !== "All" || selectedCategory !== "All"
                ? "bg-primary text-white hover:bg-primary/95 shadow-sm"
                : "bg-surface-container-high text-on-surface hover:bg-surface-variant"
            }`}
          >
            <span className="material-symbols-outlined" data-icon="filter_list">
              filter_list
            </span>
            <span className="text-sm font-semibold">Filter</span>
          </button>
        </div>
      </header>

      {/* Collapsible Filter Panel */}
      {showFilters && (
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/15 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          {/* Status Filter */}
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2.5">
              Visibility Status
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {["All", "Live", "Private"].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-full transition-all ${
                    selectedStatus === st
                      ? "bg-primary text-white"
                      : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Filter */}
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2.5">
              Stock Level
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {["All", "Low Stock", "Out of Stock"].map((sl) => (
                <button
                  key={sl}
                  onClick={() => setSelectedStock(sl)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-full transition-all ${
                    selectedStock === sl
                      ? "bg-primary text-white"
                      : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                  }`}
                >
                  {sl}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2.5">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-surface-container-high border-none rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-primary transition-all text-on-surface cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="col-span-1 bg-surface-container-lowest p-6 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 bg-primary/5 w-24 h-24 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-2">
            Total Listings
          </p>
          <h3 className="font-headline text-4xl font-extrabold text-primary">
            {products.length}
          </h3>
          <div className="mt-4 flex items-center text-xs font-bold text-tertiary-container">
            <span
              className="material-symbols-outlined text-sm"
              data-icon="trending_up"
            >
              trending_up
            </span>
            <span className="ml-1">+12% this month</span>
          </div>
        </div>
        <div className="col-span-1 bg-surface-container-lowest p-6 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 bg-secondary/5 w-24 h-24 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mb-2">
            Low Stock Items
          </p>
          <h3 className="font-headline text-4xl font-extrabold text-secondary">
            {String(lowStockCount).padStart(2, '0')}
          </h3>
          <div className="mt-4 flex items-center text-xs font-bold text-error">
            <span
              className="material-symbols-outlined text-sm"
              data-icon="warning"
            >
              warning
            </span>
            <span className="ml-1">{lowStockCount > 0 ? "Needs attention" : "All stock healthy"}</span>
          </div>
        </div>
        <div className="col-span-2 bg-primary p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <p className="text-primary-fixed-dim text-xs font-bold uppercase tracking-wider mb-2">
                Inventory Value
              </p>
              <h3 className="font-headline text-4xl font-extrabold text-white tracking-tighter">
                ₹{formatPrice(totalInventoryValue)}
              </h3>
            </div>
            <p className="text-primary-fixed text-sm opacity-80 mt-4">
              Estimated retail value of current stock.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4">
            <span
              className="material-symbols-outlined text-[160px]"
              data-icon="payments"
            >
              payments
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="grid grid-cols-12 px-6 py-4 bg-surface-container-high rounded-xl mb-4 items-center">
          <div className="col-span-5 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            Product &amp; Category
          </div>
          <div className="col-span-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            Price (₹)
          </div>
          <div className="col-span-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center">
            Stock Level
          </div>
          <div className="col-span-1 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center">
            Status
          </div>
          <div className="col-span-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-right">
            Actions
          </div>
        </div>

        {paginatedProducts.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-outline-variant text-5xl mb-4">inventory_2</span>
            <h3 className="text-xl font-bold font-headline text-primary mb-2">No Products Found</h3>
            <p className="text-on-surface-variant max-w-sm">No items match your search or filter criteria. Try clearing some filters.</p>
          </div>
        ) : (
          paginatedProducts.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-12 px-6 py-4 bg-surface-container-lowest rounded-xl items-center hover:scale-[1.005] transition-transform duration-200 mb-2 border border-outline-variant/5"
            >
              <div className="col-span-5 flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-surface-container overflow-hidden flex-shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    src={product.image_url || "/placeholder-image.png"}
                    alt={product.name}
                  />
                </div>
                <div>
                  <h4 className="font-headline font-bold text-on-surface">
                    {product.name}
                  </h4>
                  <span className="text-xs font-medium text-on-surface-variant bg-surface-container-low px-2 py-1 rounded">
                    {product.category || "General"}
                  </span>
                </div>
              </div>
              <div className="col-span-2">
                <p className="font-headline font-bold text-on-surface text-lg">
                  <span className="text-secondary mr-1">₹</span>
                  {formatPrice(product.price)}
                </p>
              </div>
              <div className="col-span-2 flex flex-col items-center">
                <span className={`text-sm font-bold ${product.stock_quantity > 0 ? 'text-on-surface' : 'text-error'}`}>
                  {product.stock_quantity > 0 ? `${product.stock_quantity} available` : 'Out of stock'}
                </span>
                <div className="w-24 h-1.5 bg-surface-container rounded-full mt-2 overflow-hidden">
                  <div 
                    className={`h-full ${product.stock_quantity === 0 ? 'bg-error' : product.stock_quantity <= 5 ? 'bg-secondary' : 'bg-primary'}`} 
                    style={{ width: `${Math.min(100, ((product.stock_quantity || 0) / 50) * 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="col-span-1 flex justify-center">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                  product.visibility === 'Private' 
                    ? 'bg-surface-container-highest text-on-surface-variant' 
                    : 'bg-tertiary-fixed text-on-tertiary-fixed'
                }`}>
                  {product.visibility === 'Private' ? 'Private' : 'Live'}
                </span>
              </div>
              <div className="col-span-2 flex justify-end gap-2">
                <button
                  onClick={() => onStartEdit(product)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-colors"
                  aria-label="Edit product"
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button
                  onClick={() => onDeleteProduct(product.id)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-error/5 hover:text-error transition-colors"
                  aria-label="Delete product"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <footer className="mt-12 pt-8 border-t border-surface-variant flex items-center justify-between">
        <p className="text-on-surface-variant text-xs">
          Showing {filteredProducts.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} product listings
        </p>
        <div className="flex gap-2">
          {currentPage > 1 && (
            <button 
              onClick={() => setCurrentPage(currentPage - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant font-medium text-sm hover:bg-surface-container-high transition-colors"
            >
              <span
                className="material-symbols-outlined text-sm"
                data-icon="chevron_left"
              >
                chevron_left
              </span>
            </button>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm transition-all ${
                currentPage === page
                  ? "bg-primary text-white shadow-sm"
                  : "text-on-surface-variant font-medium hover:bg-surface-container-high"
              }`}
            >
              {page}
            </button>
          ))}
          {currentPage < totalPages && (
            <button 
              onClick={() => setCurrentPage(currentPage + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant font-medium text-sm hover:bg-surface-container-high transition-colors"
            >
              <span
                className="material-symbols-outlined text-sm"
                data-icon="chevron_right"
              >
                chevron_right
              </span>
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default InventoryContent;
