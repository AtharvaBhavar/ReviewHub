import express from 'express';
import {
  getAllProducts,
  getProductById,
  seedProducts,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/seed', seedProducts);

export default router;
