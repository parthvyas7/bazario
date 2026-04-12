import { Link } from 'react-router-dom';

const OrderConfirmation = () => {
  return (
    <div className="pt-24 pb-20 px-6 max-w-screen-2xl mx-auto flex items-center justify-center min-h-[70vh]">
      <div className="bg-surface-container-lowest p-12 rounded-2xl shadow-xl max-w-md w-full text-center border border-outline-variant/10 relative overflow-hidden">
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
            className="bg-primary text-white font-bold px-8 py-3.5 rounded-full hover:bg-primary/90 transition-colors shadow-md"
          >
            Review Purchases
          </Link>
          <Link
            to="/"
            className="bg-surface-container-high text-primary font-bold px-8 py-3.5 rounded-full hover:bg-surface-container-highest transition-colors"
          >
            Discover More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;