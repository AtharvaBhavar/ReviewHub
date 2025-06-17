import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI, reviewsAPI } from '../utils/api';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import { useAuth } from '../context/AuthContext';
import { Star, ArrowLeft } from 'lucide-react';
import AuthModal from '../components/AuthModal';

const ReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [ratingData, setRatingData] = useState({ average: 0, count: 0 });
  const [userStatus, setUserStatus] = useState({ canReview: false });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [reviews, setReviews] = useState([]);
const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    loadPageData();
  }, [id, isAuthenticated]);

  const loadPageData = async () => {
    try {
      const productResponse = await productsAPI.getById(id);
      setProduct(productResponse.data);

      const ratingResponse = await reviewsAPI.getAverage(id);
      setRatingData(ratingResponse.data);

      const reviewsResponse = await reviewsAPI.getByProduct(id);
      setReviews(reviewsResponse.data);

      if (isAuthenticated) {
        const statusResponse = await reviewsAPI.getUserStatus(id);
        setUserStatus(statusResponse.data);
              setHasRated(statusResponse.data.hasRated);

      }
    } catch (error) {
      console.error('Error loading review page:', error);
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      console.log('Submitting review data:', reviewData);

      const formData = new FormData();

          if (reviewData.rating !== null && reviewData.rating !== undefined && reviewData.rating !== '') {
      formData.append('rating', reviewData.rating);
    }
      formData.append('content', reviewData.content);
      // formData.append('name', reviewData.name);
      formData.append('productId', id);
      formData.append('id', id);        

      if (reviewData.image) {
        formData.append('image', reviewData.image);
      }



      const res = await reviewsAPI.create(formData);
      console.log('Review submitted!', res.data);

      await loadPageData();
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  if (!product) {
    return <div className="text-center text-gray-600">Loading product details...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

      <div className="col-span-1 bg-white rounded-xl shadow-md p-6">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 text-sm font-medium flex items-center mb-4 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Products
        </button>

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <h2 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h2>
        <p className="text-sm text-gray-600 mb-4">{product.description}</p>

        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${
                star <= ratingData.average ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-sm text-gray-700 font-medium">
            {ratingData.average.toFixed(1)} ({ratingData.count}{' '}
            {ratingData.count === 1 ? 'rating' : 'ratings'})
          </span>
        </div>
      </div>

      <div className="col-span-1 md:col-span-2 bg-white rounded-xl shadow-md p-6">
                <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
          <ReviewList reviews={reviews} />
        </div>
        <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
        {isAuthenticated && userStatus.canReview ? (
          <ReviewForm onSubmit={handleReviewSubmit}   hasRated={hasRated}
 />
        ) : !isAuthenticated ? (
          <p className="text-sm text-blue-700 font-medium">Please sign in to write a review.</p>
        ) : (
          <p className="text-sm text-green-700 font-medium">
           Thank you! You've already reviewed this product.
          </p>
        )}


      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </div>
  );
};

export default ReviewPage;
