import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProductStore } from '../stores/productStore';
import { useCartStore } from '../stores/cartStore';
import { ProductReviews } from '../components/buyer/ProductReviews';
import { SellerInfo } from '../components/buyer/SellerInfo';
import { RelatedProducts } from '../components/buyer/RelatedProducts';

const ProductDetail = () => {
  const { productId } = useParams();
  const { getProductById, currentProduct, isLoading } = useProductStore();
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    getProductById(productId);
  }, [getProductById, productId]);

  const handleAddToCart = () => {
    addToCart(currentProduct, quantity);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {currentProduct && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex justify-center">
            <img 
              src={currentProduct.imageUrl} 
              alt={currentProduct.name} 
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">{currentProduct.name}</h1>
            <p className="text-xl text-blue-600 font-semibold mb-4">${currentProduct.price.toFixed(2)}</p>
            <div className="mb-6">
              <p className="text-gray-700">{currentProduct.description}</p>
            </div>
            <div className="flex items-center mb-6">
              <button
                className="bg-gray-200 px-3 py-1 rounded-l"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="bg-gray-100 px-4 py-1">{quantity}</span>
              <button
                className="bg-gray-200 px-3 py-1 rounded-r"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
              <button
                className="ml-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
            <SellerInfo sellerId={currentProduct.sellerId} />
          </div>
        </div>
      )}
      <div className="mt-12">
        <ProductReviews productId={productId} />
      </div>
      <div className="mt-12">
        <RelatedProducts 
          categoryId={currentProduct?.categoryId} 
          currentProductId={productId} 
        />
      </div>
    </div>
  );
};

export default ProductDetail;