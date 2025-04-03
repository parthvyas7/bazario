import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';

const ProductCard = ({ product }) => {
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();
  const isBuyer = user && user.role === 'buyer';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative pb-[70%] overflow-hidden bg-gray-100">
          <img
            src={product.imageUrl || '/assets/placeholder-product.png'}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-800 mb-1 truncate">{product.name}</h3>
          <div className="flex justify-between items-center mb-2">
            <p className="text-blue-600 font-semibold">${product.price.toFixed(2)}</p>
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="text-sm text-gray-500">
                {product.rating ? product.rating.toFixed(1) : '4.5'}
              </span>
            </div>
          </div>
          <p className="text-gray-500 text-sm truncate mb-3">{product.description}</p>
          
          {isBuyer && (
            <button
              onClick={handleAddToCart}
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              Add to Cart
            </button>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;