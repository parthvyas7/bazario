import { useState, useEffect } from "react";
import supabase from "../../utils/supabase";
import { useAuthStore } from "../../stores/authStore";

export const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*, buyers(full_name)")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReviews(data);
    }
    setLoading(false);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to leave a review");
      return;
    }

    const { error } = await supabase.from("reviews").insert({
      product_id: productId,
      user_id: user.id,
      rating: newReview.rating,
      comment: newReview.comment,
    });

    if (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review");
    } else {
      setNewReview({ rating: 5, comment: "" });
      fetchReviews();
    }
  };

  return (
    <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10">
      <h3 className="text-2xl font-bold text-primary mb-8">Customer Reviews</h3>

      {/* Add Review Form */}
      {user && (
        <form
          onSubmit={handleSubmitReview}
          className="mb-10 p-6 bg-surface-container-low rounded-xl border border-surface-container-high"
        >
          <h4 className="text-lg font-bold text-primary mb-6">Write a Review</h4>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-3">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Rating</label>
              <select
                value={newReview.rating}
                onChange={(e) =>
                  setNewReview({ ...newReview, rating: parseInt(e.target.value) })
                }
                className="w-full px-4 py-3 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-on-surface font-medium outline-none cursor-pointer"
              >
                {[5, 4, 3, 2, 1].map((num) => (
                  <option key={num} value={num}>
                    {num} Stars
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-9">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Your Experience</label>
              <textarea
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                required
                rows="3"
                className="w-full px-5 py-4 rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-on-surface font-medium placeholder:text-outline-variant outline-none resize-none"
                placeholder="What did you like or dislike about this product?"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-primary text-white font-bold px-8 py-3 rounded-full hover:bg-primary/90 transition-colors shadow-md"
            >
              Submit Review
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <p className="text-on-surface-variant font-medium animate-pulse">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-surface-container-low rounded-xl">
            <span className="material-symbols-outlined text-outline-variant text-4xl mb-2">rate_review</span>
            <p className="text-on-surface-variant font-medium">
              No reviews yet. Be the first to review this product!
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-surface-container-highest pb-6 last:border-0 last:pb-0 pt-2">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {(review.buyers?.full_name?.[0] || "A").toUpperCase()}
                  </div>
                  <div>
                    <span className="font-bold text-on-surface block leading-none mb-1">
                      {review.buyers?.full_name || "Anonymous"}
                    </span>
                    <span className="text-xs text-on-surface-variant font-medium">
                      {new Date(review.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div className="flex text-secondary text-sm">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined" style={{fontVariationSettings: `'FILL' ${i < review.rating ? 1 : 0}`}}>
                      star
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-on-surface-variant leading-relaxed pl-13 ml-13">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

import PropTypes from "prop-types";

ProductReviews.propTypes = {
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};
