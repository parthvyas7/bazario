import { create } from 'zustand'
import { useQuery } from "@tanstack/react-query";

const fetchProducts = async () => {
  const response = await fetch(
    "https://api.escuelajs.co/api/v1/products?offset=0&limit=10"
  );
  return response.json();
};

export const useProducts = () => {
  const setProducts = useCentralStore((state) => state.setProducts);
  
  const query = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    onSuccess: (data) => {
      setProducts(data);
    },
  });

  return query;
};

const useCentralStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
  removeProduct: (product) => set((state) => ({ products: state.products.filter((productItem) => productItem.id !== product.id) })),
  clearProducts: () => set(() => ({ products: [] })),

  cart: [],
  addToCart: (item) => set((state) => ({ cart: [...state.cart, { ...item, quantity: 1 }] })),
  removeFromCart: (item) => set((state) => ({ cart: state.cart.filter((cartItem) => cartItem.id !== item.id) })),
  increseQuantity: (item) => set((state) => ({ cart: state.cart.map((cartItem) => cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem) })),
  decreseQuantity: (item) => set((state) => ({ cart: state.cart.map((cartItem) => cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem) })),
  clearCart: () => set(() => ({ cart: [] })),

  orders: [],
  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
  changeDeliveryStatus: (order) => set((state) => ({ orders: state.orders.map((orderItem) => orderItem.id === order.id ? { ...orderItem, deliveryStatus: order.deliveryStatus } : orderItem) })),
  changeDeliveredBy: (order) => set((state) => ({ orders: state.orders.map((orderItem) => orderItem.id === order.id ? { ...orderItem, deliveredBy: order.deliveredBy } : orderItem) })),
  removeOrder: (order) => set((state) => ({ orders: state.orders.filter((orderItem) => orderItem.id !== order.id) })),
  clearOrders: () => set(() => ({ orders: [] })),
}))

export { useCentralStore }