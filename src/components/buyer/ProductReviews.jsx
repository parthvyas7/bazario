import { useState, useRef } from "react";
import supabase from "../../utils/supabase";
import { useAuthStore } from "../../stores/authStore";
import PropTypes from "prop-types";

export const ProductReviews = ({ productId, reviews, loading, onReviewSubmitted }) => {
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [hoverRating, setHoverRating] = useState(0);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeModalImage, setActiveModalImage] = useState(null);
  const fileInputRef = useRef(null);
  const { user } = useAuthStore();

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setError(null);
    setUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        // Enforce file type
        if (!file.type.startsWith("image/")) {
          throw new Error(`File "${file.name}" is not an image.`);
        }
        // Enforce file size limit of 5MB
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`File "${file.name}" exceeds the 5MB size limit.`);
        }

        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `reviews/${fileName}`;

        // Upload to supabase
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const urls = await Promise.all(uploadPromises);
      setUploadedImages((prev) => [...prev, ...urls]);
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err.message || "Failed to upload one or more images.");
    } finally {
      setUploading(false);
      // Reset input value to allow uploading the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeUploadedImage = (urlToRemove) => {
    setUploadedImages((prev) => prev.filter((url) => url !== urlToRemove));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("Please login to leave a review.");
      return;
    }

    if (!newReview.comment.trim()) {
      setError("Please write a comment.");
      return;
    }

    setSubmitting(true);
    try {
      const { error: submitError } = await supabase.from("reviews").insert({
        product_id: productId,
        user_id: user.id,
        rating: newReview.rating,
        comment: newReview.comment,
        images: uploadedImages,
      });

      if (submitError) throw submitError;

      setNewReview({ rating: 5, comment: "" });
      setUploadedImages([]);
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
      setError(err.message || "Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl shadow-sm border border-outline-variant/10 font-body">
      <h3 className="text-2xl font-bold text-primary mb-8 flex items-center gap-2">
        <span className="material-symbols-outlined text-secondary">rate_review</span>
        Customer Reviews
      </h3>

      {/* Write a Review Form */}
      {user ? (
        <form
          onSubmit={handleSubmitReview}
          className="mb-10 p-6 bg-surface-container-low rounded-2xl border border-outline-variant/10 relative overflow-hidden"
        >
          <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
            Write a Review
          </h4>

          {error && (
            <div className="mb-4 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}

          <div className="flex flex-col gap-6">
            {/* Rating Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                Your Rating
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-secondary hover:scale-120 active:scale-95 transition-all duration-200 outline-none cursor-pointer focus:outline-none flex items-center justify-center"
                    aria-label={`Rate ${star} Stars`}
                  >
                    <span
                      className="material-symbols-outlined text-4xl select-none"
                      style={{
                        fontVariationSettings: `'FILL' ${
                          (hoverRating || newReview.rating) >= star ? 1 : 0
                        }`,
                      }}
                    >
                      star
                    </span>
                  </button>
                ))}
                <span className="text-sm font-bold text-on-surface-variant ml-3">
                  {newReview.rating} / 5
                </span>
              </div>
            </div>

            {/* Comment Area */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                Your Experience
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                required
                rows="4"
                className="w-full px-5 py-4 rounded-xl bg-surface-container-highest border border-outline-variant/10 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-surface-container-lowest transition-all text-on-surface font-medium placeholder:text-outline-variant outline-none resize-none shadow-sm"
                placeholder="What did you like or dislike about this product? Tell us your thoughts..."
              />
            </div>

            {/* Photo Upload Zone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                Add Photos (Optional)
              </label>
              <div className="flex flex-wrap gap-4 items-center">
                {/* Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-24 h-24 rounded-xl border-2 border-dashed border-outline-variant/40 hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:text-primary bg-surface-container-high/40 hover:bg-surface-container-high/80 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-2xl">add_a_photo</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider">Upload</span>
                    </>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Uploaded Images Preview List */}
                <div className="flex flex-wrap gap-3">
                  {uploadedImages.map((url, index) => (
                    <div
                      key={index}
                      className="relative w-24 h-24 rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm group bg-surface-container-lowest shrink-0"
                    >
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeUploadedImage(url)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 hover:bg-error text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md scale-90 hover:scale-100"
                        aria-label="Remove Image"
                      >
                        <span className="material-symbols-outlined text-sm font-bold">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={submitting || uploading}
              className="bg-primary text-white font-bold px-8 py-3.5 rounded-full hover:bg-primary/95 active:scale-[0.98] transition-all shadow-md shadow-primary/20 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">send</span>
                  Submit Review
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-10 p-6 bg-surface-container-low/60 rounded-2xl border border-outline-variant/10 text-center">
          <span className="material-symbols-outlined text-outline-variant text-4xl mb-2">lock</span>
          <p className="text-on-surface-variant font-semibold text-sm">
            Please log in as a buyer to leave a review.
          </p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <p className="text-on-surface-variant font-medium animate-pulse flex items-center gap-2">
            <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></span>
            Loading reviews...
          </p>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16 bg-surface-container-low/50 rounded-2xl border border-outline-variant/5">
            <span className="material-symbols-outlined text-outline-variant/60 text-5xl mb-3">
              rate_review
            </span>
            <p className="text-on-surface-variant font-semibold">
              No reviews yet. Be the first to review this product!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {reviews.map((review) => (
              <div key={review.id} className="py-6 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner">
                      {(review.buyers?.full_name?.[0] || "A").toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-on-surface block leading-none mb-1">
                        {review.buyers?.full_name || "Anonymous"}
                      </span>
                      <span className="text-xs text-on-surface-variant font-medium">
                        {new Date(review.created_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex text-secondary text-sm">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined select-none"
                        style={{
                          fontVariationSettings: `'FILL' ${i < review.rating ? 1 : 0}`,
                        }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pl-13 ml-13 flex flex-col gap-4">
                  <p className="text-on-surface-variant leading-relaxed font-medium">
                    {review.comment}
                  </p>

                  {/* Review Photos */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-1">
                      {review.images.map((imgUrl, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveModalImage(imgUrl)}
                          className="w-20 h-20 rounded-xl overflow-hidden border border-outline-variant/10 hover:border-primary/30 transition-all hover:scale-[1.03] shadow-sm bg-surface-container-high cursor-pointer"
                        >
                          <img
                            src={imgUrl}
                            alt={`Review Attachment ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Zoom Modal */}
      {activeModalImage && (
        <div
          onClick={() => setActiveModalImage(null)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl bg-black">
            <img
              src={activeModalImage}
              alt="Zoomed attachment"
              className="max-w-full max-h-[85vh] object-contain mx-auto"
            />
            <button
              onClick={() => setActiveModalImage(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black text-white flex items-center justify-center transition-colors shadow-lg border border-white/10 cursor-pointer"
            >
              <span className="material-symbols-outlined font-bold">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

ProductReviews.propTypes = {
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  reviews: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onReviewSubmitted: PropTypes.func.isRequired,
};
