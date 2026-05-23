import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { orderService, authService, formatPrice } from '../utils/services';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCartStore();
  const { user, profile } = useAuthStore();
  
  // Extract orderData passed from checkout page
  const { orderData } = location.state || {};

  // Form states
  const [paymentMethod, setPaymentMethod] = useState(orderData?.paymentMethod || 'card');
  
  // Card states
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  
  // UPI states
  const [upiId, setUpiId] = useState('');
  const [isUpiVerified, setIsUpiVerified] = useState(false);
  const [isVerifyingUpi, setIsVerifyingUpi] = useState(false);

  // Status states
  const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle' | 'processing' | 'success_screen' | 'confirmed_dialog'
  const [processingStep, setProcessingStep] = useState(0);

  useEffect(() => {
    // Redirect if no order data is found (e.g. direct access)
    if (!orderData) {
      navigate('/cart', { replace: true });
    }
  }, [orderData, navigate]);

  if (!orderData) return null;

  // Handle card number formatting (adds space every 4 digits)
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value.match(/.{1,4}/g)?.join(' ') || '';
    if (formattedValue.length <= 19) {
      setCardNumber(formattedValue);
    }
  };

  // Handle expiry date formatting (MM/YY)
  const handleExpiryChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    let formatted = value;
    if (value.length > 2) {
      formatted = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    if (formatted.length <= 5) {
      setExpiry(formatted);
    }
  };

  // Handle CVV change
  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  // Verify UPI ID simulation
  const handleVerifyUpi = () => {
    if (!upiId || !upiId.includes('@')) {
      alert('Please enter a valid UPI ID (e.g., name@bank)');
      return;
    }
    setIsVerifyingUpi(true);
    setTimeout(() => {
      setIsVerifyingUpi(false);
      setIsUpiVerified(true);
    }, 1000);
  };

  // Submit payment and simulate gateway
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'card') {
      if (cardNumber.length < 19 || !cardName.trim() || expiry.length < 5 || cvv.length < 3) {
        alert('Please fill out all credit card fields correctly.');
        return;
      }
    } else {
      if (!isUpiVerified) {
        alert('Please enter and verify your UPI ID first.');
        return;
      }
    }

    setPaymentStatus('processing');
    setProcessingStep(0);

    // Step-by-step processing simulation
    const steps = [
      'Contacting secure payment gateway...',
      'Authorizing transaction amount...',
      'Confirming order with merchants...',
      'Finalizing your order...'
    ];

    const runSimulation = (stepIndex) => {
      if (stepIndex < steps.length) {
        setProcessingStep(stepIndex);
        setTimeout(() => {
          runSimulation(stepIndex + 1);
        }, 800);
      } else {
        completeOrder();
      }
    };

    runSimulation(0);
  };

  const completeOrder = async () => {
    try {
      const finalOrderData = {
        ...orderData,
        paymentMethod,
        status: 'Pending'
      };

      // 1. Create order in DB
      await orderService.createOrder(finalOrderData);

      // 2. Persist billing address on buyer profile
      if (user && profile && profile.user_type === 'buyer') {
        try {
          await authService.updateBuyerProfile(user.id, { address_details: orderData.shippingInfo });
        } catch (err) {
          console.error('Failed to save address details to profile:', err);
        }
      }

      // 3. Clear cart
      clearCart();

      // 4. Transition to success screen, then confirmation dialog
      setPaymentStatus('success_screen');
      setTimeout(() => {
        setPaymentStatus('confirmed_dialog');
      }, 1500);
    } catch (err) {
      console.error('Order placement failed:', err);
      alert(`Order placement failed: ${err.message || err}`);
      setPaymentStatus('idle');
    }
  };

  // Determine card brand logo based on first digit
  const getCardType = () => {
    if (cardNumber.startsWith('4')) return 'Visa';
    if (cardNumber.startsWith('5')) return 'Mastercard';
    if (cardNumber.startsWith('3')) return 'Amex';
    return 'Card';
  };

  return (
    <div className="pt-8 pb-20 px-6 max-w-screen-2xl mx-auto min-h-screen relative">
      {/* Simulation overlay */}
      {paymentStatus !== 'idle' && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-fade-in">
          
          {/* PROCESSING STATE */}
          {paymentStatus === 'processing' && (
            <div className="bg-surface-container-lowest border border-outline-variant/20 p-10 rounded-2xl max-w-md w-full text-center shadow-2xl relative overflow-hidden transform scale-95 animate-scale-up">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-secondary to-primary animate-pulse"></div>
              
              <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              
              <h3 className="font-headline font-extrabold text-xl text-primary mb-2">Processing Payment</h3>
              <p className="text-on-surface-variant font-medium text-sm animate-pulse">
                {[
                  'Contacting secure payment gateway...',
                  'Authorizing transaction amount...',
                  'Confirming order with merchants...',
                  'Finalizing your order...'
                ][processingStep]}
              </p>
              
              <div className="mt-8 text-xs text-outline flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-sm">lock</span>
                Secure 256-bit SSL encrypted connection
              </div>
            </div>
          )}

          {/* SUCCESS SCREEN STATE */}
          {paymentStatus === 'success_screen' && (
            <div className="bg-surface-container-lowest border border-outline-variant/20 p-10 rounded-2xl max-w-md w-full text-center shadow-2xl relative overflow-hidden transform scale-95 animate-scale-up">
              <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
              
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 animate-bounce">
                <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
              </div>
              
              <h3 className="font-headline font-extrabold text-2xl text-emerald-600 mb-2">Payment Successful!</h3>
              <p className="text-on-surface-variant font-medium text-sm">
                Your transaction has been processed securely.
              </p>
            </div>
          )}

          {/* CONFIRMED DIALOG STATE */}
          {paymentStatus === 'confirmed_dialog' && (
            <div className="bg-surface-container-lowest p-12 rounded-2xl shadow-2xl max-w-md w-full text-center border border-outline-variant/10 relative overflow-hidden transform scale-95 animate-scale-up">
              {/* Decorative backdrop */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary-container/20 to-transparent"></div>
              
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 text-primary">
                <span className="material-symbols-outlined text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
              </div>
              
              <h1 className="text-3xl font-extrabold font-headline text-primary mb-4 relative z-10">Order Confirmed!</h1>
              <p className="text-on-surface-variant font-medium mb-10 leading-relaxed relative z-10">
                Thank you for your purchase. We've received your order and are
                processing it now. You will receive an email confirmation shortly.
              </p>
              
              <div className="flex flex-col space-y-4 relative z-10">
                <Link
                  to="/orders"
                  className="bg-primary text-white font-bold px-8 py-3.5 rounded-full hover:bg-primary/90 transition-colors shadow-md text-center"
                >
                  Review Purchases
                </Link>
                <Link
                  to="/"
                  className="bg-surface-container-high text-primary font-bold px-8 py-3.5 rounded-full hover:bg-surface-container-highest transition-colors text-center"
                >
                  Discover More
                </Link>
              </div>
            </div>
          )}

        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Order Summary & Review */}
        <div className="lg:col-span-5 space-y-8">
          <header>
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors mb-4"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Back to Shipping
            </button>
            <h1 className="text-3xl font-extrabold font-headline tracking-tighter text-primary">Secure Checkout</h1>
            <p className="text-on-surface-variant font-medium mt-1">Review your summary and submit payment.</p>
          </header>

          {/* Checkout Item List */}
          <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-6 space-y-4">
            <h3 className="font-headline font-bold text-lg text-primary border-b border-outline-variant/10 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">shopping_basket</span>
              Order Details
            </h3>
            
            <div className="max-h-[220px] overflow-y-auto pr-1 space-y-3">
              {orderData.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={item.image_url || "/placeholder-image.png"} 
                      alt={item.name} 
                      className="w-10 h-10 object-cover rounded-lg bg-surface-container-high flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-on-surface truncate">{item.name}</p>
                      <p className="text-xs text-on-surface-variant">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-on-surface ml-3">₹{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-outline-variant/10 pt-4 space-y-2">
              <div className="flex justify-between text-xs text-on-surface-variant">
                <span>Shipping Destination</span>
                <span className="font-semibold truncate max-w-[200px]">{orderData.shippingInfo.fullName}</span>
              </div>
              <div className="flex justify-between text-xs text-on-surface-variant">
                <span>Delivery Address</span>
                <span className="font-semibold truncate max-w-[200px]">{orderData.shippingInfo.address}, {orderData.shippingInfo.city}</span>
              </div>
            </div>

            <div className="border-t border-outline-variant/10 pt-4 text-primary bg-primary/5 -mx-6 -mb-6 p-6 rounded-b-2xl">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Total Amount Due</p>
                  <p className="text-3xl font-headline font-extrabold tracking-tight">₹{formatPrice(orderData.totalAmount)}</p>
                </div>
                <span className="bg-secondary text-white px-3 py-1 rounded text-[10px] font-black uppercase mb-1">Secure SSL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Payment Form */}
        <div className="lg:col-span-7">
          <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-8 shadow-sm space-y-8">
            
            {/* Method Tabs */}
            <div className="flex border-b border-outline-variant/10 pb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 font-headline font-bold text-sm border-b-2 transition-all ${
                  paymentMethod === 'card' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined">credit_card</span>
                Credit/Debit Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 font-headline font-bold text-sm border-b-2 transition-all ${
                  paymentMethod === 'upi' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined">qr_code_2</span>
                UPI Payment
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              
              {/* CARD MODE */}
              {paymentMethod === 'card' && (
                <div className="space-y-6">
                  {/* Interactive Card Graphic Container */}
                  <div className="perspective-1000 w-full max-w-[380px] mx-auto h-[220px]">
                    <div className={`relative w-full h-full duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                      
                      {/* CARD FRONT */}
                      <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-primary to-primary-container p-6 text-white shadow-xl flex flex-col justify-between backface-hidden overflow-hidden border border-white/10">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
                        
                        <div className="flex justify-between items-start relative z-10">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-white/60">Payment Card</p>
                            <h4 className="font-headline font-bold text-lg tracking-tight">Bazario Premium</h4>
                          </div>
                          <span className="font-black text-xl italic tracking-tighter">{getCardType()}</span>
                        </div>

                        {/* Chip Image Mock */}
                        <div className="w-10 h-8 bg-amber-400/20 rounded-md border border-amber-400/30 flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-transparent"></div>
                          <div className="w-6 h-5 border border-amber-400/40 rounded"></div>
                        </div>

                        <div className="space-y-4">
                          {/* Card Number */}
                          <div className="text-xl font-mono tracking-[0.15em] font-semibold text-white/90">
                            {cardNumber || '•••• •••• •••• ••••'}
                          </div>

                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-[8px] uppercase tracking-widest text-white/50">Cardholder</p>
                              <p className="text-sm font-semibold truncate max-w-[180px] uppercase">
                                {cardName || 'YOUR NAME'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-[8px] uppercase tracking-widest text-white/50">Expires</p>
                              <p className="text-sm font-semibold font-mono">
                                {expiry || 'MM/YY'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CARD BACK */}
                      <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 text-white shadow-xl flex flex-col justify-between backface-hidden rotate-y-180 border border-white/10">
                        <div className="w-full h-10 bg-neutral-950 mt-6"></div>
                        
                        <div className="px-6 py-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] uppercase tracking-widest text-white/40">Authorized Signature</span>
                            <span className="text-[8px] uppercase tracking-widest text-white/40">Security Code</span>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex-grow h-8 bg-neutral-100 rounded-md border border-neutral-300 flex items-center justify-end px-3">
                              <span className="text-xs text-neutral-400 font-serif italic line-through select-none pr-2">Bazario Shop</span>
                            </div>
                            <div className="w-16 h-8 bg-amber-400 text-neutral-950 font-bold font-mono text-center leading-8 rounded-md shadow-sm">
                              {cvv || '•••'}
                            </div>
                          </div>
                        </div>

                        <div className="px-6 pb-6 text-[8px] text-white/30 text-center leading-tight">
                          This card is simulated for secure checkout on Bazario. Do not enter actual credentials unless preferred for demo purposes.
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Card Form Fields */}
                  <div className="space-y-4 pt-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Cardholder Name</label>
                      <input 
                        type="text" 
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                        onFocus={() => setIsFlipped(false)}
                        placeholder="Arjun Mehta" 
                        className="bg-surface-container-highest border-none rounded-xl p-4 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all font-medium text-on-surface outline-none text-sm"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Card Number</label>
                      <div className="relative flex items-center">
                        <input 
                          type="text" 
                          required
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          onFocus={() => setIsFlipped(false)}
                          placeholder="4000 1234 5678 9010" 
                          className="bg-surface-container-highest border-none rounded-xl p-4 pl-12 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all font-mono font-medium text-on-surface outline-none text-sm w-full"
                        />
                        <span className="material-symbols-outlined absolute left-4 text-on-surface-variant">credit_card</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Expiry Date</label>
                        <input 
                          type="text" 
                          required
                          value={expiry}
                          onChange={handleExpiryChange}
                          onFocus={() => setIsFlipped(false)}
                          placeholder="MM/YY" 
                          className="bg-surface-container-highest border-none rounded-xl p-4 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all font-mono font-medium text-on-surface outline-none text-sm text-center"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Security Code (CVV)</label>
                        <input 
                          type="password" 
                          required
                          value={cvv}
                          onChange={handleCvvChange}
                          onFocus={() => setIsFlipped(true)}
                          onBlur={() => setIsFlipped(false)}
                          placeholder="•••" 
                          className="bg-surface-container-highest border-none rounded-xl p-4 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all font-mono font-medium text-on-surface outline-none text-sm text-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* UPI MODE */}
              {paymentMethod === 'upi' && (
                <div className="space-y-6">
                  {/* QR Code Container */}
                  <div className="border border-outline-variant/10 rounded-2xl bg-surface-container-low p-6 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full blur-xl pointer-events-none"></div>
                    
                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Scan QR to Pay</p>
                    
                    <div className="relative p-4 bg-white rounded-xl shadow-md border border-neutral-200">
                      {/* Scanning laser mockup */}
                      <div className="absolute top-4 left-4 right-4 h-0.5 bg-secondary opacity-60 animate-bounce"></div>
                      
                      <svg className="w-40 h-40" viewBox="0 0 100 100" fill="currentColor">
                        {/* Top-Left Corner */}
                        <path d="M5 5h20v5H10v15H5z M10 10h10v10H10z"/>
                        {/* Top-Right Corner */}
                        <path d="M75 5h20v20h-5V10H75z M80 10h10v10H80z"/>
                        {/* Bottom-Left Corner */}
                        <path d="M5 75h5v15h15v5H5z M10 80h10v10H10z"/>
                        {/* QR Pixels Map */}
                        <rect x="35" y="10" width="10" height="5" />
                        <rect x="55" y="5" width="5" height="15" />
                        <rect x="30" y="25" width="15" height="10" />
                        <rect x="55" y="25" width="20" height="5" />
                        <rect x="15" y="35" width="5" height="15" />
                        <rect x="35" y="45" width="15" height="5" />
                        <rect x="65" y="40" width="10" height="10" />
                        <rect x="40" y="55" width="20" height="10" />
                        <rect x="10" y="60" width="15" height="5" />
                        <rect x="65" y="65" width="15" height="15" />
                        <rect x="30" y="75" width="10" height="5" />
                        <rect x="45" y="80" width="10" height="10" />
                      </svg>
                    </div>

                    <p className="text-[11px] text-on-surface-variant font-medium mt-4">
                      Open GPay, PhonePe, Paytm, or BHIM and scan this code
                    </p>
                  </div>

                  {/* UPI ID Form */}
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest ml-1">Enter UPI ID</label>
                      <div className="flex gap-3">
                        <div className="relative flex-grow flex items-center">
                          <input 
                            type="text" 
                            value={upiId}
                            onChange={(e) => {
                              setUpiId(e.target.value);
                              setIsUpiVerified(false);
                            }}
                            placeholder="name@okaxis" 
                            className="bg-surface-container-highest border-none rounded-xl p-4 pl-12 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all font-medium text-on-surface outline-none text-sm w-full"
                          />
                          <span className="material-symbols-outlined absolute left-4 text-on-surface-variant">account_balance_wallet</span>
                          
                          {isUpiVerified && (
                            <span className="material-symbols-outlined absolute right-4 text-emerald-500 font-bold" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                          )}
                        </div>

                        <button
                          type="button"
                          disabled={isVerifyingUpi || !upiId}
                          onClick={handleVerifyUpi}
                          className="px-6 rounded-xl bg-primary text-white text-sm font-bold font-headline transition-colors hover:bg-primary/90 flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {isVerifyingUpi ? 'Verifying...' : isUpiVerified ? 'Verified' : 'Verify'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Complete Payment Button */}
              <button
                type="submit"
                className="w-full mt-8 py-4 bg-gradient-to-r from-secondary to-secondary-container text-white font-headline font-bold text-lg rounded-full shadow-lg shadow-secondary/20 hover:shadow-secondary/40 hover:scale-[1.01] active:scale-95 transition-all flex justify-center items-center gap-2"
              >
                <span className="material-symbols-outlined">shield</span>
                Submit Payment (₹{formatPrice(orderData.totalAmount)})
              </button>

              <div className="text-center text-[10px] text-on-surface-variant mt-4 opacity-75">
                Your payment data is fully encrypted. No real credentials are store or charged.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
