const express = require('express');
const { registerUser, loginUser, getAllUser, updateUserProfile } = require('../controllers/userController');
//const { authenticateJWT } = require('../middleware/authMiddleware'); // Middleware for authentication
const router = express.Router();

// Route to register a new user
router.post('/register', registerUser);  // POST /api/users/register
//route to login
router.post('/login', loginUser) // POST /api/users
router.get('/getUser', getAllUser); // GET /api/users



module.exports = router;
