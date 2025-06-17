import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Tag, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { reviewsAPI } from '../utils/api';
import StarRating from './StarRating';
import AuthModal from './AuthModal';

const ProductCard = ({ product, onDataUpdate }) => {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [ratingData, setRatingData] = useState({ average: 0, count: 0 });
  const [userStatus, setUserStatus] = useState({
    canRate: true,
    canReview: true,
    hasRated: false,
    hasReviewed: false,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [product.id, isAuthenticated]);

  const loadData = async () => {
    try {
      setLoading(true);
      const ratingResponse = await reviewsAPI.getAverage(product.id);
      // console.log('ratingResponse:', ratingResponse);
      
      setRatingData(ratingResponse.data);

      if (isAuthenticated) {
        const statusResponse = await reviewsAPI.getUserStatus(product.id);
        setUserStatus(statusResponse.data);
      } else {
        setUserStatus({
          canRate: false,
          canReview: false,
          hasRated: false,
          hasReviewed: false,
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthRequired = () => {
    setShowAuthModal(true);
  };

const handleRatingSubmit = async (productId, rating) => {
  if (!isAuthenticated) {
    handleAuthRequired();
    return false;
  }

  try {
    await reviewsAPI.create({ productId, rating });
    await loadData(); 
    return true;
  } catch (error) {
    console.error('Error submitting rating:', error);
    alert(error.response?.data?.error || 'Error submitting rating');
    return false;
  }
};



  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse h-full flex flex-col">
        <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 rounded mt-auto"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">

        <div className="relative h-64 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-full">
            <span className="text-sm font-semibold text-gray-800">Rs.{product.price}</span>
          </div>
        </div>

        <div className="p-6 flex flex-col justify-between flex-grow">
          <div>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= ratingData.average
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {ratingData.average.toFixed(1)} ({ratingData.count} {ratingData.count === 1 ? 'rating' : 'ratings'})
                </span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Tag className="h-3 w-3" />
                <span>{product.category}</span>
              </div>
            </div>

         {!isAuthenticated && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700 font-medium">
                  <User className="h-4 w-4 inline mr-1" />
                  Sign in to rate and review this product
                </p>
              </div>
            )}

            {isAuthenticated && userStatus.canRate && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Quick Rating</h4>
                <StarRating
                  productId={product.id}
                  onRatingSubmit={handleRatingSubmit}
                />
              </div>
            )}

            {isAuthenticated && (!userStatus.canRate && !userStatus.canReview) && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 font-medium">
                   Thank you! You've already provided feedback for this product.
                </p>
              </div>
            )}
          </div>

          <div className="mt-auto flex space-x-2 pt-4">
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  handleAuthRequired();
                } else {
                  navigate(`/review/${product.id}`);
                }
              }}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !isAuthenticated
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : userStatus.canReview
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {!isAuthenticated
                ? 'Sign In to Review'
                : userStatus.canReview
                ? 'Write Review'
                : 'Already Reviewed'}
            </button>

            <button
              onClick={() => navigate(`/review/${product.id}`)}
              className="flex items-center justify-center space-x-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              <span>View Reviews</span>
            </button>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </>
  );
};

export default ProductCard;
