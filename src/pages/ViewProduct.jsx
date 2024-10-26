import { useParams } from "react-router-dom";
import { useCentralStore } from "../store/store";

const ViewProduct = () => {
  const { id } = useParams();
  const { products } = useCentralStore((state) => state);
  console.log(products, "products")
  console.log(id)
  return <>ViewProduct</>;
};

export default ViewProduct;
