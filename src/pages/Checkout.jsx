import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { orderService, authService, formatPrice } from "../utils/services";

const Checkout = () => {
  const { cart, removeFromCart, totalAmount, clearCart } = useCartStore();
  const { user, profile } = useAuthStore();
  const navigate = useNavigate();
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States', // Default or handled differently
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      setShippingInfo(prev => ({
        ...prev,
        fullName: profile.address_details?.fullName || profile.full_name || prev.fullName,
        address: profile.address_details?.address || prev.address,
        city: profile.address_details?.city || prev.city,
        postalCode: profile.address_details?.postalCode || prev.postalCode,
        country: profile.address_details?.country || prev.country,
        phone: profile.address_details?.phone || prev.phone
      }));
    }
  }, [profile]);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=checkout');
    }
    if (!isSubmitting && cart.length === 0) {
      navigate('/cart');
    }
  }, [user, cart, navigate, isSubmitting]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const gstValue = calculateSubtotal() * 0.18;
  const shippingCost = 450;
  const grandTotal = calculateSubtotal() + gstValue + shippingCost;

  const handleSubmitOrder = () => {
    if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode || !shippingInfo.phone) {
      alert("Please fill in all shipping details");
      return;
    }

    const orderData = {
      userId: user.id,
      items: cart,
      totalAmount: grandTotal,
      shippingInfo,
      status: 'Pending',
      paymentMethod
    };

    navigate('/payment', { state: { orderData } });
  };

  return (
    <div className="pt-8 pb-20 px-6 max-w-screen-2xl mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Cart Items & Shipping */}
        <div className="lg:col-span-7 space-y-8">
          <header>
            <h1 className="text-3xl font-extrabold font-headline tracking-tighter text-primary">Your Seller Selection</h1>
            <p className="text-on-surface-variant font-medium mt-1">Review your items before final purchase.</p>
          </header>

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
                      <span className="text-on-surface font-headline font-bold text-xl ml-1">{formatPrice(item.price)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Form Section */}
          <section className="mt-12 p-8 bg-surface-container-low rounded-2xl border border-outline-variant/10">
            <h2 className="text-xl font-headline font-bold text-primary mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">local_shipping</span> Delivery Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleInputChange}
                  placeholder="Arjun Mehta" 
                  className="bg-surface-container-highest border-none rounded-lg p-3 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all font-medium text-on-surface outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Mobile Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210" 
                  className="bg-surface-container-highest border-none rounded-lg p-3 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all font-medium text-on-surface outline-none"
                />
              </div>
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Street Address</label>
                <textarea 
                  rows="2" 
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  placeholder="Suite 405, Prestige Towers, Lavelle Road" 
                  className="bg-surface-container-highest border-none rounded-lg p-3 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all font-medium text-on-surface outline-none resize-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">City</label>
                <input 
                  type="text" 
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  placeholder="Bengaluru" 
                  className="bg-surface-container-highest border-none rounded-lg p-3 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all font-medium text-on-surface outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">PIN Code</label>
                <input 
                  type="text" 
                  name="postalCode"
                  value={shippingInfo.postalCode}
                  onChange={handleInputChange}
                  placeholder="560001" 
                  className="bg-surface-container-highest border-none rounded-lg p-3 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all font-medium text-on-surface outline-none"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Payment & Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 space-y-6">
            
            {/* Payment Methods */}
            <div className="p-8 bg-surface-container-low rounded-2xl border border-outline-variant/10">
              <h2 className="text-xl font-headline font-bold text-primary mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined">payments</span> Payment Method
              </h2>
              <div className="space-y-4">
                {/* UPI Option */}
                <label className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl border-2 border-transparent hover:border-secondary transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-primary text-3xl">qr_code_2</span>
                    <div>
                      <p className="font-headline font-bold text-on-surface">UPI Transfer</p>
                      <p className="text-xs text-on-surface-variant">GPay, PhonePe, Paytm</p>
                    </div>
                  </div>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-secondary focus:ring-secondary w-5 h-5 border-outline-variant cursor-pointer"
                  />
                </label>
                
                {/* Card Option */}
                <label className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl border-2 border-transparent hover:border-secondary transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-primary text-3xl">credit_card</span>
                    <div>
                      <p className="font-headline font-bold text-on-surface">Credit / Debit Card</p>
                      <p className="text-xs text-on-surface-variant">Visa, Mastercard, Amex</p>
                    </div>
                  </div>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-secondary focus:ring-secondary w-5 h-5 border-outline-variant cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Order Summary Card */}
            <div className="p-8 bg-primary text-white rounded-2xl shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
              <h2 className="text-xl font-headline font-bold mb-8 relative z-10">Order Summary</h2>
              
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center text-on-primary-container">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-headline font-bold">₹{formatPrice(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between items-center text-on-primary-container">
                  <span className="font-medium">Seller Shipping</span>
                  <span className="font-headline font-bold">₹{formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between items-center text-on-primary-container">
                  <span className="font-medium">GST (18%)</span>
                  <span className="font-headline font-bold">₹{formatPrice(gstValue)}</span>
                </div>
                <div className="h-px bg-white/10 my-4"></div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-on-primary-container uppercase tracking-widest">Total Amount</p>
                    <p className="text-3xl font-headline font-extrabold tracking-tight">₹{formatPrice(grandTotal)}</p>
                  </div>
                  <span className="bg-secondary px-3 py-1 rounded text-[10px] font-black uppercase mb-1">Secure SSL</span>
                </div>
              </div>
              
              <button 
                onClick={handleSubmitOrder}
                disabled={cart.length === 0}
                className="w-full mt-10 py-4 bg-gradient-to-r from-secondary to-secondary-container text-white font-headline font-bold text-lg rounded-full transition-transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-secondary/20 flex justify-center items-center gap-2 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none"
              >
                Proceed to Payment
              </button>
              
              <p className="text-center text-[10px] text-on-primary-container mt-6 opacity-60">
                By clicking complete, you agree to Bazario's Terms of Purchase and Shipping Policies.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
