import { useParams } from "react-router-dom";
import { useCentralStore } from "../store/store";
import { useEffect, useState } from "react";

const ViewProduct = () => {
  const { id } = useParams();
  const { products } = useCentralStore((state) => state);
  const [product, setProduct] = useState(null);
  useEffect(() => {
    const foundProduct = products.find((product) => product.id == id);
    setProduct(foundProduct);
  }, [id, products]);

  if (!product) return <div>Product not found</div>;
  console.log(product)
  return (
    <>
      <h1>{product.title}</h1>
      <p>{product.price}</p>
      <p>{product.description}</p>
      <p className="hover:underline cursor-pointer">{product.seller}</p>
      <button
        onClick={() => window.open(product.images[0], "_blank")}
        className="bg-slate-300 p-2 m-2 rounded shadow hover:bg-slate-50"
      >
        View Product Image
      </button>
    </>
  );
};

export default ViewProduct;
