import { useState, useEffect } from 'react';
import supabase from '../../utils/supabase';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data);
    }
    setLoading(false);
  };

  const handleCancelOrder = async (orderId) => {
    // Only allow cancellation of pending orders
    const { error } = await supabase
      .from('orders')
      .update({ status: 'Cancelled' })
      .eq('id', orderId)
      .eq('status', 'Pending');

    if (error) {
      console.error('Error cancelling order:', error);
      alert('Cannot cancel this order. It may have already been processed.');
    } else {
      fetchOrders();
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        orders.map(order => (
          <div 
            key={order.id} 
            className="border rounded p-4 mb-4 shadow-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Order #{order.id}</h3>
              <span 
                className={`
                  px-3 py-1 rounded 
                  ${order.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' : 
                    order.status === 'Shipped' ? 'bg-blue-200 text-blue-800' : 
                    order.status === 'Delivered' ? 'bg-green-200 text-green-800' : 
                    'bg-red-200 text-red-800'
                  }
                `}
              >
                {order.status}
              </span>
            </div>
            <div className="mb-4">
              <h4 className="font-bold">Order Items:</h4>
              {order.order_items.map(item => (
                <div 
                  key={item.id} 
                  className="flex justify-between items-center border-b py-2"
                >
                  <div className="flex items-center">
                    <img 
                      src={item.products.image_url || '/placeholder-image.png'} 
                      alt={item.products.name} 
                      className="w-16 h-16 object-cover mr-4"
                    />
                    <div>
                      <p className="font-semibold">{item.products.name}</p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xl font-bold">Total: ${order.total_amount.toFixed(2)}</p>
              {order.status === 'Pending' && (
                <button 
                  onClick={() => handleCancelOrder(order.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersPage;