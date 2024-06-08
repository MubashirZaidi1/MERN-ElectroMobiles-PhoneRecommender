const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios'); // Import axios
const path = require('path');
const fs = require('fs').promises;


const app = express();
const router = express.Router();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());

// MongoDB Connection
const mongoURI = 'mongodb://127.0.0.1:27017/webproject'; // Update with your MongoDB URI
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define MongoDB Schema
const mobilePhoneSchema = new mongoose.Schema({
  name: String,
  ratings: Number,
  price: Number,
  imageURL: String,
  Description: String
});

const MobilePhone = mongoose.model('MobilePhone', mobilePhoneSchema);

// Routes
app.post('/api/mobilephones', async (req, res) => {
  try {
    const { name, ratings, price, imageURL, 
      Description } = req.body;

    const newMobilePhone = new MobilePhone({
      name,
      ratings,
      price,
      imageURL,
      Description
    });

    await newMobilePhone.save();
    res.status(201).json(newMobilePhone);
  } catch (error) {
    console.error('Error adding mobile phone:', error);
    res.status(500).json({ error: 'Failed to add mobile phone. Please try again.' });
  }
});








const adminSchema = new mongoose.Schema({
    email: String,
    password: String,
  });
  
  const Admin = mongoose.model('Admin', adminSchema);
  
  // Middleware
  app.use(bodyParser.json());
  
  // API Routes
  app.post('/api/admins/signup', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ error: 'Admin account already exists with this email.' });
      }
  
      const newAdmin = new Admin({ email, password });
      await newAdmin.save();
      res.status(201).json({ message: 'Admin account created successfully.' });
    } catch (error) {
      console.error('Error creating admin account:', error);
      res.status(500).json({ error: 'Failed to create admin account. Please try again.' });
    }
  });
  
  app.post('/api/admins/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const admin = await Admin.findOne({ email, password });
      if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials. Please try again.' });
      }
  
      // Successful login
      res.status(200).json({ message: 'Admin authenticated successfully.' });
    } catch (error) {
      console.error('Error authenticating admin:', error);
      res.status(500).json({ error: 'Failed to authenticate admin. Please try again.' });
    }
  });

// Route to fetch featured products with images
const IMAGES_DIR = path.join(__dirname, './images'); // Path to your images directory

// Middleware
app.use(express.json());

async function getImageBase64(imagePath) {
    try {
      const imageBuffer = await fs.readFile(imagePath);
      return imageBuffer.toString('base64');
    } catch (error) {
      console.error('Error reading image file:', error);
      throw error; // Propagate the error to handle it in the calling function
    }
  }

// Endpoint to fetch featured products with images
// Endpoint to fetch featured products with images
// Endpoint to fetch featured products with images
app.get('/api/products/featured', async (req, res) => {
    try {
      const featuredProducts = await MobilePhone.find();
      const productsWithImages = [];
  
      for (const product of featuredProducts) {
        const { name, ratings, price, 
          Description } = product;
        const phoneName = name.replace(/[^\w\s]/gi, ''); // Sanitize phone name
        const phoneImageDir = path.join(IMAGES_DIR, phoneName);
  
        try {
          // Check if the directory exists for the phone's images
          await fs.access(phoneImageDir);
  
          // Read image files from the directory
          const imageFiles = await fs.readdir(phoneImageDir);
  
          if (imageFiles.length > 0) {
            const imagePath = path.join(phoneImageDir, imageFiles[0]);
            const imageBase64 = await getImageBase64(imagePath);
  
            // Add product data with image to the response
            productsWithImages.push({
              name,
              ratings,
              price,
              Description,
              imageBase64
            });
          } else {
            console.error(`No images found for ${name}`);
          }
        } catch (error) {
          console.error(`Error accessing image directory for ${name}:`, error);
          console.error(`Skipping product ${name}`);
        }
      }
  
      res.status(200).json(productsWithImages);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      res.status(500).json({ error: 'Failed to fetch featured products. Please try again.' });
    }
  });
  // API endpoint to fetch featured products with images

