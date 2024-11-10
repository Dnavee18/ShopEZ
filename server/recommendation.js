// backend/routes/recommendations.js
import express from 'express';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { Order } from '../models/Order'; // assuming an Order model exists

const router = express.Router();

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Step 1: Fetch user's past orders to understand their purchasing patterns.
    const userOrders = await Order.find({ userId });

    // Step 2: Collect product categories from user’s past orders.
    const purchasedCategories = [...new Set(userOrders.map(order => order.category))];

    // Step 3: If no orders are found, use a fallback or trending products.
    if (purchasedCategories.length === 0) {
      const trendingProducts = await Product.find({ isTrending: true }).limit(5);
      return res.json(trendingProducts);
    }

    // Step 4: Find products in these categories, excluding products user already purchased.
    const recommendedProducts = await Product.find({
      category: { $in: purchasedCategories },
      _id: { $nin: userOrders.map(order => order.productId) },
    }).limit(5);

    res.json(recommendedProducts);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ message: "Error fetching recommendations" });
  }
});

export default router;
