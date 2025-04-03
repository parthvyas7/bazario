import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-800 rounded-lg overflow-hidden mb-8">
      <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-8 md:mb-0 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Find Everything You Need in One Place
          </h1>
          <p className="mb-6 text-blue-100">
            Shop from a wide range of products from trusted sellers around the world.
            Enjoy secure payments and fast delivery.
          </p>
          <Link
            to="/products"
            className="inline-block bg-white text-blue-600 font-medium px-6 py-3 rounded-md hover:bg-blue-50 transition-colors"
          >
            Shop Now
          </Link>
        </div>
        <div className="md:w-1/2 flex justify-end">
          <img
            src="/assets/banner-image.png"
            alt="Shopping Banner"
            className="w-full max-w-md object-cover h-64 rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
