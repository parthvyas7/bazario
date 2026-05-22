import { useCartStore } from "../../stores/cartStore";
import { useAuthStore } from "../../stores/authStore";
import { Link, useNavigate } from "react-router-dom";

const ShoppingCart = () => {
  const { cart, removeFromCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const handleCheckout = () => {
    if (cart.length > 0) {
      if (!user) {
        navigate("/login?redirect=/cart");
      } else {
        navigate("/checkout");
      }
    }
  };

  return (
    <div className="pt-8 pb-20 px-6 max-w-screen-2xl mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-7 space-y-8">
          <header>
            <h1 className="text-3xl font-extrabold font-headline tracking-tighter text-primary">Your Curator Selection</h1>
            <p className="text-on-surface-variant font-medium mt-1">Review your items before final curation.</p>
          </header>

          {cart.length === 0 ? (
            <div className="p-12 text-center bg-surface-container-low rounded-2xl">
              <span className="material-symbols-outlined text-outline-variant text-4xl mb-4">shopping_bag</span>
              <p className="text-xl font-bold text-on-surface-variant mb-4">Your cart is empty.</p>
              <Link to="/" className="inline-block bg-primary text-white font-bold px-8 py-3 rounded-full hover:bg-primary/90 transition-colors">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="group flex flex-col sm:flex-row gap-6 p-4 bg-surface-container-lowest rounded-xl transition-all duration-300 hover:shadow-lg border border-outline-variant/10">
                  <div className="relative overflow-hidden rounded-lg aspect-square w-full sm:w-32 h-32 flex-shrink-0 bg-surface-container-low">
                    <img
                      src={item.image_url || "/placeholder-image.png"}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-headline font-bold text-lg text-on-surface line-clamp-1">{item.name}</h3>
                        <p className="text-sm text-on-surface-variant line-clamp-1">{item.description}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="material-symbols-outlined text-outline hover:text-error transition-colors"
                      >
                        delete
                      </button>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                      <div className="flex items-center bg-surface-container-high rounded-full px-3 py-1 gap-4">
                        <span className="font-headline font-semibold text-sm">Qty: {item.quantity}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-secondary font-headline font-bold">₹</span>
                        <span className="text-on-surface font-headline font-bold text-xl ml-1">{item.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 mt-10 lg:mt-0">
          <div className="sticky top-28">
            <div className="p-8 bg-primary text-white rounded-2xl shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
              <h2 className="text-xl font-headline font-bold mb-8 relative z-10">Selection Summary</h2>
              
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center text-on-primary-container">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-headline font-bold">₹{calculateTotal()}</span>
                </div>
                {/* Simplified view for cart before shipping is calculated */}
                <div className="h-px bg-white/10 my-4"></div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-on-primary-container uppercase tracking-widest">Estimated Total</p>
                    <p className="text-3xl font-headline font-extrabold tracking-tight">₹{calculateTotal()}</p>
                  </div>
                  <span className="bg-secondary px-3 py-1 rounded text-[10px] font-black uppercase mb-1">Secure SSL</span>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full mt-10 py-4 bg-gradient-to-r from-secondary to-secondary-container text-white font-headline font-bold text-lg rounded-full transition-transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-secondary/20 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
