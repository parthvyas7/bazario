import { useQuery } from "@tanstack/react-query";
import { useCentralStore } from "../store/store";

const useProducts = () => {
  const { setProducts } = useCentralStore((state) => state);

  const fetchProducts = async () => {
    const response = await fetch(
      "https://api.escuelajs.co/api/v1/products?offset=0&limit=10"
    );
    const products = await response.json();
    setProducts(products);
    return products;
  };

  const query = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  return query;
};

export default useProducts;
