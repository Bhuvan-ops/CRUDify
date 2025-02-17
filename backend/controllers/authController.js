const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { ACCESS_TOKEN_SECRET } = process.env;

const registerUser = async (req, res) => {
  const { username, email, age, phonenumber, password, role } = req.body;
  try {
    const user = new User({ username, email, age, phonenumber, password, role });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "A user with these credentials already exists", error: err.message });
  }
};


const loginUser = async (req, res) => {
    const { username, email, phonenumber, password } = req.body;
  
    try {
      let query = {};

      if (email) {
          query.email = email;
      } else if (phonenumber) {
          query.phonenumber = phonenumber;
      } else if (username) {
          query.username = username;
      }          
  
      const user = await User.findOne(query);
  
      if (!user) return res.status(400).json({ message: "User not found" });
  
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return res.status(401).json({ message: "Invalid credentials" });
  
      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
  
      if (user.role === "admin") {
        res.json({ message: "Login successful as Admin", token });
      } else {
        res.json({ message: "Login successful", token });
      }
    } catch (err) {
      res.status(500).json({ message: "Error logging in", error: err.message });
    }
  }; 

module.exports = { registerUser, loginUser };
