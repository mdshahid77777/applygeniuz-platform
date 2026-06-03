const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'applygeniuz_super_secret_token';

// SIGNUP ROUTE
router.post('/signup', async (req, res, next) => {
  try {
    const { email, password, name, role, githubUser } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Missing required signup attributes (email, password, name)" });
    }

    // Check existing
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "User with this email already registered" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create User
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: role || 'STUDENT',
        githubUser
      }
    });

    // Sign JWT
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: "User successfully registered",
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (err) {
    next(err);
  }
});

// LOGIN ROUTE
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing required login attributes (email, password)" });
    }

    // Find User
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email credentials" });
    }

    // Match Password
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: "Invalid password credentials" });
    }

    // Sign JWT
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: "Authorization successful",
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
