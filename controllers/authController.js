const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createUser = async (req, res) => {
  console.log(req.body)
  const { name, email } = req.body;
  const user = new User({ name, email });
  await user.save();
  res.status(201).json(user);
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, { name, email }, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const recalculatePoints = async (req, res) => {
  const { id } = req.params;
  const user = await User
    .findById(id)
    .populate('matchPredictions');
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const points = user.matchPredictions.reduce((acc, mp) => {
    return acc + mp.points;
  }, 0);
  user.points = points;
  await user.save();
  res.json(user);
}

const login = async (req, res) => {
  const { email, password } = req.body;
  // duh...
  if (password !== 'clemens') {
    return res.status(401).json({ error: 'Invalid password' });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
  res.json({ token, user });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  recalculatePoints,
  login,
};
