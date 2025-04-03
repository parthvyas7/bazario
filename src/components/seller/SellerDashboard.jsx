import { useState, useEffect } from 'react';
import supabase from '../../utils/supabase';

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image_url: ''
  });

  useEffect(() => {
    fetchSellerData();
  }, []);

  const fetchSellerData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Fetch seller's products
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', user.id);

    // Fetch seller's orders
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('seller_id', user.id);

    if (productsError) console.error('Products fetch error:', productsError);
    if (ordersError) console.error('Orders fetch error:', ordersError);

    setProducts(productsData || []);
    setOrders(ordersData || []);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('products')
      .insert({
        ...newProduct,
        seller_id: user.id,
        price: parseFloat(newProduct.price)
      });

    if (error) {
      console.error('Error adding product:', error);
    } else {
      // Reset form and refresh products
      setNewProduct({ name: '', description: '', price: '', image_url: '' });
      fetchSellerData();
    }
  };

  const handleDeleteProduct = async (productId) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Error deleting product:', error);
    } else {
      fetchSellerData();
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
    } else {
      fetchSellerData();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Seller Dashboard</h2>

      {/* Add Product Form */}
      <div className="mb-8 p-4 border rounded">
        <h3 className="text-xl font-semibold mb-4">Add New Product</h3>
        <form onSubmit={handleAddProduct} className="grid gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            required
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Product Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
            required
            step="0.01"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={newProduct.image_url}
            onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
            className="w-full p-2 border rounded"
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Add Product
          </button>
        </form>
      </div>

      {/* My Products */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">My Products</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product.id} className="border p-4 rounded">
              <img 
                src={product.image_url || '/placeholder-image.png'} 
                alt={product.name} 
                className="w-full h-48 object-cover mb-4"
              />
              <h4 className="font-bold">{product.name}</h4>
              <p>${product.price}</p>
              <button 
                onClick={() => handleDeleteProduct(product.id)}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete Product
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Orders */}
      <div>
        <h3 className="text-xl font-semibold mb-4">My Orders</h3>
        {orders.map(order => (
          <div key={order.id} className="border p-4 rounded mb-4">
            <h4 className="font-bold">Order #{order.id}</h4>
            <p>Total: ${order.total_amount}</p>
            <p>Status: {order.status}</p>
            <div className="mt-2 flex gap-2">
              <button 
                onClick={() => handleUpdateOrderStatus(order.id, 'Shipped')}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Mark as Shipped
              </button>
              <button 
                onClick={() => handleUpdateOrderStatus(order.id, 'Delivered')}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Mark as Delivered
              </button>
            </div>
            <div className="mt-4">
              <h5 className="font-semibold">Order Items:</h5>
              {order.order_items.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.products.name}</span>
                  <span>Quantity: {item.quantity}</span>
                  <span>${item.price}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerDashboard;