import { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { productService } from '../../utils/productService';
import { ProductInventory } from '../../components/seller/ProductInventory';
import { AddProductForm } from '../../components/seller/AddProductForm';

const SellerProducts = () => {
  const { user } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddProductForm, setShowAddProductForm] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const sellerProducts = await productService.getProductsBySeller(user.id);
        setProducts(sellerProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  const handleAddProduct = async (productData) => {
    try {
      const newProduct = await productService.addProduct({
        ...productData,
        sellerId: user.id
      });
      setProducts([...products, newProduct]);
      setShowAddProductForm(false);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = async (productId, productData) => {
    try {
      const updatedProduct = await productService.updateProduct(productId, productData);
      setProducts(products.map(product => 
        product.id === productId ? updatedProduct : product
      ));
    } catch (error) {
      console.error('Error editing product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await productService.deleteProduct(productId);
      setProducts(products.filter(product => product.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Products</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowAddProductForm(true)}
        >
          Add New Product
        </button>
      </div>
      
      {showAddProductForm && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
          <AddProductForm 
            onSubmit={handleAddProduct} 
            onCancel={() => setShowAddProductForm(false)} 
          />
        </div>
      )}
      
      {products.length === 0 && !showAddProductForm ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold mb-4">No products yet</h2>
          <p className="text-gray-600 mb-6">
            You haven't added any products to your store yet.
          </p>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            onClick={() => setShowAddProductForm(true)}
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <ProductInventory 
          products={products} 
          onEdit={handleEditProduct} 
          onDelete={handleDeleteProduct} 
          showActions={true}
        />
      )}
    </div>
  );
};

export default SellerProducts;
