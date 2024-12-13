const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Register a new user
const registerUser = async (req, res) => {
    const data = req.body; // User input from request body
    console.log(data);

    // Check for missing fields
    if (!data.name || !data.email || !data.password || !data.cardNumber || !data.cardCode) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
    }

    // Encrypt password and card information
    const salt = bcrypt.genSaltSync(10); // Generate salt
    const cryptedPass = await bcrypt.hash(data.password, salt); // Encrypt password
    const cryptedCardNumber = await bcrypt.hash(data.cardNumber, salt); // Encrypt card number
    const cryptedCardCode = await bcrypt.hash(data.cardCode, salt); // Encrypt card code

    // Create new user with encrypted values
    const usr = new User({
        ...data,
        password: cryptedPass,
        cardNumber: cryptedCardNumber,
        cardCode: cryptedCardCode,
    });

    try {
        const savedUser = await usr.save(); // Save user to the database
        res.status(201).json({ message: 'User created successfully', user: savedUser });
    } catch (err) {
        console.error('Error saving user:', err);
        res.status(400).json({ message: 'Error saving user', error: err });
    }
};

// Login user
const loginUser = async (req, res) => {
    const data = req.body;

    // Find user by email
    const user = await User.findOne({ email: data.email });
    if (!user) {
        return res.status(404).json({ message: 'Email or password not valid' });
    }

    // Check if the password is correct
    const validPass = bcrypt.compareSync(data.password, user.password);
    if (!validPass) {
        return res.status(401).json({ message: 'Email or password invalid' });
    }

    // Create JWT token
    const payload = {
        _id: user.id,
        email: user.email,
        name: user.name,
    };

    const token = jwt.sign(payload, 'tokenwafaoumayma', { expiresIn: '1h' }); // Expire token after 1 hour
    res.status(200).json({ message: 'Login successful', mytoken: token });
};

// Get all users (optional, for debugging or admin purposes)
const getAllUser = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

module.exports = { registerUser, loginUser, getAllUser };
