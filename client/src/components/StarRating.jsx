import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ productId, onRatingSubmit, readonly = false, initialRating = 0 }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleStarClick = async (starValue) => {
    if (readonly || isSubmitting || hasSubmitted) return;

    setIsSubmitting(true);
    try {
      const success = await onRatingSubmit(productId, starValue);
      if (success) {
        setRating(starValue);
        setHasSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoveredRating || rating;
  const isInteractive = !readonly && !hasSubmitted;

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`transition-all duration-150 ${
            isInteractive
              ? 'cursor-pointer hover:scale-110 transform'
              : 'cursor-default'
          } ${isSubmitting ? 'opacity-50' : ''}`}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => isInteractive && setHoveredRating(star)}
          onMouseLeave={() => isInteractive && setHoveredRating(0)}
          disabled={!isInteractive || isSubmitting}
        >
          <Star
            className={`h-5 w-5 transition-colors duration-150 ${
              star <= displayRating
                ? 'text-yellow-400 fill-current'
                : isInteractive
                ? 'text-gray-300 hover:text-yellow-200'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
      
      {hasSubmitted && !readonly && (
        <span className="ml-2 text-xs text-green-600 font-medium">
          Rated!
        </span>
      )}
      
      {isSubmitting && (
        <span className="ml-2 text-xs text-blue-600">
          Saving...
        </span>
      )}
    </div>
  );
};

export default StarRating;