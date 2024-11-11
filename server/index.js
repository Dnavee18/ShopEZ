import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { Admin, Cart, Orders, Product, User } from './Schema.js';

const app = express();

app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const PORT = process.env.PORT || 6001;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/shopEZ', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((e) => {
  console.error(`Error in db connection: ${e}`);
  process.exit(1); // Exit process if unable to connect
});

// Register route
app.post('/register', async (req, res) => {
  const { username, email, usertype, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, usertype, password: hashedPassword });
    const userCreated = await newUser.save();
    res.status(201).json(userCreated);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Fetch banner
app.get('/fetch-banner', async (req, res) => {
  try {
    const admin = await Admin.findOne();
    res.json(admin ? admin.banner : null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error occurred' });
  }
});

// Fetch users
app.get('/fetch-users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error occurred' });
  }
});

// Fetch individual product details
app.get('/fetch-product-details/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error occurred" });
  }
});

// Fetch products
app.get('/fetch-products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error occurred' });
  }
});

// Fetch orders
app.get('/fetch-orders', async (req, res) => {
  try {
    const orders = await Orders.find();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error occurred' });
  }
});

// Fetch categories
app.get('/fetch-categories', async (req, res) => {
  try {
    let admin = await Admin.findOne();
    if (!admin) {
      admin = new Admin({ banner: "", categories: [] });
      await admin.save();
    }
    res.json(admin.categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error occurred" });
  }
});

// Add new product
app.post('/add-new-product', async (req, res) => {
  const { productName, productDescription, productMainImg, productCarousel, productSizes, productGender, productCategory, productNewCategory, productPrice, productDiscount } = req.body;
  try {
    let category = productCategory;
    if (productCategory === 'new category') {
      const admin = await Admin.findOne();
      if (!admin.categories.includes(productNewCategory)) {
        admin.categories.push(productNewCategory);
        await admin.save();
      }
      category = productNewCategory;
    }

    const newProduct = new Product({
      title: productName, description: productDescription, mainImg: productMainImg,
      carousel: productCarousel, category, sizes: productSizes,
      gender: productGender, price: productPrice, discount: productDiscount
    });
    await newProduct.save();

    res.json({ message: "Product added!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error occurred" });
  }
});

// Update banner
app.post('/update-banner', async (req, res) => {
  const { banner } = req.body;
  try {
    let admin = await Admin.findOne();
    if (!admin) {
      admin = new Admin({ banner, categories: [] });
    } else {
      admin.banner = banner;
    }
    await admin.save();
    res.json({ message: "Banner updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error occurred" });
  }
});

// Buy product
app.post('/buy-product', async (req, res) => {
  const { userId, name, email, mobile, address, pincode, title, description, mainImg, size, quantity, price, discount, paymentMethod, orderDate } = req.body;
  try {
    const newOrder = new Orders({ userId, name, email, mobile, address, pincode, title, description, mainImg, size, quantity, price, discount, paymentMethod, orderDate });
    await newOrder.save();
    res.json({ message: 'Order placed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error occurred" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
