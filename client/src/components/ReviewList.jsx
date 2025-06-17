import React, { useState } from 'react';
import { Star, User, Calendar, Tag, MessageCircle } from 'lucide-react';

const ReviewList = ({ reviews }) => {
  const filteredReviews = reviews.filter(
    (review) => review.content && review.content.trim() !== ''
  );

  if (filteredReviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p>No reviews yet. Be the first to share your experience!</p>
      </div>
    );
  }

  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {filteredReviews.map((review, index) => (
          <div key={index} className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 rounded-full p-2">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">{review.name}</h5>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= review.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <h6 className="font-semibold text-gray-900 mb-2">{review.title}</h6>
            <p className="text-gray-700 leading-relaxed">{review.content}</p>

            {review.image && (
              <div className="mt-4">
                <img
                  src={review.image}
                  alt="Review"
                  onClick={() => setShowPreview(true)}
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80"
                />
              </div>
            )}

            {showPreview && (
              <div
                onClick={() => setShowPreview(false)}
                className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
              >
                <img
                  src={review.image}
                  alt="Review Large"
                  className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
