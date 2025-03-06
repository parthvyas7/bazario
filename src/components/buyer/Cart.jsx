import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { useOrderStore } from '../../stores/orderStore';

const Cart = () => {
  const { items, fetchCart, removeItem, clearCart, calculateTotal, isLoading } = useCartStore();
  const { user } = useAuthStore();
  const { createOrder, isLoading: orderLoading } = useOrderStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      fetchCart(user.id);
    }
  }, [fetchCart, user]);
  
  const handleRemoveItem = (itemId) => {
    if (user) {
      removeItem(user.id, itemId);
    }
  };
  
  const handleCheckout = async () => {
    if (!user || items.length === 0) return;
    
    try {
      // Group items by seller
      const itemsBySellerMap = items.reduce((acc, item) => {
        const sellerId = item.products.seller_id;
        if (!acc[sellerId]) {
          acc[sellerId] = [];
        }
        acc[sellerId].push(item);
        return acc;
      }, {});
      
      // Create an order for each seller
      const orderPromises = Object.entries(itemsBySellerMap).map(([sellerId, sellerItems]) => {
        const totalAmount = sellerItems.reduce((sum, item) => sum + (item.products.price * item.quantity), 0);
        
        const orderItems = sellerItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_time: item.products.price
        }));
        
        return createOrder({
          buyer_id: user.id,
          seller_id: sellerId,
          total_amount: totalAmount,
          status: 'Pending',
          order_items: orderItems
        });
      });
      
      await Promise.all(orderPromises);
      clearCart();
      navigate('/orders', { state: { orderSuccess: true } });
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg mb-4">
          Please <Link to="/login" className="text-blue-500 underline">login</Link> to view your cart
        </p>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Loading cart...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Your Shopping Cart</h2>
      
      {items.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link to="/" className="text-blue-500 hover:underline">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {item.products.images && item.products.images.length > 0 ? (
                            <img 
                              className="h-10 w-10 object-cover rounded" 
                              src={item.products.images[0]} 
                              alt={item.products.name} 
                            />
                          ) : (
                            <div className="h-10 w-10 bg-gray-200 rounded" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.products.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.products.seller.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${item.products.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${item.products.price * item.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleRemoveItem(item.id)} 
                        className="text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-900">
                Total: <span className="font-medium">${calculateTotal()}</span>
              </p>
            </div>
            <div>
              <button 
                onClick={handleCheckout} 
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${orderLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {orderLoading ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;