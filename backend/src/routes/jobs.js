const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// JOB DESCRIPTION WEBPAGE SCRAPER (Student side)
router.post('/scrape', async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "Missing required URL parameter." });
    }

    // Connect and fetch html content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to reach career page (HTTP status: ${response.status}).`);
    }

    const html = await response.text();
    let body = html;
    
    // Isolate body tags
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      body = bodyMatch[1];
    }

    // Strip structural boilerplate, styling blocks, scripts, and inputs
    body = body
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
      .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
      .replace(/<nav[^>]*>([\s\S]*?)<\/nav>/gi, '')
      .replace(/<header[^>]*>([\s\S]*?)<\/header>/gi, '')
      .replace(/<footer[^>]*>([\s\S]*?)<\/footer>/gi, '')
      .replace(/<form[^>]*>([\s\S]*?)<\/form>/gi, '');

    // Format list bullets and spacing elements
    body = body
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<br[^>]*>/gi, '\n')
      .replace(/<li>/gi, '\n- ')
      .replace(/<\/li>/gi, '\n');

    // Extract raw text
    let text = body.replace(/<[^>]*>/g, '');

    // Unescape HTML entities
    text = text
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&mdash;/g, '—');

    // Format whitespace lines
    text = text
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .join('\n');

    // Deloitte carrier pruning coordinates
    if (url.includes('deloitte.com')) {
      const deloitteAnchor = text.match(/(Job Description|Role Description|Key Responsibilities|Analyst)[\s\S]*?(About Deloitte|Recruiting tips|Primary Location)/i);
      if (deloitteAnchor) {
        text = deloitteAnchor[0];
      }
    }

    res.status(200).json({
      message: "Job details successfully extracted",
      url,
      description: text.slice(0, 3000)
    });
  } catch (err) {
    next(err);
  }
});

// CREATE JOB POSTING (Recruiter side)
router.post('/create', async (req, res, next) => {
  try {
    const { recruiterId, title, description, targetSkills } = req.body;

    if (!recruiterId || !title || !description) {
      return res.status(400).json({ error: "Missing required job attributes (recruiterId, title, description)" });
    }

    const job = await prisma.job.create({
      data: {
        recruiterId,
        title,
        description,
        targetSkills: targetSkills || []
      }
    });

    res.status(201).json({
      message: "Job posting created successfully",
      job
    });
  } catch (err) {
    next(err);
  }
});

// GET RANKED CANDIDATE LEADERBOARD FOR A JOB
router.get('/:jobId/candidates', async (req, res, next) => {
  try {
    const { jobId } = req.params;
    
    // Find job to get target skills
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({ error: "Job posting not found" });
    }

    // Retrieve candidates with resume data
    const candidates = await prisma.candidate.findMany({
      where: { jobId },
      include: {
        resume: {
          include: {
            student: {
              select: { name: true, email: true, githubUser: true }
            }
          }
        }
      },
      orderBy: {
        semanticMatchScore: 'desc' // Sorted immediately by AI rank
      }
    });

    res.status(200).json({
      job: { id: job.id, title: job.title, targetSkills: job.targetSkills },
      candidatesCount: candidates.length,
      leaderboard: candidates.map(c => ({
        candidateId: c.id,
        name: c.resume.student.name,
        email: c.resume.student.email,
        github: c.resume.student.githubUser,
        atsScore: c.resume.atsScore,
        semanticMatchScore: c.semanticMatchScore,
        bulletScore: c.resume.bulletScore,
        status: c.status,
        notes: c.recruiterNotes,
        appliedAt: c.createdAt
      }))
    });
  } catch (err) {
    next(err);
  }
});

// UPDATE CANDIDATE SELECTION STATUS & NOTES
router.put('/shortlist/:candidateId', async (req, res, next) => {
  try {
    const { candidateId } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Missing status parameter" });
    }

    const updated = await prisma.candidate.update({
      where: { id: candidateId },
      data: {
        status, // APPLIED, REVIEW, SHORTLIST, REJECTED
        recruiterNotes: notes
      }
    });

    res.status(200).json({
      message: "Candidate ranking/status successfully updated",
      candidate: updated
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
