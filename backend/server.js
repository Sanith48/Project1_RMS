const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require("fs");

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',  
    methods: ['GET', 'POST'],          
  }));

// MongoDB connection using Mongoose
mongoose.connect("mongodb+srv://alanabelabraham75:1234@cluster0.atucd.mongodb.net/Restaurant?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected!'))
  .catch(err => console.log(err));

// Mongoose Schemas
const userSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String
});

const foodSchema = new mongoose.Schema({
    food_name: String,
    food_price: Number,
    food_image: String,
    food_id: Number,
    user_id:Number
});

const cartSchema = new mongoose.Schema({
    user_id: Number,
    food_id: Number,
    quantity: Number
});


const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    feedback: String
});

const Contact = mongoose.model('Contact', contactSchema);

const User = mongoose.model('User', userSchema);
const Food = mongoose.model('Food', foodSchema);
const Cart = mongoose.model('Cart', cartSchema);


// Multer storage configuration
const storage = multer.diskStorage({
    destination: "./public/images",
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.send('Welcome to my server');
});

app.get('/api/login', (req, res) => {
    res.send('Login');
});

app.get('/api/register', (req, res) => {
    res.send('Registration');
});

app.get('/api/user', async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/api/register", async (req, res) => {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
        return res.status(400).json({ error: "Fill the credentials properly" });
    }

    try {
        const newUser = new User({ fullname, email, password });
        await newUser.save();

        const accessToken = jwt.sign({ name: fullname }, process.env.ACCESS_TOKEN);
        return res.status(201).json({ accessToken, message: "Registration successful" });
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Enter email and password" });
    }

    try {
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(400).json({ message: "Wrong email or password" });
        }
        return res.status(200).json({ message: "Login successful" });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Use multer for file uploads in /api/foods
app.post('/api/foods', upload.single('food_image'), async (req, res) => {
    const { name, price } = req.body;
    
    try {
        const newFood = new Food({
            food_name: name,
            food_price: price,
            food_image: req.file ? `/images/${req.file.filename}` : "./images/Vanillashake.jpeg"
        });
        await newFood.save();
        return res.status(201).json({ message: "Successfully added" });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
});

app.get('/api/foods', async (req, res) => {
    try {
        const foods = await Food.find();
        console.log(foods)
        return res.status(200).json(foods);
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.post('/api/cart', async (req, res) => {
    const { food_id, user_id } = req.body;
    console.log(food_id, user_id)

    if (!food_id || !user_id) {
        return res.status(400).json({ error: "Missing food or user ID" });
    }

    try {
        let cartItem = await Cart.findOne({ food_id });
        if (cartItem) {
            cartItem.quantity += 1;
            await cartItem.save();
            return res.status(200).json({ message: "Quantity updated" });
        } else {
            const newCartItem = new Cart({ food_id, user_id, quantity: 1 });
            await newCartItem.save();
            return res.status(200).json({ message: "Item added to cart successfully" });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.get('/api/cart', async (req, res) => {
    try {
        const cartItems = await Cart.aggregate([
            {
                $lookup: {
                    from: "foods",
                    localField: "food_id",
                    foreignField: "_id",
                    as: "foodDetails"
                }
            },
            { $unwind: "$foodDetails" },
            {
                $project: {
                    food_name: "$foodDetails.food_name",
                    food_price: "$foodDetails.food_price",
                    quantity: 1
                }
            }
        ]);
        return res.status(200).json(cartItems);
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Handle file deletions for images
app.delete('/api/foods/:id', async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);
        if (!food) {
            return res.status(404).json({ message: "Food not found" });
        }
        
        // Delete the image file from the server if it exists
        const imagePath = path.join(__dirname, 'public', food.food_image);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await Food.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Food item deleted successfully" });
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/api/Contact', async (req, res) => {
    const { name, email, phone, feedback } = req.body;

    if (!name || !email || !phone || !feedback) {
        return res.status(400).json({ message: "Form Submitted" });
    }

    try {
        const newFeedback = new Contact({
            name,
            email,
            phone,
            feedback
        });

        await newFeedback.save();
        return res.status(201).json({ message: "Feedback submitted successfully" });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
});



app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
  });
