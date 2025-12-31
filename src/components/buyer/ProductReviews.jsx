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
      .select("*, users(username)")
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
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-2xl font-bold mb-6">Customer Reviews</h3>

      {/* Add Review Form */}
      {user && (
        <form
          onSubmit={handleSubmitReview}
          className="mb-8 p-4 bg-gray-50 rounded-lg"
        >
          <h4 className="text-lg font-semibold mb-4">Write a Review</h4>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Rating</label>
            <select
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: parseInt(e.target.value) })
              }
              className="p-2 border rounded"
            >
              {[5, 4, 3, 2, 1].map((num) => (
                <option key={num} value={num}>
                  {num} Stars
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Comment</label>
            <textarea
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              required
              rows="3"
              className="w-full p-2 border rounded"
              placeholder="What did you like or dislike?"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Review
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-0">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">
                  {review.users?.username || "Anonymous"}
                </span>
                <span className="text-yellow-500">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
              <span className="text-xs text-gray-400 block mt-2">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
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
