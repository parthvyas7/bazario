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
      .select("*, users(username)")
      .eq("id", sellerId)
      .single();

    if (!error && data) {
      setSeller(data);
    }
  };

  if (!seller) return null;

  return (
    <div className="bg-gray-50 border p-4 rounded-lg mt-6">
      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Sold By
      </h4>
      <div className="flex items-center justify-between">
        <div>
          <Link
            to={`/seller/${seller.id}`}
            className="text-lg font-bold hover:text-blue-600 flex items-center gap-2"
          >
            <span>{seller.store_name}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          <p className="text-gray-600 text-sm mt-1">
            {seller.store_description}
          </p>
        </div>
        <Link
          to={`/seller/${seller.id}`}
          className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors text-sm font-medium"
        >
          View Store
        </Link>
      </div>
    </div>
  );
};

import PropTypes from "prop-types";

SellerInfo.propTypes = {
  sellerId: PropTypes.string,
};
