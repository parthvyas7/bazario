
import { useCentralStore } from "../store/store";

const Checkout = () => {
  const { orders, cart, addOrder } = useCentralStore((state) => state);
  const handlePlaceOrder = () => {
    cart.map((item) => {
      const newOrder = {
        orderId: Math.random().toString(36).substring(7),
        deliveredBy: "3 days from now",
        deliveryStatus: "Pending",
        ...item,
      };
      if (
        orders.findIndex((order) => order.orderId !== newOrder.orderId) === -1
      ) {
        addOrder(newOrder);
      }
    });
  };
  return (
    <>
      <div>
        <h1>Checkout</h1>
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              {item.title} - {item.price}
            </li>
          ))}
        </ul>
        <button onClick={handlePlaceOrder}>Place Order</button>
      </div>
    </>
  );
};

export default Checkout;
