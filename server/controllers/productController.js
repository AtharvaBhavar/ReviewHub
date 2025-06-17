import { Product } from '../models/index.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Seed sample products
export const seedProducts = async (req, res) => {
  try {
    const products = [
      {
        name: 'Premium Noise-Cancelling Headphones',
        description: 'Experience crystal-clear audio with industry-leading noise cancellation technology. Perfect for music lovers and professionals.',
        price: 299.99,
        category: 'Electronics',
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500'
      },
      {
        name: 'Smart Fitness Watch',
        description: 'Track your health and fitness goals with this advanced smartwatch featuring heart rate monitoring and GPS.',
        price: 249.99,
        category: 'Wearables',
        image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=500'
      },
      {
        name: 'Ergonomic Office Chair',
        description: 'Comfortable and supportive office chair designed for long working hours with adjustable height and lumbar support.',
        price: 399.99,
        category: 'Furniture',
        image: 'https://images.pexels.com/photos/586958/pexels-photo-586958.jpeg?auto=compress&cs=tinysrgb&w=500'
      },
      {
        name: 'Wireless Charging Pad',
        description: 'Fast and efficient wireless charging solution compatible with all Qi-enabled devices. Sleek design fits any space.',
        price: 49.99,
        category: 'Electronics',
        image: 'https://images.pexels.com/photos/4526414/pexels-photo-4526414.jpeg?auto=compress&cs=tinysrgb&w=500'
      },
      {
        name: 'Premium Coffee Maker',
        description: 'Brew perfect coffee every time with this programmable coffee maker featuring multiple brewing options and thermal carafe.',
        price: 179.99,
        category: 'Appliances',
        image: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=500'
      },
      {
        name: 'Bluetooth Portable Speaker',
        description: 'Compact yet powerful speaker with 360-degree sound, waterproof design, and 12-hour battery life.',
        price: 89.99,
        category: 'Electronics',
        image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=500'
      }
    ];

    await Product.bulkCreate(products, { ignoreDuplicates: true });
    res.json({ message: 'Products seeded successfully' });
  } catch (error) {
    console.error('Error seeding products:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
