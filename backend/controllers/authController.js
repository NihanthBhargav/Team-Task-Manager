require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { Op } = require('sequelize');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;

    const userExists = await User.findOne({ where: { [Op.or]: [{ email }, { username }] } });
    if (userExists) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }

    const user = await User.create({ name, username, email, password, role: role || 'member' });

    const token = generateToken(user.id, user.role);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    const user = await User.findOne({ 
      where: { [Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }] } 
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email/username or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email/username or password' });
    }

    const token = generateToken(user.id, user.role);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
