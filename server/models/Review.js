import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [10, 2000],
        msg: 'Review must be between 10 and 2000 characters',
      },
    },
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: {
        args: 1,
        msg: 'Rating must be at least 1',
      },
      max: {
        args: 5,
        msg: 'Rating cannot be more than 5',
      },
    },
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'product_id']
    }
  ]
});

export default Review;
