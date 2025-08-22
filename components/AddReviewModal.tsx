"use client";

import { useState } from "react";
import { X, Star } from "lucide-react";

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: { rating: number; comment?: string }) => void;
}

export default function AddReviewModal({
  isOpen,
  onClose,
  onSubmit,
}: AddReviewModalProps) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    onSubmit({
      rating,
      comment: comment.trim() || undefined,
    });

    // Reset form
    setComment("");
    setRating(0);
    setHoveredRating(0);
    onClose();
  };

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating: number) => {
    setHoveredRating(starRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] rounded-lg p-6 w-full max-w-md relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-white text-xl font-semibold text-center mb-6">
          Review Rave
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Review description */}
          <div>
            <textarea
              placeholder="Write your review comment (Optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none"
            />
          </div>

          {/* Rating section */}
          <div className="text-center">
            <p className="text-gray-300 text-sm mb-4">Select Rating</p>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                  className="transition-all duration-200 hover:scale-110"
                >
                  <Star
                    size={32}
                    className={`${
                      star <= (hoveredRating || rating)
                        ? star <= 2
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-yellow-400 text-yellow-400"
                        : "text-gray-600"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={rating === 0}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
          >
            Review Rave
          </button>
        </form>
      </div>
    </div>
  );
}
