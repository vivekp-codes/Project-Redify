const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Book = require('../DataBase/Models/BookSchema');
const User = require('../DataBase/Models/UserSchema');
const CheckToken = require('../DataBase/MiddleWares/CheckTokenValidation');

const router = express.Router();


router.post('/user/signup', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role = 'USER', address, profileImage } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      address,
      profileImage
    });

    return res.status(201).json({ message: 'User account created' });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});


router.post('/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email or password incorrect' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email or password incorrect' });
    }

    const SECRET_KEY = 'vhhdhejbfajbafjvafvfvavvvasvvdduwhuhwue6734483748723dhdschsdbhbhvsds8u3847';

    const token = jwt.sign(
      { id: user._id, role: user.role },
      SECRET_KEY,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'User logged in',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        address: user.address
      }
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});


router.patch(
  '/user/:id',
  CheckToken(['USER', 'ADMIN']),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, address, profileImage, password } = req.body;

      
      if (req.user.role !== 'ADMIN' && req.user.id !== id) {
        return res.status(403).json({ message: 'Not allowed to update this user' });
      }

      const updateData = {};

      if (name) updateData.name = name;
      if (address) updateData.address = address;
      if (profileImage) updateData.profileImage = profileImage;

      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({
        message: 'User updated successfully',
        user: updatedUser
      });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }
);



router.get(
  '/user/profile',
  CheckToken(['USER', 'ADMIN']),
  async (req, res) => {
    try {
      const userId = req.user.id;

      // User details (without password)
      const user = await User.findById(userId).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Books added by user
      const addedBooks = await Book.find({ owner: userId });

      // Books borrowed by user
      const borrowedBooks = await Book.find({ borrowedBy: userId });

      res.status(200).json({
        user,
        stats: {
          totalAddedBooks: addedBooks.length,
          totalBorrowedBooks: borrowedBooks.length,
        },
        books: addedBooks, // used for image grid
      });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);


module.exports = router;
