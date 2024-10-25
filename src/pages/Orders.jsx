import { useCentralStore } from "../store/store";

const Orders = () => {
  const { orders, removeOrder, clearOrders } = useCentralStore(
    (state) => state
  );
  
  return (
    <div>
      <h1>Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            {order.title}
            {order.deliveryStatus}
            {order.deliveredBy}
            <button
              onClick={() => removeOrder(order)}
              className="bg-slate-300 p-2 m-2 rounded shadow hover:bg-slate-50"
            >
              Cancel
            </button>
          </li>
        ))}
      </ul>
      <button onClick={() => clearOrders()}>Cancel all Orders</button>
    </div>
  );
};

export default Orders;
