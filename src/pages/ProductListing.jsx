import { useCentralStore, useProducts } from "../store/store";
import { useNavigate } from "react-router-dom";

const ProductListing = () => {
  const { isPending, error, data: products, isFetching } = useProducts();

  const { addToCart, removeFromCart, cart } = useCentralStore((state) => state);

  const handleAddToCart = (product) => {
    cart.find((item) => item.id === product.id)
      ? removeFromCart(product)
      : addToCart(product);
  };

  const navigate = useNavigate();
  const handleBuyNow = (product) => {
    cart.find((item) => item.id === product.id) ? null : addToCart(product);
    navigate("/checkout");
  };

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <div>{isFetching && "Updating..."}</div>
      <div className="grid grid-cols-1 md:grid-cols-3">
        {products.map((product) => {
          return (
            <div key={product.id}>
              <p
                className="m-2 hover:underline cursor-pointer"
                onClick={() => navigate(`/viewproduct/${product.id}`)}
              >
                {product.title}
              </p>
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-slate-300 p-2 m-2 rounded shadow hover:bg-slate-50"
              >
                {cart.find((item) => item.id === product.id)
                  ? "Remove from Cart"
                  : "Add to Cart"}
              </button>
              <button
                onClick={() => handleBuyNow(product)}
                className="bg-slate-300 p-2 m-2 rounded shadow hover:bg-slate-50"
              >
                Buy Now
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ProductListing;