const orderSchema = new mongoose.Schema({
  buyerName: {
    type: String,
    required: true
  },
  buyerEmail: {
    type: String,
    required: true
  },
  products: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    required: true
  },
  status: {
    type: String,
    default: 'pending'
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  // Other fields as needed
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

module.exports = Order;
app.post('/api/orders', async (req, res) => {
  try {
    const { buyerName, buyerEmail, address, paymentMethod, products } = req.body;

    // Retrieve mobile phone IDs based on mobile phone names
    const mobilePhoneIds = await Promise.all(
      products.map(async (productName) => {
        const mobilePhone = await MobilePhone.findOne({ name: productName });
        if (!mobilePhone) {
          throw new Error(`Mobile phone not found: ${productName}`);
        }
        return mobilePhone._id; // Assuming '_id' is the ObjectId of the mobile phone
      })
    );

    // Create a new Order instance with mobilePhoneIds
    const newOrder = new Order({
      buyerName,
      buyerEmail,
      products: mobilePhoneIds,
      address,
      paymentMethod,
      status: 'pending',
      orderDate: new Date(),
    });

    // Save the new order to the database
    const savedOrder = await newOrder.save();

    // Send the saved order as a response
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ error: 'Failed to save order. Please try again.' });
  }
});

const { spawn } = require('child_process');

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Route for handling form submission and displaying recommendations
app.post('/recommend', async (req, res) => {
  const { company, model } = req.body;
  console.log(`Received company: ${company}, model: ${model}`);

  // Path to the Python script
  const pythonScriptPath = 'model.py';

  // Execute the Python script as a child process
  const pythonProcess = spawn('python', [pythonScriptPath, company, model]);

  let recommendations = [];  // Array to hold recommendations

  // Capture standard output (recommendations) from the Python script
  pythonProcess.stdout.on('data', async (data) => {
    const output = data.toString();  // Convert data to string
    console.log('Received data from Python:', output);

    // Split the output into an array of cleaned phone names
    const cleanedNames = output.split('\n').map(name => name.trim()).filter(name => name !== '');

    // Add cleaned phone names to recommendations array
    recommendations.push(...cleanedNames);

    // Debug: Log accumulated recommendations
    console.log('Accumulated recommendations:', recommendations);

    // Fetch detailed product information including images
    const productsWithImages = [];
    for (const name of cleanedNames) {
      try {
        const product = await MobilePhone.findOne({ name }); // Assuming 'name' is a unique identifier
        if (!product) {
          console.error(`Product not found for name: ${name}`);
          continue;
        }

        const phoneName = name.replace(/[^\w\s]/gi, ''); // Sanitize phone name
        const phoneImageDir = path.join(IMAGES_DIR, phoneName);

        // Check if the directory exists for the phone's images
        await fs.access(phoneImageDir);

        // Read image files from the directory
        const imageFiles = await fs.readdir(phoneImageDir);

        if (imageFiles.length > 0) {
          const imagePath = path.join(phoneImageDir, imageFiles[0]);
          const imageBase64 = await getImageBase64(imagePath);

          // Add product data with image to the response
          productsWithImages.push({
            name: product.name,
            ratings: product.ratings,
            price: product.price,
            Description: product.Description,
            imageURL: product.imageURL,
            imageBase64
          });
        } else {
          console.error(`No images found for ${name}`);
        }
      } catch (error) {
        console.error(`Error fetching product details for ${name}:`, error);
      }
    }

    // Send the detailed recommendations with images to the client
    res.status(200).json(productsWithImages);
  });

  // Handle errors from the Python script
  pythonProcess.stderr.on('data', (data) => {
    console.error(`Error from Python script: ${data.toString()}`);
    res.status(500).send('Error executing Python script');
  });

  // When the Python script finishes
  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Python script process exited with code ${code}`);
      res.status(500).send('Error executing Python script');
    }
  });
});

router.post('/api/search', async (req, res) => {
  const { searchQuery } = req.body; // Assuming searchQuery is sent in the request body

  try {
    // Find mobile phones whose names match the search query (case-insensitive)
    const regex = new RegExp(searchQuery, 'i');
    const searchResults = await MobilePhone.find({ name: regex });

    res.status(200).json(searchResults);
  } catch (error) {
    console.error('Error searching for mobile phones:', error);
    res.status(500).json({ error: 'Failed to search for mobile phones. Please try again.' });
  }
});

module.exports = router;
  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
