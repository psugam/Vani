const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../../../database/user.model');

dotenv.config();
router.use(cors());

router.post('/users/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(400).json({ msg: "User does not exist. Please register first." });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password. Try again" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not set!");
      return res.status(500).json({ msg: "JWT secret missing" });
    }

    const token = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Generated token:", token);

    return res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        role:existingUser.role
      },
    });

  } catch (error) {
    res.status(500).json({
      message: 'Could not login the user. Try again',
      error: error.message,
    });
  }
});

module.exports = router;
