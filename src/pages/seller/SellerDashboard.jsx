import { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { orderService } from '../../utils/orderService';
import { productService } from '../../utils/productService';
import { DashboardStats } from '../../components/seller/DashboardStats';
import { RecentOrders } from '../../components/seller/RecentOrders';
import { ProductInventory } from '../../components/seller/ProductInventory';

const SellerDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Fetch orders
        const orders = await orderService.getSellerOrders(user.id);
        setRecentOrders(orders.slice(0, 5)); // Get most recent 5 orders
        
        // Calculate stats
        const pendingOrders = orders.filter(order => order.status === 'Pending').length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        
        // Fetch products
        const sellerProducts = await productService.getProductsBySeller(user.id);
        setProducts(sellerProducts);
        
        setStats({
          totalProducts: sellerProducts.length,
          totalOrders: orders.length,
          pendingOrders,
          totalRevenue
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Seller Dashboard</h1>
      
      <DashboardStats stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
          <RecentOrders orders={recentOrders} />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Product Inventory</h2>
          <ProductInventory products={products} />
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
