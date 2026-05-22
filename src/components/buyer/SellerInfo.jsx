import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import supabase from "../../utils/supabase";

export const SellerInfo = ({ sellerId }) => {
  const [seller, setSeller] = useState(null);

  useEffect(() => {
    if (sellerId) {
      fetchSellerInfo();
    }
  }, [sellerId]);

  const fetchSellerInfo = async () => {
    const { data, error } = await supabase
      .from("sellers")
      .select("*")
      .eq("seller_id", sellerId)
      .single();

    if (!error && data) {
      setSeller(data);
    }
  };

  if (!seller) return null;

  return (
    <div className="p-6 rounded-2xl bg-surface-container-low relative overflow-hidden mt-6 shadow-sm border border-outline-variant/10">
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-14 h-14 rounded-full overflow-hidden bg-white shadow-sm flex-shrink-0 flex items-center justify-center font-headline font-bold text-xl text-primary border border-surface-variant">
          {seller.store_name?.charAt(0) || "S"}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-primary">{seller.store_name}</h3>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-sm" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
            <span className="text-sm font-medium text-on-surface-variant">Verified Merchant</span>
          </div>
        </div>
      </div>
      
      {seller.description && (
        <p className="mt-4 text-sm text-on-surface-variant relative z-10 line-clamp-2">
          {seller.description}
        </p>
      )}
      
      <div className="mt-6 flex justify-between items-center relative z-10">
        <Link
          to={`/seller/${seller.seller_id}`}
          className="text-primary font-bold text-sm underline underline-offset-4 decoration-secondary hover:text-secondary transition-colors"
        >
          View Store Collection
        </Link>
        <button className="px-4 py-2 rounded-lg bg-white border border-outline-variant/20 text-primary hover:bg-surface-lowest text-xs font-bold shadow-sm transition-colors">
          Contact
        </button>
      </div>
    </div>
  );
};

import PropTypes from "prop-types";

SellerInfo.propTypes = {
  sellerId: PropTypes.string,
};
