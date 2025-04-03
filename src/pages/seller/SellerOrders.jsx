import { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { orderService } from '../../utils/orderService';
import { OrderList } from '../../components/seller/OrderList';
import { OrderDetails } from '../../components/seller/OrderDetails';

const SellerOrders = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const sellerOrders = await orderService.getSellerOrders(user.id);
        setOrders(sellerOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      // Update orders list
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      // Update selected order if it's the one being updated
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Orders Management</h1>
      
      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded ${filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilterStatus('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded ${filterStatus === 'Pending' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilterStatus('Pending')}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 rounded ${filterStatus === 'Shipped' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilterStatus('Shipped')}
          >
            Shipped
          </button>
          <button
            className={`px-4 py-2 rounded ${filterStatus === 'Delivered' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilterStatus('Delivered')}
          >
            Delivered
          </button>
        </div>
      </div>
    
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-4">Orders List</h2>
          <OrderList
            orders={filteredOrders}
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
          />
        </div>
        <div className="col-span-2">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <OrderDetails
            order={selectedOrder}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        </div>
      </div>
    </div>
  );
}

export default SellerOrders;