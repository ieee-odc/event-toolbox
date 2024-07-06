const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/OrganizerModel');
const Counter = require('../models/CounterModel');
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(require('../event-tool-box-1720171944535-firebase-adminsdk-f6w3g-c723d5d88c.json'))
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

    const newUser = new User({ id:counter.seq,username, email, password });
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();
    const payload = { id: newUser.id };
    const token = jwt.sign(payload, 'secret', { expiresIn: 3600 });

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
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { id: user.id };
    const token = jwt.sign(payload, 'secret', { expiresIn: 3600 });
    const { password: _, ...userData } = user.toObject();

    res.status(200).json({ token, user: userData });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: 'Email is required' });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const resetToken = jwt.sign({ id: user._id.toString() }, 'secret', { expiresIn: '15m' });
    const resetURL = `http://localhost:5173/resetpassword?token=${resetToken}`;
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'boualiamino0123@gmail.com',
        pass: 'kshn mwrg cjyt uzgo',
      },
    });
    const mailOptions = {
      from: 'boualiamino0123@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: `You requested a password reset. Use the following token to reset your password: ${resetToken}`,
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="${resetURL}">${resetURL}</a>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error.message);
        return res.status(500).json({ msg: 'Error sending email' });
      }
      console.log('Email sent:', info.response);
      res.json({ msg: 'Password reset token generated and email sent', resetToken });
    });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
};


const resetPassword = async (req, res) => {
  const { token } = req.query;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, 'secret');
    if (!decoded || !decoded.id) {
      return res.status(400).json({ msg: 'Invalid or expired token' });
    }

    // Convert the ID from the token to a MongoDB ObjectId using the `new` keyword
    const userId = new mongoose.Types.ObjectId(decoded.id);

    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ msg: 'Password reset successfully' });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ msg: 'Token has expired. Please request a new password reset.' });
    }
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
};

const googleAuth = async (req, res) => {
  const { tokenId } = req.body;
  try {
      const decodedToken = await admin.auth().verifyIdToken(tokenId);
      const { email, name, uid: googleId } = decodedToken;

      let user = await User.findOne({ email });
      if (!user) {
          const counter = await Counter.findOneAndUpdate(
              { id: "autovalOrganizer" },
              { $inc: { seq: 1 } },
              { new: true, upsert: true }
          );

          user = new User({ id: counter.seq, username: name, email, googleId });
          await user.save();
      }

      const payload = { id: user.id };
      const token = jwt.sign(payload, 'secret', { expiresIn: 3600 });

      res.status(200).json({ token, user });
  } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
  }
};




module.exports = {
    SignIn,
    Register,
    forgotPassword,
    resetPassword,
    googleAuth
  };