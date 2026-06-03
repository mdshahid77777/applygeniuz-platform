const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// SUBMIT FEEDBACK
router.post('/', async (req, res, next) => {
  try {
    const { name, email, type, message, role } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Missing required feedback message." });
    }

    const feedback = await prisma.feedback.create({
      data: {
        name,
        email,
        type: type || 'GENERAL_FEEDBACK',
        message,
        role: role || 'STUDENT'
      }
    });

    res.status(201).json({
      message: "Feedback submitted successfully. Thank you!",
      feedback
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
