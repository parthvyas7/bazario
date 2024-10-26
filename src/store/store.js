import { create } from 'zustand'

const useCentralStore = create((set) => ({
  products: [],
  setProducts: (newProducts) => {
    set({ products: newProducts });
  },
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