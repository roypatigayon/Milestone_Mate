const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();
const jwt = require('jsonwebtoken');

const secretKey = 'your_secret_key';

const generateToken = (user) => {
    // Payload contains the data you want to encode in the token
    const payload = {
      userId: user.id,
      email: user.email,
    };
  
    // Sign the token with the payload, secret key, and options (e.g., expiration time)
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour
  
    return token;
  };

  module.exports = generateToken;

router.post('/register', register);
router.post('/login', login);

module.exports = router;
