const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/learningPlatformDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// MongoDB Schemas
const userSchema = new mongoose.Schema({
  role: String,
  name: String,
  email: String,
  password: String,
});

const coursePurchaseSchema = new mongoose.Schema({
  studentName: String,
  courseName: String,
  youtubeLink: String,
  paymentStatus: String,
});

const User = mongoose.model("User", userSchema);
const CoursePurchase = mongoose.model("CoursePurchase", coursePurchaseSchema);

// Routes

// Register a user (student or admin)
app.post('/register', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.send("User registered successfully.");
  } catch (err) {
    res.status(500).send("Error registering user.");
  }
});

// Login check (basic)
app.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  const user = await User.findOne({ email, password, role });
  if (user) {
    res.send({ message: "Login successful", role });
  } else {
    res.status(401).send("Invalid credentials");
  }
});

// Purchase a course
app.post('/purchase', async (req, res) => {
  try {
    const newPurchase = new CoursePurchase(req.body);
    await newPurchase.save();
    res.send("Course purchased successfully.");
  } catch (err) {
    res.status(500).send("Error saving course purchase.");
  }
});

// Admin can view all purchases
app.get('/admin/purchases', async (req, res) => {
  try {
    const purchases = await CoursePurchase.find();
    res.json(purchases);
  } catch (err) {
    res.status(500).send("Error fetching purchases.");
  }
});


// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '../public')));

// Route to serve homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});