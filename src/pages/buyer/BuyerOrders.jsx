import { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { orderService } from '../../utils/orderService';
import { OrderList } from '../../components/buyer/OrderList';
import { OrderDetails } from '../../components/buyer/OrderDetails';

const BuyerOrders = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const userOrders = await orderService.getBuyerOrders(user.id);
        setOrders(userOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    try {
      await orderService.cancelOrder(orderId);
      // Update orders list
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: 'Cancelled' } : order
      ));
      // Update selected order if it's the one being cancelled
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: 'Cancelled' });
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold mb-4">No orders yet</h2>
          <p className="text-gray-600 mb-6">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <a 
            href="/" 
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Browse Products
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <OrderList 
              orders={orders} 
              onSelectOrder={setSelectedOrder} 
              selectedOrderId={selectedOrder?.id} 
            />
          </div>
          <div className="md:col-span-2">
            {selectedOrder ? (
              <OrderDetails 
                order={selectedOrder} 
                onCancelOrder={handleCancelOrder} 
              />
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-md text-center h-full flex items-center justify-center">
                <p className="text-gray-500">Select an order to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerOrders;