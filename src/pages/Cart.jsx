import { useCentralStore } from "../store/store";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, increseQuantity, decreseQuantity, clearCart } =
    useCentralStore((state) => state);
  
  return (
    <>
      <h1>Cart</h1>
      <p>Shipping Cost: 10</p>
      <p>
        Total Cost:{" "}
        {cart.reduce((acc, item) => acc + item.price * item.quantity + 10, 0)}
      </p>
      <hr />
      {cart.map((item) => {
        return (
          <div key={item.id}>
            <p>{item.title}</p>
            <p>{item.price}</p>
            <p>{item.quantity}</p>
            <button
              onClick={() => increseQuantity(item)}
              className="bg-slate-300 p-2 m-2 rounded shadow hover:bg-slate-50"
            >
              +
            </button>
            <button
              onClick={() => decreseQuantity(item)}
              className="bg-slate-300 p-2 m-2 rounded shadow hover:bg-slate-50"
              disabled={item.quantity === 1}
            >
              -
            </button>
            <button
              onClick={() => removeFromCart(item)}
              className="bg-slate-300 p-2 m-2 rounded shadow hover:bg-slate-50"
            >
              Remove
            </button>
          </div>
        );
      })}
      <button
        onClick={clearCart}
        className="bg-slate-300 p-2 m-2 rounded shadow hover:bg-slate-50"
      >
        Clear Cart
      </button>
      <Link
        to="/checkout"
        className="bg-slate-300 p-2 m-2 rounded shadow hover:bg-slate-50"
      >
        Checkout
      </Link>
    </>
  );
};

export default Cart;
