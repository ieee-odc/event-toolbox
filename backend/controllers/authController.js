const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/OrganizerModel');
const Counter = require('../models/CounterModel');
const admin = require('firebase-admin');
const generatePassword = require('generate-password');

admin.initializeApp({
  credential: admin.credential.cert(require('../firebaseSDK.js'))
});

const Register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const counter = await Counter.findOneAndUpdate(
      { id: "autovalOrganizer" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const newUser = new User({
      id: counter.seq,
      username,
      email,
      password,
      provider: 'local',
      createdAt: new Date(),
      lastLoginAt: new Date()
    });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();
    const payload = { id: newUser.id, username: newUser.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: 3600 });

    res.status(201).json({ token });
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: 'Server error' });
  }
};

const SignIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials email' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: 3600 });

    user.lastLoginAt = new Date();
    await user.save();

    const { password: _, ...userData } = user.toObject();
    res.status(200).json({ token, user: userData });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const signupWithGoogle = async (req, res) => {
  const { tokenId } = req.body;

  const generateStrongPassword = () => {
    return generatePassword.generate({
      length: 16,
      numbers: true,
      symbols: true,
      uppercase: true,
      lowercase: true,
      excludeSimilarCharacters: true
    });
  };

  try {
    const decodedToken = await admin.auth().verifyIdToken(tokenId);
    const { email, name, uid: googleId } = decodedToken;

    let user = await User.findOne({ email });
    if (user) {
      // User already exists, log them in
      const payload = { id: user.id, username: user.username };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: 3600 });

      user.lastLoginAt = new Date();
      await user.save();

      return res.status(200).json({ token, user });
    }

    // Create a new user if not found
    const counter = await Counter.findOneAndUpdate(
      { id: "autovalOrganizer" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const strongPassword = generateStrongPassword();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(strongPassword, salt);

    user = new User({
      id: counter.seq,
      username: name,
      email,
      password: hashedPassword,
      googleId,
      provider: 'google',
      createdAt: new Date(),
      lastLoginAt: new Date()
    });
    await user.save();

    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: 3600 });

    res.status(201).json({ token, user });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

const loginWithGoogle = async (req, res) => {
  const { tokenId } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(tokenId);
    const { email } = decodedToken;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User does not exist' });
    }

    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: 3600 });

    user.lastLoginAt = new Date();
    await user.save();

    res.status(200).json({ token, user });
  } catch (err) {
    console.error('Server error:', err.message); // Log server error
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  SignIn,
  Register,
  signupWithGoogle,
  loginWithGoogle
};
