require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

// Initialize Express & Prisma
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Global Middleware
app.use(cors());
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Import route modules
const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resumes');
const jobRoutes = require('./routes/jobs');
const adminRoutes = require('./routes/admin');

// Bind route scopes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/admin', adminRoutes);

// Base sanity endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date() });
});

// Global 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Endpoint path not found" });
});

// Global central error handler middleware
app.use((err, req, res, next) => {
  console.error("Central error caught:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error occurred on semantic coordinator node"
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`====================================================================`);
  console.log(` APPLYGENIUZ SERVER ONLINE`);
  console.log(` Port: ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`====================================================================`);
});

module.exports = app;
