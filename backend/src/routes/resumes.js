const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { PrismaClient } = require('@prisma/client');
const { analyzeResumeSemantic } = require('../services/semanticEngine');

const prisma = new PrismaClient();

// Multer memory storage configuration (5MB limit)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// PARSE & ANALYZE RESUME UPLOAD
router.post('/parse', upload.single('resume'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No resume file payload uploaded." });
    }

    const { targetSkills } = req.body;
    let parsedSkills = [];
    if (targetSkills) {
      parsedSkills = typeof targetSkills === 'string' ? JSON.parse(targetSkills) : targetSkills;
    }

    const ext = req.file.originalname.split('.').pop().toLowerCase();
    let textContent = "";

    if (ext === 'pdf') {
      const data = await pdfParse(req.file.buffer);
      textContent = data.text;
    } else if (ext === 'txt' || ext === 'md') {
      textContent = req.file.buffer.toString('utf-8');
    } else {
      return res.status(400).json({ error: "Unsupported file extension. Please upload PDF, TXT or MD." });
    }

    // Run semantic analyzer pipeline
    const assessment = analyzeResumeSemantic(textContent, parsedSkills);

    res.status(200).json({
      message: "Resume successfully parsed and scored",
      filename: req.file.originalname,
      extractedTextLength: textContent.length,
      assessment: {
        atsScore: assessment.atsScore,
        bulletScore: assessment.bulletScore,
        readabilityScore: assessment.readabilityScore,
        matchedSkills: assessment.matchedSkills,
        missingSkills: assessment.missingSkills
      },
      rawTextPreview: textContent.slice(0, 800) // preview snippet
    });
  } catch (err) {
    next(err);
  }
});

// SAVE ANALYZED RESUME TO DATABASE (requires simple user id in body for now)
router.post('/save', async (req, res, next) => {
  try {
    const { studentId, title, text, ats, bullet, readability } = req.body;

    if (!studentId || !title || !text) {
      return res.status(400).json({ error: "Missing required attributes (studentId, title, text)" });
    }

    const resume = await prisma.resume.create({
      data: {
        studentId,
        title,
        parsedText: text,
        atsScore: ats || 70,
        bulletScore: bullet || 60,
        readabilityScore: readability || 80
      }
    });

    res.status(201).json({
      message: "Resume saved to talent database profiles",
      resume
    });
  } catch (err) {
    next(err);
  }
});

// GET MY RESUMES (Student records lookup)
router.get('/my-resumes/:studentId', async (req, res, next) => {
  try {
    const { studentId } = req.params;
    
    const resumes = await prisma.resume.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ resumes });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
