import { useCartStore } from '../../stores/cartStore';
import supabase from '../../utils/supabase';
import { useNavigate } from 'react-router-dom';

const ShoppingCart = () => {
  const { cart, removeFromCart, clearCart } = useCartStore();
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleCheckout = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('Please log in to complete your purchase');
        return;
      }

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: parseFloat(calculateTotal()),
          status: 'Pending'
        })
        .select();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.map(item => ({
        order_id: orderData[0].id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart and navigate to orders
      clearCart();
      navigate('/orders');
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error processing your order. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Your Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cart.map(item => (
            <div 
              key={item.id} 
              className="flex justify-between items-center border-b py-4"
            >
              <div className="flex items-center">
                <img 
                  src={item.image_url || '/placeholder-image.png'} 
                  alt={item.name} 
                  className="w-16 h-16 object-cover mr-4"
                />
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p>${item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="mt-4 flex justify-between items-center">
            <h3 className="text-xl font-bold">Total: ${calculateTotal()}</h3>
            <button 
              onClick={handleCheckout}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShoppingCart;