
import { Review, User } from '../models/index.js';
import path from 'path';
import { Op } from 'sequelize';

export const createReview = async (req, res) => {
  try {
    const { productId, content } = req.body;
    let { rating } = req.body; 
    const userId = req.user.id;
    const image = req.file ? req.file.path : null;

    console.log("Rating Data ", rating);

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const ratingExists = Object.prototype.hasOwnProperty.call(req.body, 'rating');
    let parsedRating = null;

    if (ratingExists) {
      parsedRating = Number(rating);
      if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        return res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
      }
    }

    if (
      (!ratingExists || parsedRating === null) &&
      (!content || content.trim() === '')
    ) {
      return res.status(400).json({ error: 'Either rating or review must be provided' });
    }

    let existingReview = await Review.findOne({
      where: { user_id: userId, product_id: productId }
    });

    if (existingReview) {
      const alreadyRated = existingReview.rating !== null;
      const alreadyReviewed = !!(existingReview.content && existingReview.content.trim());

      // Block re-rating
      if (alreadyRated && ratingExists) {
        return res.status(400).json({ error: 'You have already submitted a rating for this product' });
      }

      // Block re-review
      if (alreadyReviewed && content && content.trim() !== '') {
        return res.status(400).json({ error: 'You have already submitted a review for this product' });
      }

      // Update only missing parts
      const updatedReview = await existingReview.update({
        rating: alreadyRated ? existingReview.rating : parsedRating,
        content: alreadyReviewed ? existingReview.content : content,
        image: existingReview.image || image,
      });

      const user = await User.findByPk(userId, { attributes: ['name'] });

      return res.status(200).json({
        id: updatedReview.id,
        content: updatedReview.content,
        rating: updatedReview.rating,
        name: user.name,
        image: updatedReview.image
          ? `${req.protocol}://${req.get('host')}/uploads/reviews/${path.basename(updatedReview.image)}`
          : null,
        createdAt: updatedReview.createdAt,
        productId: updatedReview.product_id,
      });
    }

    // Create new review
    const newReview = await Review.create({
      content: content || null,
      rating: ratingExists ? parsedRating : null,
      user_id: userId,
      product_id: productId,
      image
    });

    const user = await User.findByPk(userId, { attributes: ['name'] });

    return res.status(201).json({
      id: newReview.id,
      content: newReview.content,
      rating: newReview.rating,
      name: user.name,
      image: image
        ? `${req.protocol}://${req.get('host')}/uploads/reviews/${path.basename(image)}`
        : null,
      createdAt: newReview.createdAt,
      productId: newReview.product_id,
    });
  } catch (error) {
    console.error('Error creating/updating review:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};


export const getAverageRating = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.findAll({
      where: {
        product_id: productId,
        rating: {
          [Op.ne]: null,
        },
      },
      attributes: ['rating'],
    });

    if (reviews.length === 0) {
      return res.json({ average: 0, count: 0 });
    }

    const ratings = reviews.map(r => r.rating);
    const average = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;

    res.json({
      average: Math.round(average * 10) / 10,
      count: ratings.length,
    });
  } catch (error) {
    console.error('Error calculating average rating:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getUserRatingStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const review = await Review.findOne({
      where: { user_id: userId, product_id: productId },
    });

    res.json({
      hasRated: !!(review && review.rating !== null),
      hasReviewed: !!(review && review.content && review.content.trim() !== ''),
      canRate: !review || review.rating === null,
      canReview: !review || !review.content || review.content.trim() === '',
    });
  } catch (error) {
    console.error('Error checking user rating status:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.findAll({
      where: { product_id: productId },
      include: [{ model: User, attributes: ['name'] }],
      order: [['createdAt', 'DESC']],
    });

    const formatted = reviews.map(review => ({
      id: review.id,
      content: review.content,
      rating: review.rating,
      name: review.User.name,
      image: review.image
        ? `${req.protocol}://${req.get('host')}/uploads/reviews/${path.basename(review.image)}`
        : null,
      createdAt: review.createdAt,
      productId: review.product_id,
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
