import express from 'express';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

import dotenv from 'dotenv';
import sequelize from './config/database.js';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors()); 

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);


app.use('/uploads/reviews', express.static('uploads/reviews'));

sequelize.sync({ alter: true }) 
  .then(() => console.log('Database synced'))
  .catch(err => console.error('DB sync error:', err));



// sequelize.sync({ force: true }) 
//   .then(() => console.log('Database synced'))
//   .catch(err => console.error('DB sync error:', err));



app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
