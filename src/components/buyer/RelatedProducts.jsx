import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import supabase from "../../utils/supabase";

export const RelatedProducts = ({ categoryId, currentProductId }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Only fetch if we have a categoryId
    if (categoryId) {
      fetchRelatedProducts();
    }
  }, [categoryId, currentProductId]);

  const fetchRelatedProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", categoryId) // Assuming 'category' is the column name. If it's category_id, adjust.
      .neq("id", currentProductId) // Exclude current product
      .limit(4);

    if (!error && data) {
      setProducts(data);
    }
  };

  if (products.length === 0) return null;

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">Related Products</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:-translate-y-1">
              <img
                src={product.image_url || "/placeholder-image.png"}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="font-semibold text-lg mb-2 group-hover:text-blue-600 truncate">
                  {product.name}
                </h4>
                <p className="text-gray-600 font-bold">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

import PropTypes from "prop-types";

RelatedProducts.propTypes = {
  categoryId: PropTypes.string,
  currentProductId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
