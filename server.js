const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'abc123', // Replace with a random string for better security
    resave: false,
    saveUninitialized: true
}));
app.set('view engine', 'ejs');

const User = require('/Users/sujitbhogil/gift-hamper-website/model/User.js');

// Connect to MongoDB (you need MongoDB installed and running locally or provide a connection URI)
mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

// Define routes
let cart = [];

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/cart', (req, res) => {
    res.render('cart', { cart });
});

app.get('/chocolates', (req, res) => {
    res.render('chocolates');
});

app.get('/necklaces', (req, res) => {
    res.render('necklaces');
});

app.get('/bracelets', (req, res) => {
    res.render('bracelets');
});

app.get('/messages', (req, res) => {
    res.render('messages');
});

app.get('/gift-boxes', (req, res) => {
    res.render('gift-boxes');
});

app.post('/add-to-cart', (req, res) => {
    const { id, name, price } = req.body;
    const item = { id, name, price: parseFloat(price) };
    cart.push(item);
    res.redirect('back');
});

app.post('/remove-from-cart', (req, res) => {
    const { id } = req.body;
    cart = cart.filter(item => item.id !== id);
    res.redirect('/cart');
});

app.post('/checkout', (req, res) => {
    // Handle checkout logic here
    cart = [];  // Empty the cart after checkout
    res.send('Checkout completed!');
});

// GET route to render the register page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Example route for registering a user
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if username already exists
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).send('Username already exists');
        }

        // Create a new user
        const newUser = new User({ username, password });
        await newUser.save();

        // Optionally, you can store user session information here

        res.send('Registration successful!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error registering user');
    }
});

// Example route for logging in a user
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username and password
        const user = await User.findOne({ username, password });

        if (!user) {
            return res.status(401).send('Invalid username or password');
        }

        // Store user session information (e.g., user ID)
        req.session.userId = user._id;

        res.send('Login successful!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error logging in user');
    }
});

// Example route for logging out a user
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.send('Logout successful');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
