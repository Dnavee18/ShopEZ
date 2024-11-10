const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize app
const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ShopEZ', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Define schemas and models
const Product = mongoose.model('Product', new mongoose.Schema({
  title: String,
  price: Number,
  category: String,  // Example category (e.g., Electronics, Clothing)
  mainImg: String,   // Main image URL
}));

const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  email: String,
  usertype: String,
  password: String,
  preferredCategories: [String],  // Preferred categories for recommendation
  recentViews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],  // List of viewed products (by product IDs)
  cartItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],  // List of products added to cart (by product IDs)
  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],  // List of products the user has ordered (by product IDs)
}));

// Middleware to log request details
app.use((req, res, next) => {
  console.log(`Request method: ${req.method}, Request URL: ${req.url}`);
  next();
});

// Endpoint to add a product to the user's recent views
app.post('/add-recent-view', async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Prevent duplicate entries in recent views
    if (!user.recentViews.includes(productId)) {
      user.recentViews.push(productId);
      await user.save();
    }
    
    res.json({ message: 'Recent view added' });
  } catch (error) {
    console.error('Error adding recent view:', error);
    res.status(500).json({ message: 'Error adding recent view' });
  }
});

// Endpoint to add a product to the user's cart
app.post('/add-to-cart', async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Prevent duplicate entries in the cart
    if (!user.cartItems.includes(productId)) {
      user.cartItems.push(productId);
      await user.save();
    }
    
    res.json({ message: 'Product added to cart' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Error adding product to cart' });
  }
});

// Endpoint to place an order (add products to the order history)
app.post('/place-order', async (req, res) => {
  const { userId, productIds } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Add ordered products to user’s order history
    user.orderHistory.push(...productIds);
    await user.save();
    
    res.json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Error placing order' });
  }
});

// Endpoint to fetch recommendations for a user
app.get('/recommendations/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const user = await User.findById(userId).populate('recentViews cartItems orderHistory');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const criteria = {};
    
    // Use preferred categories for recommendations
    if (user.preferredCategories && user.preferredCategories.length > 0) {
      criteria.category = { $in: user.preferredCategories };
    }
    
    // Use recently viewed products for recommendations
    if (user.recentViews && user.recentViews.length > 0) {
      criteria._id = { $in: user.recentViews.map(view => view._id) };
    }
    
    // Use cart items for recommendations
    if (user.cartItems && user.cartItems.length > 0) {
      if (!criteria.category) {
        criteria.category = { $in: user.cartItems.map(item => item.category) };
      }
    }
    
    // Use ordered products for recommendations
    if (user.orderHistory && user.orderHistory.length > 0) {
      if (!criteria.category) {
        criteria.category = { $in: user.orderHistory.map(order => order.category) };
      }
    }
    
    // Find products based on the combined criteria
    const recommendedProducts = await Product.find(criteria).limit(5);  // Adjust limit as needed
    
    res.json(recommendedProducts);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
});

// Default route to test the server
app.get('/', (req, res) => {
  res.send('E-commerce Backend is running!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
