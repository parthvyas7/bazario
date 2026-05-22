import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import supabase from "../../utils/supabase";

export const RelatedProducts = ({ categoryId, currentProductId }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (categoryId) {
      fetchRelatedProducts();
    }
  }, [categoryId, currentProductId]);

  const fetchRelatedProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", categoryId) 
      .neq("id", currentProductId)
      .limit(4);

    if (!error && data) {
      setProducts(data);
    }
  };

  if (products.length === 0) return null;

  return (
    <section>
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-extrabold text-primary mb-2">Complements the Collection</h2>
          <p className="text-on-surface-variant">Hand-picked items that pair beautifully with your choice.</p>
        </div>
        <Link to="/" className="text-secondary font-bold flex items-center gap-1 group">
          View Collection <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="group block"
          >
            <div className="aspect-square rounded-xl overflow-hidden bg-surface-container-low mb-4 relative">
              <img
                src={product.image_url || "/placeholder-image.png"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <button 
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                onClick={(e) => e.preventDefault()} // In case user clicks the add bag
              >
                <span className="material-symbols-outlined text-primary text-xl" style={{fontVariationSettings: "'FILL' 0"}}>shopping_bag</span>
              </button>
            </div>
            <h3 className="font-bold text-primary group-hover:text-secondary transition-colors line-clamp-1">{product.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-secondary font-bold">₹</span>
              <span className="text-on-surface font-bold">{Number(product.price).toFixed(2)}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

import PropTypes from "prop-types";

RelatedProducts.propTypes = {
  categoryId: PropTypes.string,
  currentProductId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
