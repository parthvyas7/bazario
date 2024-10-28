import { useQuery } from "@tanstack/react-query";
import { useCentralStore } from "../store/store";
import supabase from "../utils/supabase";

const useProducts = () => {
  const { setProducts } = useCentralStore((state) => state);

  const fetchProducts = async () => {
    const { data: products, error } = await supabase.from('Products').select('*');
    console.log(products)
    
    if (error) throw new Error(error.message);
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
