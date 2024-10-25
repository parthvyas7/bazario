import { useParams } from "react-router-dom";
import { useCentralStore } from "../store/store";

const ViewProduct = () => {
  const { id } = useParams();
  const { products } = useCentralStore((state) => state);
  return <>ViewProduct</>;
};

export default ViewProduct;
