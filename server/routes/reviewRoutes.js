
import express from 'express';
import path from 'path';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.js';
import {
  getReviewsByProduct,
  createReview,
  getAverageRating,
  getUserRatingStatus
} from '../controllers/reviewController.js';

const router = express.Router();

router.use('/uploads', express.static(path.resolve('uploads/reviews')));

router.get('/product/:productId', getReviewsByProduct);         
router.get('/average/:productId', getAverageRating);            
router.get('/status/:productId', authenticateToken, getUserRatingStatus); 

router.post('/', authenticateToken, upload.single('image'), createReview);

export default router;
