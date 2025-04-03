import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <div className="mt-4 mb-8">
          <h2 className="text-3xl font-bold mb-2">Page Not Found</h2>
          <p className="text-gray-600">The page you're looking for doesn't exist or has been moved.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Home Page
          </Link>
          <Link 
            to="/products" 
            className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Browse Products
          </Link>
        </div>
        <div className="mt-8">
          <p className="text-gray-500">
            If you believe this is an error, please{' '}
            <Link to="/contact" className="text-blue-600 hover:underline">
              contact our support team
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;