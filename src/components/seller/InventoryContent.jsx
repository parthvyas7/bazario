const InventoryContent = ({ products, onStartEdit, onDeleteProduct }) => {
  return (
    <div className="flex-1 p-8 min-h-screen">
      <header className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="font-headline text-3xl font-extrabold text-primary tracking-tighter">
            Product Inventory
          </h2>
          <p className="text-on-surface-variant font-medium mt-1">
            Manage your curated collection and stock levels.
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
              className="bg-surface-container-highest border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all w-64"
              placeholder="Search products..."
              type="text"
            />
          </div>
          <button className="bg-surface-container-high text-on-surface p-2.5 rounded-xl flex items-center gap-2 hover:bg-surface-variant transition-colors">
            <span className="material-symbols-outlined" data-icon="filter_list">
              filter_list
            </span>
            <span className="text-sm font-semibold">Filter</span>
          </button>
        </div>
      </header>

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
            08
          </h3>
          <div className="mt-4 flex items-center text-xs font-bold text-error">
            <span
              className="material-symbols-outlined text-sm"
              data-icon="warning"
            >
              warning
            </span>
            <span className="ml-1">Needs attention</span>
          </div>
        </div>
        <div className="col-span-2 bg-primary p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <p className="text-primary-fixed-dim text-xs font-bold uppercase tracking-wider mb-2">
                Inventory Value
              </p>
              <h3 className="font-headline text-4xl font-extrabold text-white tracking-tighter">
                ₹ 14,20,500
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
        {products.map((product) => (
          <div
            key={product.id}
            className="grid grid-cols-12 px-6 py-4 bg-surface-container-lowest rounded-xl items-center hover:scale-[1.005] transition-transform duration-200 mb-2"
          >
            <div className="col-span-5 flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-surface-container overflow-hidden flex-shrink-0">
                <img
                  className="w-full h-full object-cover"
                  src={product.image_url || "/placeholder-image.png"}
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
                {product.price.toFixed(2)}
              </p>
            </div>
            <div className="col-span-2 flex flex-col items-center">
              <span className="text-sm font-bold text-on-surface">
                Available
              </span>
              <div className="w-24 h-1.5 bg-surface-container rounded-full mt-2 overflow-hidden">
                <div className="bg-primary h-full w-[100%]"></div>
              </div>
            </div>
            <div className="col-span-1 flex justify-center">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-tertiary-fixed text-on-tertiary-fixed">
                Live
              </span>
            </div>
            <div className="col-span-2 flex justify-end gap-2">
              <button
                onClick={() => onStartEdit(product)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">edit</span>
              </button>
              <button
                onClick={() => onDeleteProduct(product.id)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-error/5 hover:text-error transition-colors"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      <footer className="mt-12 pt-8 border-t border-surface-variant flex items-center justify-between">
        <p className="text-on-surface-variant text-xs">
          Showing 4 of 124 curated listings
        </p>
        <div className="flex gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm text-primary font-bold text-sm">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant font-medium text-sm hover:bg-surface-container-high transition-colors">
            2
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant font-medium text-sm hover:bg-surface-container-high transition-colors">
            3
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant font-medium text-sm hover:bg-surface-container-high transition-colors">
            <span
              className="material-symbols-outlined text-sm"
              data-icon="chevron_right"
            >
              chevron_right
            </span>
          </button>
        </div>
      </footer>
    </div>
  );
};
export default InventoryContent;
