import { useQuery } from "@tanstack/react-query";
import { useCentralStore } from "../store/store";

const useProducts = () => {
  const { setProducts } = useCentralStore((state) => state);

  const fetchProducts = async () => {
    const response = await fetch(
      "https://api.escuelajs.co/api/v1/products?offset=0&limit=10"
    );
    const products = await response.json();
    const modifiedProducts = products.map((product) => ({
      ...product,
      seller: "Sanjay",
      rating: Math.floor(Math.random() * 5) + 1,
      reviews: [
        {
          id: 1,
          author: "Sanjay",
          body: "This is a great product",
          rating: 5,
          createdAt: "2022-08-01T00:00:00.000Z",
          image: "https://i.ibb.co/4j5m0kH/sanjay-profile-pic.jpg",
        },
        {
          id: 2,
          author: "Parth",
          body: "This is a great product",
          rating: 5,
          createdAt: "2022-08-01T00:00:00.000Z",
          image: "https://i.ibb.co/4j5m0kH/parth-profile-pic.jpg",
        },
      ],
      relatedProducts: [
        {
          id: 1,
          name: "Product 1",
          image: "https://i.ibb.co/4j5m0kH/sanjay-profile-pic.jpg",
        },
        {
          id: 2,
          name: "Product 2",
          image: "https://i.ibb.co/4j5m0kH/parth-profile-pic.jpg",
        },
        {
          id: 3,
          name: "Product 3",
          image: "https://i.ibb.co/4j5m0kH/sanjay-profile-pic.jpg",
        },
      ],
      discount: Math.floor(Math.random() * 100) + 1,
      category: "Electronics",
      subcategory: "Computers",
      questionsAndAnswers: [
        {
          id: 1,
          question: "How to use this product?",
          answer: "This is a great product",
        },
        {
          id: 2,
          question: "How to use this product?",
          answer: "This is a great product",
        },
        {
          id: 3,
          question: "How to use this product?",
          answer: "This is a great product",
        },

      ],
    }));
    setProducts(modifiedProducts);
    return modifiedProducts;
  };

  const query = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  return query;
};

export default useProducts;
