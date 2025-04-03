import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { orderService } from '../utils/orderService';
import { CheckoutSummary } from '../components/buyer/CheckoutSummary';
import { ShippingForm } from '../components/buyer/ShippingForm';
import { PaymentForm } from '../components/buyer/PaymentForm';

const Checkout = () => {
  const { cart, totalAmount, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: ''
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=checkout');
    }
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [user, cart, navigate]);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    try {
      const orderData = {
        userId: user.id,
        items: cart,
        totalAmount,
        shippingInfo,
        status: 'Pending'
      };
      
      await orderService.createOrder(orderData);
      clearCart();
      navigate('/order-confirmation');
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex mb-6">
              <div className={`flex-1 pb-2 ${step === 1 ? 'border-b-2 border-blue-500 text-blue-500' : 'border-b'}`}>
                Shipping
              </div>
              <div className={`flex-1 pb-2 ${step === 2 ? 'border-b-2 border-blue-500 text-blue-500' : 'border-b'}`}>
                Payment
              </div>
              <div className={`flex-1 pb-2 ${step === 3 ? 'border-b-2 border-blue-500 text-blue-500' : 'border-b'}`}>
                Review
              </div>
            </div>
            
            {step === 1 && (
              <ShippingForm 
                shippingInfo={shippingInfo} 
                setShippingInfo={setShippingInfo} 
                onNext={handleNextStep} 
              />
            )}
            
            {step === 2 && (
              <PaymentForm 
                paymentInfo={paymentInfo} 
                setPaymentInfo={setPaymentInfo} 
                onNext={handleNextStep} 
                onPrevious={handlePreviousStep} 
              />
            )}
            
            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Order Review</h2>
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Shipping Information</h3>
                  <div className="bg-gray-50 p-3 rounded">
                    <p>{shippingInfo.fullName}</p>
                    <p>{shippingInfo.address}</p>
                    <p>{shippingInfo.city}, {shippingInfo.postalCode}</p>
                    <p>{shippingInfo.country}</p>
                    <p>{shippingInfo.phone}</p>
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Payment Method</h3>
                  <div className="bg-gray-50 p-3 rounded">
                    <p>Card ending in {paymentInfo.cardNumber.slice(-4)}</p>
                    <p>{paymentInfo.cardHolder}</p>
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <button 
                    className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
                    onClick={handlePreviousStep}
                  >
                    Back
                  </button>
                  <button 
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                    onClick={handleSubmitOrder}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="md:w-1/3">
          <CheckoutSummary cart={cart} totalAmount={totalAmount} />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
