import { Link } from 'react-router-dom';

const OrderConfirmation = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. We've received your order and are processing it now.
          You will receive an email confirmation shortly.
        </p>
        <div className="flex flex-col space-y-3">
          <Link 
            to="/buyer/orders" 
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            View My Orders
          </Link>
          <Link 
            to="/" 
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;