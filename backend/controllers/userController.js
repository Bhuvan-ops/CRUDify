const User = require('../models/userModel');

exports.createUser = async (req, res) => {
  const { username, email, age, phonenumber, password, role } = req.body;
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin role required to create a user' });
  }
  try {
    const newUser = new User({ username, email, age, phonenumber, password, role });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create user', message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch users', message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch user', message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, age, phonenumber, password, role } = req.body;
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin role required to update a user' });
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(id, { username, email, age, phonenumber, password, role }, { new: true });
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update user', message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin role required to delete a user' });
  }
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete user', message: err.message });
  }
};