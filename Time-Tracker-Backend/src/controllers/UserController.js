// Import user model and bcrypt
const userModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const mailUtil = require("../utils/MailUtil")
const jwt = require("jsonwebtoken");
const secret = "secret";
const User = require("../models/UserModel"); 

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const roleFilter = req.query.role;

    let users = await userModel.find().populate("roleId", "name");

    
    if (roleFilter) {
      users = users.filter(user => user.roleId?.name === roleFilter);
    }

    res.json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log("Received Email:", email);
    console.log("Received Password:", password);
  
    const foundUser = await userModel.findOne({ email: email }).populate("roleId")
    console.log("Found User:", foundUser); // Debugging
  
    if (foundUser) {
      console.log("Stored Hashed Password:", foundUser.password);
      
      // Compare entered password with hashed password
      const isMatch = await bcrypt.compare(password, foundUser.password);
      console.log("Password Match:", isMatch);
  
      if (isMatch) {
        res.status(200).json({
          message: "Login successful",
          data: foundUser,
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(404).json({ message: "Email not found" });
    }
  };
// Signup (Register) user
const signup = async (req, res) => {
    try {
      console.log("Signup request received:", req.body); // Debugging
  
      // Password encryption
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);
      req.body.password = hashedPassword;
  
      console.log("Hashed Password:", req.body.password); 
  
      const createdUser = await userModel.create(req.body);
      console.log("User created successfully:", createdUser); 

      const { firstName, lastName, email } = createdUser;
      await mailUtil.sendingMail(email, firstName, lastName);
    

      res.status(201).json({
        message: "User created successfully",
        data: createdUser,
      });
    } catch (err) {
      console.error("Signup Error:", err); 
      res.status(500).json({
        message: "Error occurred during signup",
        error: err.message,
      });
    }
  };

// Add user
const addUser = async (req, res) => {
  const savedUser = await userModel.create(req.body);

  res.json({
    message: "user created...",
    data: savedUser,
  });
};

// Delete uconstser
const deleteUser = async (req, res) => {
  const deletedUser = await userModel.findByIdAndDelete(req.params.id);
  res.json({
    message: "user deleted successfully..",
    data: deletedUser,
  });
};

// Get user by ID
const getUserByID = async (req, res) => {
  const foundUser = await userModel.findById(req.params.id);
  res.json({
    message: "user fetched..",
    data: foundUser,
  });
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const foundUser = await userModel.findOne({ email });

    if (!foundUser) {
      return res.status(404).json({
        message: "User not found, please register first.",
      });
    }

    const token = jwt.sign(
      { _id: foundUser._id, email: foundUser.email },
      secret,
      { expiresIn: '15m' }
    );

    const url = `http://localhost:5173/resetpassword/${token}`;

    const mailContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; background-color: #D0DDD0;">
        <h2 style="color: #AAB99A;">Reset Your Time Tracker Password</h2>
        <p style="color: #555; font-size: 16px;">Hi ${foundUser.firstName} ${foundUser.lastName},</p>
        <p style="color: #555;">You recently requested to reset your password for your Time Tracker account.</p>
        <p style="margin-top: 20px;">
          <a href="${url}" style="background-color: #AAB99A; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        </p>
        <p style="color: #999; font-size: 14px;">If you didn’t request a password reset, you can ignore this email.</p>
        <p style="color: #999; font-size: 14px;">This link will expire in 15 minutes.</p>
      </div>
    `;

    await mailUtil.sendingMail(
      foundUser.email,
      foundUser.firstName,
      foundUser.lastName,
      "Reset Password Request",
      null,
      mailContent
    );

    return res.status(200).json({
      message: "Reset password link sent to your email.",
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      message: "Something went wrong while sending reset email.",
    });
  }
};



const resetpassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    let userFromToken;
    try {
      userFromToken = jwt.verify(token, secret);
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    const updatedUser = await userModel.findByIdAndUpdate(
      userFromToken._id,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "Password updated successfully." });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { roleId } = req.body;

    if (!roleId) {
      return res.status(400).json({ message: "❌ roleId is required" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "❌ User not found" });
    }

    user.roleId = roleId;
    const updatedUser = await user.save();

    res.status(200).json({
      message: "✅ User role updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error("❌ Error updating user role:", err.message);
    res.status(500).json({ message: `❌ ${err.message}` });
  }
};


// Exports
module.exports = {
  getAllUsers,
  addUser,
  deleteUser,
  getUserByID,
  loginUser,
  signup,
  forgotPassword,
  resetpassword,
  updateUserRole
};
