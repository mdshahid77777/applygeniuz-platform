/* ====================================================================
   APPLYGENIUZ - SAAS ORCHESTRATOR & AI WORKFLOW ENGINE
   High-Fidelity Routing, PDF Parser, Document Workspace & Theme Selector
   ==================================================================== */

// Configure PDF.js Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Pre-seeded Candidate Database for Recruiter Workspace (SaaS Pipeline Stages)
let recruiterCandidates = [
  {
    id: 1,
    name: "Alex Rivera",
    title: "Senior Frontend Engineer",
    email: "alex.rivera@gmail.com",
    github: "github.com/alexrivera",
    experience: "7+ Years",
    atsScore: 94,
    roleAlignment: "Strong Match",
    bulletIndex: 92,
    readability: 95,
    status: "Shortlist",
    stage: "Manager Review",
    skills: { frontend: 98, backend: 70, devops: 65, aiData: 50, agile: 90 },
    insights: "Candidate demonstrates Frontend design depth. Experience with React component structure and performance refactoring. Strong bullet descriptions with clear metric results.",
    techStack: ["React.js", "Next.js", "TypeScript", "TailwindCSS", "Jest"]
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    title: "Backend Microservices Lead",
    email: "s.jenkins@cloudtech.io",
    github: "github.com/sjenkins-dev",
    experience: "6+ Years",
    atsScore: 89,
    roleAlignment: "Strong Match",
    bulletIndex: 85,
    readability: 90,
    status: "Shortlist",
    stage: "Technical Screening",
    skills: { frontend: 40, backend: 96, devops: 88, aiData: 70, agile: 80 },
    insights: "Systems scaling credentials. Background in Redis cache layers, Docker orchestration, and PostgreSQL query optimizations.",
    techStack: ["Node.js", "Express", "PostgreSQL", "Redis", "Docker"]
  },
  {
    id: 3,
    name: "Jordan Chen",
    title: "Data Scientist / AI Developer",
    email: "jordan.chen@academic.edu",
    github: "github.com/jchen-ml",
    experience: "4+ Years",
    atsScore: 82,
    roleAlignment: "Moderate Match",
    bulletIndex: 78,
    readability: 82,
    status: "Review",
    stage: "Applied",
    skills: { frontend: 30, backend: 75, devops: 60, aiData: 95, agile: 70 },
    insights: "Machine learning research background. Proficient in PyTorch, model optimization, and NLP script evaluations.",
    techStack: ["Python", "PyTorch", "TensorFlow", "Pandas", "Scikit-Learn"]
  },
  {
    id: 4,
    name: "Priya Patel",
    title: "Fullstack Platform Engineer",
    email: "priya.patel@devbox.net",
    github: "github.com/priyapatel-codes",
    experience: "5+ Years",
    atsScore: 76,
    roleAlignment: "Moderate Match",
    bulletIndex: 72,
    readability: 80,
    status: "Review",
    stage: "Applied",
    skills: { frontend: 82, backend: 85, devops: 75, aiData: 60, agile: 85 },
    insights: "Generalist backend & frontend coverage. Wrote Express APIs and React dashboards. Work history includes deployment workflows.",
    techStack: ["React.js", "Node.js", "MongoDB", "AWS", "Git"]
  }
];

// Semantic dictionary defining technology terms & conceptual tags
const SEMANTIC_VOCABULARY = {
  frontend: {
    label: "Frontend Architecture",
    tags: ["react", "react.js", "next.js", "nextjs", "vue", "angular", "javascript", "typescript", "ui", "ux", "css", "html", "tailwind", "sass", "web", "dom", "frontend", "responsive", "interface", "webpack", "vite"]
  },
  backend: {
    label: "Backend & Microservices",
    tags: ["node", "node.js", "nodejs", "express", "django", "flask", "fastapi", "spring", "springboot", "java", "python", "go", "golang", "ruby", "rails", "php", "sql", "postgres", "postgresql", "mongodb", "nosql", "redis", "graphql", "rest", "api", "microservices", "backend"]
  },
  devops: {
    label: "Cloud Systems & DevOps",
    tags: ["aws", "amazon", "azure", "gcp", "docker", "kubernetes", "k8s", "ci/cd", "ci", "cd", "jenkins", "github actions", "terraform", "ansible", "cloud", "serverless", "nginx", "linux", "git"]
  },
  aiData: {
    label: "AI, NLP & Data Science",
    tags: ["machine learning", "ml", "artificial intelligence", "ai", "deep learning", "nlp", "llm", "openai", "transformers", "tensorflow", "pytorch", "keras", "pandas", "numpy", "scikit-learn", "data science", "analytics"]
  },
  agile: {
    label: "Agile & Product Delivery",
    tags: ["scrum", "agile", "jira", "sprint", "kanban", "product management", "leadership", "mentoring", "collaboration", "scale", "performance", "optimization", "metrics"]
  }
};

// Global State
let studentChart = null;
let recruiterRadarChart = null;
let selectedCandidateId = null;
let generatedResumeContent = "";
let generatedCoverContent = "";
let currentDocTab = "resume"; // "resume" or "cover"

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initAppRouter();
  initStudentWorkspace();
  initRecruiterWorkspace();
  
  // Initialize multi-role enterprise workflows
  initAuthSystem();
  initSavedWorkspaces();
  initAdminControls();
  
  // Render monochrome icons initially
  if (window.lucide) {
    lucide.createIcons();
  }

  // Set Footer Year
  const footerYear = document.getElementById('footerYear');
  if (footerYear) footerYear.textContent = new Date().getFullYear();
  
  // Initialize dynamic mouse parallax tilt effects on premium cards
  initCardParallax();
});

/* ====================================================================
   1. PERSISTENT THEME CONTROLLER (CampusLoom Style)
   ==================================================================== */

function initThemeEngine() {
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('applygeniuz-theme') || 'dark';
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const activeTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
    applyTheme(activeTheme);
  });
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
  } else {
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
  }
  localStorage.setItem('applygeniuz-theme', theme);
  
  // Re-draw chart grids to fit theme backgrounds
  if (studentChart) runStudentSemanticAssessment();
}

/* ====================================================================
   2. APP ROUTER & VIEW ORCHESTRATION
   ==================================================================== */

function initAppRouter() {
  const toggleButtons = document.querySelectorAll('#modeSelector .toggle-option');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetView = btn.getAttribute('data-view');
      switchView(targetView);
    });
  });
}

function switchView(viewName) {
  const toggleButtons = document.querySelectorAll('#modeSelector .toggle-option');
  toggleButtons.forEach(btn => {
    if (btn.getAttribute('data-view') === viewName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const views = document.querySelectorAll('.page-view');
  views.forEach(v => {
    v.classList.remove('active');
  });

  const activeView = document.getElementById(`${viewName}View`);
  if (activeView) {
    activeView.classList.add('active');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (viewName === 'recruiter') {
    renderLeaderboard();
  }
  
  // Re-init Lucide SVGs for new DOM views
  if (window.lucide) {
    lucide.createIcons();
  }
  
  showToast(`Navigated to ${viewName.toUpperCase()} View`, 'success');
}

/* ====================================================================
   3. TOAST NOTIFICATION UTILITY
   ==================================================================== */

function showToast(message, type = 'success') {
  const toast = document.getElementById('appToast');
  const toastMsg = document.getElementById('toastMsg');
  
  if (!toast) return;

  toastMsg.textContent = message;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* ====================================================================
   4. CLIENT-SIDE PDF EXTRACTOR (PDF.JS)
   ==================================================================== */

async function extractTextFromPdf(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const doc = await loadingTask.promise;
    
    let textOut = "";
    for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
      const page = await doc.getPage(pageNum);
      const textContext = await page.getTextContent();
      const pageStrings = textContext.items.map(item => item.str);
      textOut += pageStrings.join(" ") + "\n\n";
    }
    return textOut;
  } catch (err) {
    console.error("PDF.js extraction failed:", err);
    throw new Error("Text parsing failed. Upload standard TXT/MD files or check format.");
  }
}

/* ====================================================================
   5. NOTION-STYLE DOCUMENT EDITOR WORKSPACE
   ==================================================================== */

function renderActiveA4Document() {
  const page = document.getElementById('a4DocumentContent');
  if (!page) return;

  if (currentDocTab === 'resume') {
    page.innerHTML = generatedResumeContent || `
      <div style="text-align:center; padding-top:8rem; color:var(--text-tertiary);">
        <i data-lucide="file-text" class="icon-lg" style="margin:0 auto 1rem; opacity:0.3; display:block;"></i>
        <h3 style="font-weight:600; font-size:1rem; color:#111827;">Optimized Resume Preview</h3>
        <p style="font-size:0.8rem; max-width:280px; margin:0.5rem auto;">Run the assessment dashboard first to compile printable resume credentials.</p>
      </div>
    `;
  } else {
    page.innerHTML = generatedCoverContent || `
      <div style="text-align:center; padding-top:8rem; color:var(--text-tertiary);">
        <i data-lucide="mail" class="icon-lg" style="margin:0 auto 1rem; opacity:0.3; display:block;"></i>
        <h3 style="font-weight:600; font-size:1rem; color:#111827;">Tailored Cover Letter Preview</h3>
        <p style="font-size:0.8rem; max-width:280px; margin:0.5rem auto;">Run the assessment dashboard first to compile a tailored cover letter.</p>
      </div>
    `;
  }
  
  if (window.lucide) {
    lucide.createIcons();
  }
}

function triggerDocxExport(filename, htmlContent) {
  const converted = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <title>Document Export</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5; padding: 1in; }
        h1 { font-size: 18pt; font-weight: bold; margin-bottom: 6pt; }
        h2 { font-size: 14pt; font-weight: bold; margin-top: 12pt; margin-bottom: 4pt; }
        p { margin-bottom: 8pt; }
        ul { margin-left: 18pt; margin-bottom: 8pt; }
        li { margin-bottom: 3pt; }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `.trim();

  const blob = new Blob(['\ufeff' + converted], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  showToast(`Downloaded Microsoft Word DOCX: ${filename}`, 'success');
}

function triggerPrintTarget() {
  const content = document.getElementById('a4DocumentContent').innerHTML;
  const printArea = document.getElementById('printTargetArea');
  if (!printArea) return;

  printArea.innerHTML = content;
  window.print();
  printArea.innerHTML = "";
}

/* ====================================================================
   6. ANONYMOUS HUMAN ENGINEERING COPYWRITER WRITING PROTOCOL
   ==================================================================== */

function optimizeBulletText(bulletText, matchedSkills, index) {
  let text = bulletText.trim();
  if (!text) return "";
  
  let textLower = text.toLowerCase();
  const hasMetric = /\d+%|\d+\s*x|\d+\s*ms|\b(million|billion|thousand)\b/i.test(text);
  
  const actionVerbs = ["engineered", "developed", "architected", "optimized", "scaled", "reduced", "led", "managed", "boosted", "implemented", "leveraged", "pioneered", "designed", "built", "spearheaded", "accelerated", "automated", "created", "integrated", "streamlined", "transformed"];
  const passiveKeywords = [/^(i was\s+)?responsible for\s+/i, /^(i\s+)?worked on\s+/i, /^(i\s+)?helped\s+/i, /^(i\s+)?assisted in\s+/i, /^(i\s+)?created\s+/i, /^(i\s+)?made\s+/i, /^(i\s+)?managed\s+/i, /^(i\s+)?built\s+/i, /^(i\s+)?fixed\s+/i, /^[•\s*-]+/];
  
  let cleanedText = text;
  for (let regex of passiveKeywords) {
    cleanedText = cleanedText.replace(regex, "");
  }
  cleanedText = cleanedText.charAt(0).toUpperCase() + cleanedText.slice(1);
  
  let finalVerb = "Developed";
  const verbMatch = actionVerbs.find(v => cleanedText.toLowerCase().startsWith(v));
  if (verbMatch) {
    finalVerb = verbMatch.charAt(0).toUpperCase() + verbMatch.slice(1);
    cleanedText = cleanedText.replace(new RegExp(`^${verbMatch}\\s*`, 'i'), "");
  } else {
    const choices = ["Engineered", "Developed", "Optimized", "Architected", "Spearheaded", "Automated"];
    finalVerb = choices[index % choices.length];
  }
  
  let injectedTech = "";
  if (matchedSkills && matchedSkills.length > 0) {
    const hasTech = matchedSkills.some(t => textLower.includes(t.toLowerCase()));
    if (!hasTech) {
      const techToInject = matchedSkills[index % matchedSkills.length];
      injectedTech = ` utilizing ${techToInject}`;
    }
  }
  
  let metricSuffix = "";
  if (!hasMetric) {
    const metrics = [
      ", reducing load latency by 32%",
      ", increasing database query performance by 40%",
      ", boosting developer pipeline efficiency by 25%",
      ", expanding unit test coverage to 88%",
      ", reducing production API errors by 18%",
      ", improving UI component rendering speed by 35%"
    ];
    metricSuffix = metrics[index % metrics.length];
  }
  
  let result = `${finalVerb} ${cleanedText.replace(/\.$/, '')}${injectedTech}${metricSuffix}.`;
  result = result.replace(/\.\.+/g, '.').replace(/\s+/g, ' ');
  return result;
}

function generateHumanResume(name, email, github, matched, jobText, resumeText = "") {
  const cleanInput = resumeText.trim();
  const isDefault = !cleanInput || cleanInput.includes("John Doe") || cleanInput.length < 50;

  let parsedName = name;
  let parsedEmail = email;
  let parsedGithub = github;
  let parsedSkills = [];
  let parsedExperience = [];
  let parsedEducation = [];
  let parsedProjects = [];

  let targetRoleName = "Software Engineer";
  const jobLower = jobText ? jobText.toLowerCase() : "";
  if (jobText) {
    const titleLines = jobText.split('\n');
    if (titleLines[0] && titleLines[0].length < 60 && !titleLines[0].includes(':')) {
      targetRoleName = titleLines[0].trim();
    } else {
      if (jobLower.includes("frontend")) targetRoleName = "Frontend Engineer";
      else if (jobLower.includes("backend")) targetRoleName = "Backend Engineer";
      else if (jobLower.includes("data scientist") || jobLower.includes("machine learning")) targetRoleName = "Data Scientist / AI Engineer";
      else if (jobLower.includes("devops") || jobLower.includes("cloud")) targetRoleName = "DevOps Cloud Engineer";
    }
  }

  // Compile tailored summary
  let summaryText = "";
  if (matched && matched.length > 0) {
    summaryText = `Performance-focused developer specializing in ${targetRoleName} tracks. Proficient in designing and scaling applications utilizing ${matched.slice(0, 5).join(', ')}. Demonstrated success refactoring project architectures, automating test suites, and driving quantitative latency reductions.`;
  } else {
    summaryText = `Dedicated and analytical Developer specializing in modern software architectures. Accomplished at building clean, structured applications, collaborating across agile sprint cycles, and maintaining comprehensive code coverages.`;
  }

  if (isDefault) {
    return getPremiumDefaultResume(parsedName, parsedEmail, parsedGithub, matched, targetRoleName, summaryText);
  }

  try {
    const lines = cleanInput.split('\n');
    let currentSection = 'header';
    let currentJob = null;
    let currentProject = null;
    let rawSkillTags = [];

    for (let line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const lower = trimmed.toLowerCase();
      
      if (lower.startsWith('experience') || lower.startsWith('work experience') || lower.startsWith('employment') || lower.startsWith('professional experience') || lower.startsWith('work history')) {
        currentSection = 'experience';
        continue;
      } else if (lower.startsWith('skills') || lower.startsWith('technical skills') || lower.startsWith('core competencies') || lower.startsWith('skills & tools')) {
        currentSection = 'skills';
        continue;
      } else if (lower.startsWith('education') || lower.startsWith('academic') || lower.startsWith('academic history')) {
        currentSection = 'education';
        continue;
      } else if (lower.startsWith('projects') || lower.startsWith('personal projects') || lower.startsWith('academic projects')) {
        currentSection = 'projects';
        continue;
      }

      if (currentSection === 'header') {
        if (!parsedEmail && trimmed.includes('@')) {
          const match = trimmed.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
          if (match) parsedEmail = match[0];
        }
      } else if (currentSection === 'skills') {
        const parts = trimmed.split(':');
        const skillListText = parts.length > 1 ? parts[1] : parts[0];
        const tags = skillListText.split(',').map(s => s.trim().replace(/^[•\s*-]+/, '')).filter(s => s.length > 0);
        rawSkillTags.push(...tags);
      } else if (currentSection === 'experience') {
        const isBullet = trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•');
        if (!isBullet) {
          if (currentJob) {
            parsedExperience.push(currentJob);
          }
          let title = trimmed;
          let dates = "";
          const dateMatch = trimmed.match(/\b(19|20)\d{2}\s*[-–—]\s*(Present|\b(19|20)\d{2})/i);
          if (dateMatch) {
            dates = dateMatch[0];
            title = trimmed.replace(dates, '').trim();
          }
          title = title.replace(/^[,\s|–—-]+|[,\s|–—-]+$/g, '').trim();
          currentJob = {
            title: title || "Software Engineer",
            dates: dates || "2024 - Present",
            bullets: []
          };
        } else if (currentJob) {
          const bulletText = trimmed.substring(1).trim();
          if (bulletText) {
            currentJob.bullets.push(optimizeBulletText(bulletText, matched, currentJob.bullets.length));
          }
        }
      } else if (currentSection === 'projects') {
        const isBullet = trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•');
        if (!isBullet) {
          if (currentProject) {
            parsedProjects.push(currentProject);
          }
          currentProject = { name: trimmed, bullets: [] };
        } else if (currentProject) {
          const bulletText = trimmed.substring(1).trim();
          if (bulletText) {
            currentProject.bullets.push(optimizeBulletText(bulletText, matched, currentProject.bullets.length));
          }
        }
      } else if (currentSection === 'education') {
        parsedEducation.push(trimmed.replace(/^[•\s*-]+/, ''));
      }
    }

    if (currentJob) parsedExperience.push(currentJob);
    if (currentProject) parsedProjects.push(currentProject);

    if (rawSkillTags.length > 0) {
      parsedSkills = categorizeSkills(rawSkillTags);
    } else {
      parsedSkills = categorizeSkills(matched);
    }

  } catch (err) {
    console.error("Client-side resume parser failed:", err);
  }

  return renderParsedResume(parsedName, parsedEmail, parsedGithub, parsedSkills, parsedExperience, parsedEducation, parsedProjects, targetRoleName, summaryText);
}

function categorizeSkills(skillTags) {
  const categories = {
    "Languages": [],
    "Frameworks": [],
    "Databases": [],
    "Platforms": [],
    "Tools": []
  };

  const vocabularyMap = {
    "javascript": "Languages", "typescript": "Languages", "python": "Languages", "go": "Languages", "golang": "Languages", "java": "Languages", "ruby": "Languages", "php": "Languages", "html": "Languages", "css": "Languages", "sql": "Languages", "c++": "Languages",
    "react": "Frameworks", "react.js": "Frameworks", "next.js": "Frameworks", "nextjs": "Frameworks", "vue": "Frameworks", "angular": "Frameworks", "express": "Frameworks", "express.js": "Frameworks", "django": "Frameworks", "flask": "Frameworks", "fastapi": "Frameworks", "spring": "Frameworks", "springboot": "Frameworks", "rails": "Frameworks", "tailwind": "Frameworks", "sass": "Frameworks",
    "postgres": "Databases", "postgresql": "Databases", "mongodb": "Databases", "nosql": "Databases", "redis": "Databases", "mysql": "Databases", "sqlite": "Databases",
    "aws": "Platforms", "amazon": "Platforms", "azure": "Platforms", "gcp": "Platforms", "cloud": "Platforms", "serverless": "Platforms",
    "docker": "Tools", "kubernetes": "Tools", "k8s": "Tools", "git": "Tools", "jenkins": "Tools", "webpack": "Tools", "vite": "Tools", "jest": "Tools", "npm": "Tools"
  };

  for (let tag of skillTags) {
    const clean = tag.toLowerCase().trim();
    if (!clean) continue;
    let categorized = false;
    
    if (vocabularyMap[clean]) {
      categories[vocabularyMap[clean]].push(tag);
      categorized = true;
    } else {
      for (const [key, cat] of Object.entries(vocabularyMap)) {
        if (clean.includes(key) || key.includes(clean)) {
          categories[cat].push(tag);
          categorized = true;
          break;
        }
      }
    }
    
    if (!categorized) {
      categories["Tools"].push(tag);
    }
  }

  const result = [];
  for (const [cat, items] of Object.entries(categories)) {
    if (items.length > 0) {
      const uniqueItems = [...new Set(items)];
      result.push({ category: cat, items: uniqueItems });
    }
  }
  return result;
}

function renderParsedResume(name, email, github, skills, experience, education, projects, headline = "", summary = "") {
  let summaryMarkup = "";
  if (summary) {
    summaryMarkup = `
      <div style="margin-bottom: 1.4rem;">
        <h2 style="font-size: 10pt; font-weight: 700; text-transform: uppercase; color: #111827; border-bottom: 1px solid #111827; padding-bottom: 3px; margin-bottom: 0.5rem; letter-spacing: 0.05em;">Professional Summary</h2>
        <p style="font-size: 9pt; line-height: 1.5; color: #374151; margin: 0; text-align: justify;">${summary}</p>
      </div>
    `;
  }

  let skillsMarkup = "";
  if (skills && skills.length > 0) {
    skillsMarkup = `
      <div style="margin-bottom: 1.4rem;">
        <h2 style="font-size: 10pt; font-weight: 700; text-transform: uppercase; color: #111827; border-bottom: 1px solid #111827; padding-bottom: 3px; margin-bottom: 0.6rem; letter-spacing: 0.05em;">Technical Skills</h2>
        <div style="font-size: 9pt; line-height: 1.5; color: #374151;">
          ${skills.map(s => `
            <div style="margin-bottom: 0.25rem;">
              <strong style="color: #111827;">${s.category}:</strong> ${s.items.join(', ')}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  let expMarkup = "";
  if (experience && experience.length > 0) {
    expMarkup = `
      <div style="margin-bottom: 1.4rem;">
        <h2 style="font-size: 10pt; font-weight: 700; text-transform: uppercase; color: #111827; border-bottom: 1px solid #111827; padding-bottom: 3px; margin-bottom: 0.6rem; letter-spacing: 0.05em;">Experience</h2>
        ${experience.map(job => `
          <div style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; font-size: 9.5pt; font-weight: 700; color: #111827; margin-bottom: 0.25rem;">
              <span style="font-weight: 700;">${job.title}</span>
              <span style="font-size: 9pt; font-weight: 500; color: #4b5563;">${job.dates}</span>
            </div>
            ${job.bullets.length > 0 ? `
              <ul style="margin: 0; padding-left: 1.25rem; font-size: 9pt; color: #374151; line-height: 1.5; display: flex; flex-direction: column; gap: 0.25rem;">
                ${job.bullets.map(b => `<li>${b}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  let projMarkup = "";
  if (projects && projects.length > 0) {
    projMarkup = `
      <div style="margin-bottom: 1.4rem;">
        <h2 style="font-size: 10pt; font-weight: 700; text-transform: uppercase; color: #111827; border-bottom: 1px solid #111827; padding-bottom: 3px; margin-bottom: 0.6rem; letter-spacing: 0.05em;">Projects</h2>
        ${projects.map(proj => `
          <div style="margin-bottom: 0.8rem;">
            <div style="font-size: 9.5pt; font-weight: 700; color: #111827; margin-bottom: 0.2rem;">${proj.name}</div>
            ${proj.bullets.length > 0 ? `
              <ul style="margin: 0; padding-left: 1.25rem; font-size: 9pt; color: #374151; line-height: 1.5; display: flex; flex-direction: column; gap: 0.25rem;">
                ${proj.bullets.map(b => `<li>${b}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  let eduMarkup = "";
  if (education && education.length > 0) {
    eduMarkup = `
      <div style="margin-bottom: 1.4rem;">
        <h2 style="font-size: 10pt; font-weight: 700; text-transform: uppercase; color: #111827; border-bottom: 1px solid #111827; padding-bottom: 3px; margin-bottom: 0.6rem; letter-spacing: 0.05em;">Education</h2>
        <ul style="margin: 0; padding-left: 1.25rem; font-size: 9pt; color: #374151; line-height: 1.5; display: flex; flex-direction: column; gap: 0.25rem;">
          ${education.map(edu => `<li>${edu}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  const githubLink = github ? `github.com/${github}` : '';
  const emailLink = email ? email : '';
  const links = [emailLink, githubLink].filter(l => l.length > 0).join(' &nbsp;|&nbsp; ');

  const headlineMarkup = headline ? `<div style="font-size: 11pt; font-weight: 700; text-transform: uppercase; color: #4b5563; margin-top: 0.25rem; letter-spacing: 0.02em;">${headline}</div>` : "";

  return `
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1f2937; padding: 1.5rem 1rem; line-height: 1.5; max-width: 800px; margin: 0 auto; text-align: left; background: #ffffff; border-radius: 4px;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 1.6rem; padding-bottom: 1rem; border-bottom: 2px solid #111827;">
        <h1 style="font-size: 20pt; font-weight: 800; text-transform: uppercase; margin: 0; color: #111827; letter-spacing: -0.02em; line-height: 1.1;">${name.toUpperCase()}</h1>
        ${headlineMarkup}
        <p style="font-size: 9pt; color: #4b5563; font-weight: 500; margin: 0.5rem 0 0 0; word-break: break-all;">
          ${links}
        </p>
      </div>

      <!-- Summary -->
      ${summaryMarkup}

      <!-- Skills -->
      ${skillsMarkup}

      <!-- Experience -->
      ${expMarkup}

      <!-- Projects -->
      ${projMarkup}

      <!-- Education -->
      ${eduMarkup}
    </div>
  `.trim();
}

function getPremiumDefaultResume(name, email, github, matched, targetRoleName = "Software Engineer", summaryText = "") {
  const languages = (matched && matched.length > 0) ? matched.slice(0, 5).join(', ') : 'React.js, TypeScript, Node.js, Express, JavaScript';
  
  const skills = [
    { category: "Languages & Frameworks", items: [languages, "HTML5/CSS3"] },
    { category: "Databases & Tools", items: ["PostgreSQL", "Redis", "Docker", "Git", "Jest (unit testing)"] },
    { category: "Platforms", items: ["AWS", "GitHub Actions (CI/CD)"] }
  ];

  const experience = [
    {
      title: "Software Engineer — TechStack Solutions",
      dates: "2024 – Present",
      bullets: [
        "Developed responsive front-end dashboard panels using React.js and TypeScript, reducing component load latency by 35%.",
        "Built resilient REST endpoints using Express and Node.js; designed a Redis caching strategy to optimize query response times.",
        "Created automated testing suites with Jest, facilitating seamless continuous integration workflows during production releases."
      ]
    },
    {
      title: "Associate Developer — CloudDev Labs",
      dates: "2023 – 2024",
      bullets: [
        "Constructed user interface components and layouts with clean HTML, CSS, and React, maintaining responsive compatibility.",
        "Implemented database indexing scripts on MongoDB clusters, improving database retrieval latency.",
        "Assisted system administration in deploying local containers using Docker templates."
      ]
    }
  ];

  const education = [
    "Bachelor of Science in Computer Science — Global University of Technology (2020 – 2024)"
  ];

  const projects = [
    {
      name: "ApplyGeniuz Alignment Checker Node",
      bullets: [
        "Developed a client-side semantic alignment analyzer that compares resume experience vectors against job requirements.",
        "Configured file extraction parsing streams using local PDF buffers, eliminating external middleware dependencies."
      ]
    }
  ];

  const role = targetRoleName || "Software Engineer";
  const summary = summaryText || `Performance-focused Software Engineer specializing in full stack architectures. Proficient in designing and scaling applications utilizing ${languages}.`;

  return renderParsedResume(name, email, github, skills, experience, education, projects, role, summary);
}

function generateHumanCover(name, email, github, matched, jobText, resumeText = "") {
  const dateString = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  let targetRole = "Software Engineer";
  if (jobText) {
    const lines = jobText.split('\n');
    for (let line of lines) {
      if (line.toLowerCase().includes('looking for a') || line.toLowerCase().includes('seeking a')) {
        const match = line.match(/(?:looking for a|seeking a)\s+([a-zA-Z\s]+?)(?:\s+with|\s+to|\s+who|\.|$)/i);
        if (match && match[1]) {
          targetRole = match[1].trim();
          break;
        }
      } else if (line.toLowerCase().includes('role:') || line.toLowerCase().includes('position:')) {
        const match = line.match(/(?:role|position):\s*([a-zA-Z\s]+?)(?:\.|$)/i);
        if (match && match[1]) {
          targetRole = match[1].trim();
          break;
        }
      }
    }
  }

  // Extract candidate top skills dynamically from matched tags or resume text
  const skillsList = (matched && matched.length > 0) ? matched : ["React.js", "TypeScript", "Node.js", "Express", "REST APIs"];
  const topSkills = skillsList.slice(0, 4).join(', ');

  // Look for any mention of a company in the experience section to add a high degree of personalization
  let recentCompany = "";
  if (resumeText) {
    const expMatch = resumeText.match(/(?:at|company|solutions|labs|technologies|systems)\s+([A-Z][a-zA-Z0-9\s]+?)(?:\b(20\d{2})|Present|\n|$)/i);
    if (expMatch && expMatch[1]) {
      const companyName = expMatch[1].trim();
      if (companyName.length > 2 && companyName.length < 30) {
        recentCompany = `during my time at ${companyName}`;
      }
    }
  }

  const companyMention = recentCompany ? ` ${recentCompany}` : "";

  return `
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; padding: 1rem 0.5rem; line-height: 1.5; font-size: 10pt; max-width: 800px; margin: 0 auto; text-align: left;">
      <!-- Contact Info Header -->
      <div style="margin-bottom: 2rem; border-bottom: 1px solid #cbd5e1; padding-bottom: 1.25rem;">
        <strong style="font-size: 16pt; color: #0f172a; text-transform: uppercase; letter-spacing: -0.02em;">${name}</strong><br/>
        <span style="color: #64748b; font-size: 9.5pt; letter-spacing: 0.01em;">${email} &nbsp;|&nbsp; github.com/${github || 'candidate'}</span>
      </div>

      <!-- Date & Subject -->
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; font-size: 9.5pt; color: #64748b;">
        <span>${dateString}</span>
        <span style="font-weight: 600; color: #0f172a;">Subject: Application for ${targetRole}</span>
      </div>

      <!-- Recipient Block -->
      <div style="margin-bottom: 1.5rem; color: #0f172a; font-weight: 500; font-size: 9.5pt;">
        Hiring Team<br/>
        Engineering Recruitment Department
      </div>

      <!-- Salutation -->
      <p style="margin-bottom: 1rem; color: #0f172a; font-weight: 600;">
        Dear Hiring Team,
      </p>

      <!-- Content -->
      <p style="margin-bottom: 1.25rem; color: #334155; text-align: justify;">
        I noticed your opening for a ${targetRole} and wanted to reach out. I have spent the past few years building robust software systems, focusing on clean engineering patterns, performance optimization, and reliable technical execution. Based on your team's requirements, I believe my background aligns well with the objectives you have set.
      </p>

      <p style="margin-bottom: 1.25rem; color: #334155; text-align: justify;">
        My hands-on experience centers around ${topSkills}. In my recent projects${companyMention}, I have prioritized building performant solutions—focusing on reducing latency, improving system structure, and writing maintainable code. I enjoy solving architectural challenges and collaborating with cross-functional engineering teams to deliver stable, high-impact features.
      </p>

      <p style="margin-bottom: 1.25rem; color: #334155; text-align: justify;">
        I aim to bring a practical, detail-oriented approach to your engineering team. I welcome the opportunity to learn more about your current technical priorities and discuss how my skills could support your development objectives.
      </p>

      <p style="margin-bottom: 2rem; color: #334155;">
        Thank you for your time and consideration.
      </p>

      <div>
        Best regards,<br/><br/>
        <strong style="color: #0f172a;">${name}</strong>
      </div>
    </div>
  `.trim();
}

/* ====================================================================
   7. STUDENT WORKSPACE FUNCTIONALITY
   ==================================================================== */

function initStudentWorkspace() {
  const uploadZone = document.getElementById('studentUploadZone');
  const fileInput = document.getElementById('studentFileInput');
  const fileLabel = document.getElementById('studentFileLabel');
  const analyzeBtn = document.getElementById('studentAnalyzeBtn');
  const gitBtn = document.getElementById('studentGitBtn');

  // Drag-and-drop
  uploadZone.addEventListener('click', () => fileInput.click());
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
  uploadZone.addEventListener('drop', async (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
      await handleStudentFile(e.dataTransfer.files[0]);
    }
  });
  fileInput.addEventListener('change', async (e) => {
    if (e.target.files.length) {
      await handleStudentFile(e.target.files[0]);
    }
  });

  // Analyze Click
  analyzeBtn.addEventListener('click', () => {
    runStudentSemanticAssessment();
  });

  // Git Sync
  gitBtn.addEventListener('click', () => {
    syncStudentGitHub();
  });

  // A4 document workspace tabs
  document.getElementById('tabResume').addEventListener('click', (e) => {
    document.getElementById('tabResume').classList.add('active');
    document.getElementById('tabCover').classList.remove('active');
    currentDocTab = "resume";
    renderActiveA4Document();
  });
  
  document.getElementById('tabCover').addEventListener('click', (e) => {
    document.getElementById('tabCover').classList.add('active');
    document.getElementById('tabResume').classList.remove('active');
    currentDocTab = "cover";
    renderActiveA4Document();
  });

  // Toolbar action listeners
  document.getElementById('docBtnRegen').addEventListener('click', () => {
    showToast("Re-evaluating content...", "success");
    runStudentSemanticAssessment();
  });
  
  document.getElementById('docBtnCopy').addEventListener('click', () => {
    const docPage = document.getElementById('a4DocumentContent');
    navigator.clipboard.writeText(docPage.innerText);
    showToast("Document text copied to clipboard!", "success");
  });
  
  document.getElementById('docBtnPrint').addEventListener('click', () => {
    triggerPrintTarget();
  });
  
  document.getElementById('docBtnPdf').addEventListener('click', () => {
    showToast("Opening print dialogue for vector PDF export...", "success");
    triggerPrintTarget();
  });
  
  document.getElementById('docBtnDocx').addEventListener('click', () => {
    const cleanName = getStudentNameFromInput();
    const docPage = document.getElementById('a4DocumentContent');
    const filename = currentDocTab === 'resume' ? `${cleanName}_optimized_resume.docx` : `${cleanName}_tailored_cover_letter.docx`;
    triggerDocxExport(filename, docPage.innerHTML);
  });

  // Job Description Selector Tabs (Manual Paste vs Import from URL)
  const tabJdManual = document.getElementById('tabJdManual');
  const tabJdUrl = document.getElementById('tabJdUrl');
  const jdManualContainer = document.getElementById('jdManualContainer');
  const jdUrlContainer = document.getElementById('jdUrlContainer');
  
  if (tabJdManual && tabJdUrl && jdManualContainer && jdUrlContainer) {
    tabJdManual.addEventListener('click', () => {
      tabJdManual.classList.add('active');
      tabJdUrl.classList.remove('active');
      jdManualContainer.style.display = 'block';
      jdUrlContainer.style.display = 'none';
    });
    
    tabJdUrl.addEventListener('click', () => {
      tabJdUrl.classList.add('active');
      tabJdManual.classList.remove('active');
      jdUrlContainer.style.display = 'block';
      jdManualContainer.style.display = 'none';
    });
  }
  
  // Job URL Import Handler
  const studentJobUrlBtn = document.getElementById('studentJobUrlBtn');
  const studentJobUrlInput = document.getElementById('studentJobUrlInput');
  const studentJobText = document.getElementById('studentJobText');
  const jobImportLoader = document.getElementById('jobImportLoader');
  const jobImportLoaderTitle = document.getElementById('jobImportLoaderTitle');
  const jobImportLoaderSubtitle = document.getElementById('jobImportLoaderSubtitle');
  
  if (studentJobUrlBtn && studentJobUrlInput && studentJobText && jobImportLoader) {
    studentJobUrlBtn.addEventListener('click', async () => {
      const urlValue = studentJobUrlInput.value.trim();
      
      if (!urlValue) {
        showToast("Please enter a valid job description URL.", "error");
        return;
      }
      
      // Basic URL verification
      if (!urlValue.startsWith('http://') && !urlValue.startsWith('https://')) {
        showToast("Please enter a valid URL starting with http:// or https://", "error");
        return;
      }
      
      // Show Loader & Disable input/button to prevent double-triggering
      jobImportLoader.style.display = 'flex';
      studentJobUrlBtn.disabled = true;
      studentJobUrlInput.disabled = true;
      
      if (jobImportLoaderTitle) jobImportLoaderTitle.textContent = "Fetching job description...";
      if (jobImportLoaderSubtitle) jobImportLoaderSubtitle.textContent = "Connecting to career portal...";
      
      // Cycle intelligent loading messages to feel premium and startup-grade
      let progressStep = 0;
      const loaderProgressInterval = setInterval(() => {
        progressStep++;
        if (!jobImportLoaderTitle || !jobImportLoaderSubtitle) return;
        
        switch(progressStep) {
          case 1:
            jobImportLoaderTitle.textContent = "Parsing HTML structures...";
            jobImportLoaderSubtitle.textContent = "Scraping career page content...";
            break;
          case 2:
            jobImportLoaderTitle.textContent = "Extracting readable content...";
            jobImportLoaderSubtitle.textContent = "Removing navigation and boilerplate...";
            break;
          case 3:
            jobImportLoaderTitle.textContent = "Cleaning text data...";
            jobImportLoaderSubtitle.textContent = "Optimizing recruiter readability...";
            break;
          default:
            jobImportLoaderTitle.textContent = "Processing description text...";
            jobImportLoaderSubtitle.textContent = "Finalizing structural content formatting...";
            break;
        }
      }, 1000);
      
      try {
        const response = await fetch('http://localhost:5000/api/jobs/scrape', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ url: urlValue })
        });
        
        clearInterval(loaderProgressInterval);
        
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.description) {
          // Success: auto-fill, toast, switch tab, hide loader
          studentJobText.value = data.description;
          showToast("Job description imported successfully!", "success");
          
          // Switch back to Manual Paste tab so user can review/edit
          if (tabJdManual && tabJdUrl && jdManualContainer && jdUrlContainer) {
            tabJdManual.click();
          }
          
          // Clear URL input
          studentJobUrlInput.value = "";
        } else {
          throw new Error("No description extracted from the career page.");
        }
      } catch (err) {
        clearInterval(loaderProgressInterval);
        console.error("URL Import Error:", err);
        showToast("Could not extract job description. Please paste the description manually.", "error");
      } finally {
        jobImportLoader.style.display = 'none';
        studentJobUrlBtn.disabled = false;
        studentJobUrlInput.disabled = false;
      }
    });
  }
}

function getStudentNameFromInput() {
  const resumeText = document.getElementById('studentResumeText').value;
  const nameMatch = resumeText.match(/^([A-Z][a-z]+)\s+([A-Z][a-z]+)/);
  return nameMatch ? `${nameMatch[1]}_${nameMatch[2]}` : "Candidate";
}

async function handleStudentFile(file) {
  const statusEl = document.getElementById('studentStatus');
  const resumeTextarea = document.getElementById('studentResumeText');
  const fileLabel = document.getElementById('studentFileLabel');
  
  statusEl.className = "status-indicator loading";
  statusEl.textContent = "Parsing PDF...";
  showToast("Extracting PDF text via client nodes...", "success");

  try {
    const ext = file.name.split('.').pop().toLowerCase();
    let text = "";
    
    if (ext === 'pdf') {
      text = await extractTextFromPdf(file);
    } else if (ext === 'txt' || ext === 'md') {
      text = await file.text();
    } else {
      throw new Error("Unsupported format. Please upload PDF, TXT or MD.");
    }
    
    resumeTextarea.value = text.trim();
    fileLabel.textContent = `File loaded: ${file.name}`;
    fileLabel.style.display = "block";
    
    const validationErrors = validateResumeText(text);
    if (validationErrors.length > 0) {
      renderValidationErrorPanel(validationErrors);
      return;
    }
    
    statusEl.className = "status-indicator ready";
    statusEl.textContent = "Parse Complete";
    showToast("Resume credentials loaded successfully!", "success");
  } catch (err) {
    statusEl.className = "status-indicator ready";
    statusEl.textContent = "Parser Faulted";
    showToast(err.message, "error");
    fileLabel.style.display = "none";
  }
}

function computeSemanticCompliance(resumeText, jobText) {
  const resumeLower = resumeText.toLowerCase();
  const jobLower = jobText.toLowerCase();
  
  let scoreReport = {
    atsScore: null,
    bulletScore: null,
    readability: null,
    fitScore: null,
    matchedTags: [],
    missingTags: [],
    radarSkills: { frontend: 0, backend: 0, devops: 0, aiData: 0, agile: 0 }
  };

  if (!resumeText.trim()) return scoreReport;

  // 1. Compatibility Score & Keywords Overlap Check
  let jdTags = [];
  for (const [key, category] of Object.entries(SEMANTIC_VOCABULARY)) {
    category.tags.forEach(t => {
      if (jobLower.includes(t.toLowerCase())) {
        jdTags.push(t.toLowerCase());
      }
    });
  }
  jdTags = Array.from(new Set(jdTags));

  if (jdTags.length === 0) {
    let generalMatched = [];
    for (const [key, category] of Object.entries(SEMANTIC_VOCABULARY)) {
      category.tags.forEach(t => {
        if (resumeLower.includes(t.toLowerCase())) {
          generalMatched.push(t.toLowerCase());
        }
      });
    }
    generalMatched = Array.from(new Set(generalMatched));
    scoreReport.matchedTags = generalMatched;
    scoreReport.missingTags = [];
    scoreReport.atsScore = "Needs Review";
  } else {
    let matched = jdTags.filter(t => resumeLower.includes(t));
    let missing = jdTags.filter(t => !resumeLower.includes(t));
    scoreReport.matchedTags = matched;
    scoreReport.missingTags = missing;
    
    const overlapPercent = Math.round((matched.length / jdTags.length) * 100);
    scoreReport.atsScore = overlapPercent;
  }

  // 2. Audit Bullet Index & Experience Quality Check
  const ACTION_VERBS = ["engineered", "developed", "architected", "optimized", "scale", "reduced", "led", "managed", "boosted", "implemented", "leveraged", "pioneered", "designed", "built", "spearheaded", "accelerated", "automated", "created", "integrated", "streamlined", "transformed"];
  const PASSIVE_PHRASES = ["responsible for", "worked on", "helped in", "assisted with", "participated in", "duties included"];
  
  const lines = resumeText.split('\n').map(l => l.trim()).filter(Boolean);
  const bullets = lines.filter(l => l.startsWith('-') || l.startsWith('*') || l.startsWith('•') || l.startsWith('1.') || l.startsWith('2.'));
  
  if (bullets.length === 0) {
    scoreReport.bulletScore = "Insufficient Data";
  } else {
    let totalBulletScore = 0;
    bullets.forEach(b => {
      let bLower = b.toLowerCase();
      let bulletScore = 20;
      
      const hasAction = ACTION_VERBS.some(v => bLower.includes(v));
      if (hasAction) bulletScore += 30;
      
      const hasNumber = /\d+/.test(b);
      if (hasNumber) bulletScore += 25;
      
      const hasImpact = /%|ms|million|reduced|increased|optimized|saved|boosted|faster|latency|throughput/i.test(b);
      if (hasImpact) bulletScore += 25;
      
      const hasPassive = PASSIVE_PHRASES.some(p => bLower.includes(p));
      if (hasPassive) bulletScore -= 20;

      totalBulletScore += Math.max(0, Math.min(100, bulletScore));
    });
    scoreReport.bulletScore = Math.round(totalBulletScore / bullets.length);
  }

  // 3. Readability Index (Real Metrics-Driven)
  let sectionsPresent = 0;
  if (/experience|work|employment/i.test(resumeText)) sectionsPresent += 25;
  if (/education/i.test(resumeText)) sectionsPresent += 25;
  if (/skills/i.test(resumeText)) sectionsPresent += 25;
  if (/projects/i.test(resumeText)) sectionsPresent += 25;

  let formatScore = 0;
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText)) formatScore += 50;
  if (/github\.com|linkedin\.com/i.test(resumeText)) formatScore += 50;

  let complexityPenalty = 0;
  if (bullets.length > 0) {
    let totalWords = bullets.reduce((sum, b) => sum + b.split(/\s+/).length, 0);
    let avgWords = totalWords / bullets.length;
    if (avgWords > 25) complexityPenalty = 15;
    else if (avgWords < 8) complexityPenalty = 15;
  }

  scoreReport.readability = Math.max(0, Math.min(100, Math.round((sectionsPresent * 0.5) + (formatScore * 0.5) - complexityPenalty)));

  // 4. Role Alignment & Tech Stack Match
  let categoryScores = [];
  for (const [key, category] of Object.entries(SEMANTIC_VOCABULARY)) {
    let categoryJdTags = category.tags.filter(t => jobLower.includes(t.toLowerCase()));
    
    const inResumeCount = category.tags.filter(t => resumeLower.includes(t.toLowerCase())).length;
    if (categoryJdTags.length === 0) {
      scoreReport.radarSkills[key] = Math.min(100, inResumeCount * 15);
      continue;
    }
    
    let matched = categoryJdTags.filter(t => resumeLower.includes(t.toLowerCase()));
    const categoryPercent = Math.round((matched.length / categoryJdTags.length) * 100);
    scoreReport.radarSkills[key] = categoryPercent;
    categoryScores.push(categoryPercent / 100);
  }

  if (jdTags.length === 0) {
    scoreReport.fitScore = "Needs Review";
  } else {
    let alignmentScore = 0;
    if (categoryScores.length > 0) {
      alignmentScore = Math.round((categoryScores.reduce((sum, val) => sum + val, 0) / categoryScores.length) * 100);
    }
    scoreReport.fitScore = alignmentScore;
  }

  return scoreReport;
}

function getAlignmentTier(score) {
  if (typeof score !== 'number') return score;
  if (score >= 85) return "Strong Match";
  if (score >= 70) return "Moderate Match";
  return "Needs Review";
}

function validateResumeText(text) {
  const errors = [];
  const clean = text.trim();

  // 1. Length check
  if (clean.length < 150) {
    errors.push({
      id: "length",
      title: "Insufficient Content Length",
      description: "A professional resume must contain detailed career history and context. Your input is too short (" + clean.length + " characters, minimum 150 required)."
    });
  }

  // 2. OCR Quality check
  const asciiCount = (clean.match(/[\x20-\x7E\r\n\t]/g) || []).length;
  const ocrNoiseRatio = clean.length > 0 ? (clean.length - asciiCount) / clean.length : 0;
  if (ocrNoiseRatio > 0.1) {
    errors.push({
      id: "ocr",
      title: "OCR Corruption / Extracted Noise",
      description: "We detected high-density text encoding corruption (" + Math.round(ocrNoiseRatio * 100) + "% invalid characters). This indicates a low-quality OCR scan or encrypted PDF stream."
    });
  }

  // 3. Section hierarchy check
  const sections = ['experience', 'work', 'employment', 'education', 'skills', 'projects', 'history', 'academic', 'competencies', 'qualification', 'study'];
  const lowerText = clean.toLowerCase();
  const foundSections = sections.filter(s => lowerText.includes(s));
  if (foundSections.length < 2) {
    errors.push({
      id: "sections",
      title: "Missing Structured Sections",
      description: "Standard section headers (such as Experience, Education, Projects, or Skills) could not be extracted. At least two standard sections are required."
    });
  }

  // 4. Coordinates check
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const hasEmail = emailRegex.test(clean);
  const hasPhone = /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/.test(clean) || lowerText.includes("phone") || lowerText.includes("contact");
  if (!hasEmail && !hasPhone) {
    errors.push({
      id: "coordinates",
      title: "Missing Contact Coordinates",
      description: "No email address or contact phone number detected. An enterprise-grade resume requires identification details to initiate parser bindings."
    });
  }

  // 5. Filler text check
  const loremKeywords = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing'];
  const loremMatches = loremKeywords.filter(k => lowerText.includes(k));
  if (loremMatches.length >= 4) {
    errors.push({
      id: "filler",
      title: "Filler / Dummy Text Detected",
      description: "The document contains standard template filler text (Lorem Ipsum). Fabricating or guessing details from dummy text violates compliance protocols."
    });
  }

  return errors;
}

function renderValidationErrorPanel(errors) {
  // Set placeholder for alignment metrics and hide job-specific data
  document.getElementById('scoreATS').textContent = '—';
  document.getElementById('scoreBullet').textContent = '—';
  document.getElementById('scoreReadability').textContent = '—';
  document.getElementById('scoreFit').textContent = '—';

  // Clear matched/missing tags
  document.getElementById('countMatched').textContent = '0';
  document.getElementById('countMissing').textContent = '0';
  document.getElementById('tagsMatched').innerHTML = '<span class="legend-tag missing" style="color: var(--text-tertiary); border-color: var(--border);">Validation Suspended</span>';
  document.getElementById('tagsMissing').innerHTML = '<span class="legend-tag missing" style="color: var(--text-tertiary); border-color: var(--border);">Validation Suspended</span>';

  // Set feedback lists to warning states
  document.getElementById('bulletFeedbackList').innerHTML = `
    <div class="feedback-card crit">
      <i data-lucide="shield-alert" class="icon-sm text-danger" style="margin-top:0.15rem;"></i>
      <div class="feedback-body">
        <h4>Assessment Suspended</h4>
        <p>Your resume failed structural compliance validation. Please upload a valid document to compute metrics.</p>
      </div>
    </div>
  `;
  document.getElementById('formatFeedbackList').innerHTML = `
    <div class="feedback-card crit">
      <i data-lucide="x-circle" class="icon-sm text-danger" style="margin-top:0.15rem;"></i>
      <div class="feedback-body">
        <h4>Validation Errors Blocking Analysis</h4>
        <p>${errors.length} error(s) must be resolved to continue processing.</p>
      </div>
    </div>
  `;

  // Render warning state inside the document preview A4 page
  const docPage = document.getElementById('a4DocumentContent');
  docPage.innerHTML = `
    <div class="validation-error-panel">
      <div class="validation-header">
        <div class="validation-icon">
          <i data-lucide="shield-alert" style="width: 24px; height: 24px;"></i>
        </div>
        <div class="validation-header-text">
          <h3>Deterministic Validation Fault</h3>
          <p>The uploaded text does not appear to be an authentic resume. Evaluation suspended.</p>
        </div>
      </div>
      
      <div class="validation-errors-list">
        ${errors.map(err => `
          <div class="validation-error-item">
            <i data-lucide="x-circle" class="icon-sm text-danger validation-error-icon"></i>
            <div class="validation-error-content">
              <h4>${err.title}</h4>
              <p>${err.description}</p>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="validation-footer">
        <h4>Compliance Diagnostic Checklist</h4>
        <div class="validation-checklist">
          <div class="validation-check-item ${errors.some(e => e.id === 'length') ? 'failed' : 'passed'}">
            <i data-lucide="${errors.some(e => e.id === 'length') ? 'x-circle' : 'check-circle'}" class="icon-xs"></i> 
            Text length meets minimum (150 chars)
          </div>
          <div class="validation-check-item ${errors.some(e => e.id === 'sections') ? 'failed' : 'passed'}">
            <i data-lucide="${errors.some(e => e.id === 'sections') ? 'x-circle' : 'check-circle'}" class="icon-xs"></i> 
            Structured headings found
          </div>
          <div class="validation-check-item ${errors.some(e => e.id === 'coordinates') ? 'failed' : 'passed'}">
            <i data-lucide="${errors.some(e => e.id === 'coordinates') ? 'x-circle' : 'check-circle'}" class="icon-xs"></i> 
            Contact details or links present
          </div>
          <div class="validation-check-item ${errors.some(e => e.id === 'filler') ? 'failed' : 'passed'}">
            <i data-lucide="${errors.some(e => e.id === 'filler') ? 'x-circle' : 'check-circle'}" class="icon-xs"></i> 
            Authentic experience content (no dummy text)
          </div>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) {
    lucide.createIcons();
  }

  const statusEl = document.getElementById('studentStatus');
  statusEl.className = "status-indicator ready";
  statusEl.textContent = "Validation Failed";
  showToast("Resume validation failed. See diagnostics checklist.", "error");
}

let isGenericOptimizationMode = false;

function runStudentSemanticAssessment() {
  const resumeText = document.getElementById('studentResumeText').value.trim();
  const jobText = document.getElementById('studentJobText').value.trim();

  // Smart Validation Logic Pipeline
  // Case 1: Neither exists
  if (!resumeText && !jobText) {
    isGenericOptimizationMode = false;
    showOnboardingEmptyState();
    return;
  }

  // Case 2: Resume empty (but JD might exist)
  if (!resumeText) {
    isGenericOptimizationMode = false;
    showToast("Please upload a resume or paste text first.", "error");
    showOnboardingEmptyState();
    return;
  }

  // Validate resume structure to prevent AI hallucinations and non-resume files
  const validationErrors = validateResumeText(resumeText);
  if (validationErrors.length > 0) {
    isGenericOptimizationMode = false;
    renderValidationErrorPanel(validationErrors);
    return;
  }

  // Case 3: Resume exists BUT no JD exists
  if (!jobText) {
    isGenericOptimizationMode = false;
    showTargetJobDetailsRequiredWarning();
    return;
  }

  // Case 4: Both exist -> run full ATS + tailoring analysis
  isGenericOptimizationMode = false;
  runFullAlignmentAssessment(resumeText, jobText);
}

function showOnboardingEmptyState() {
  const docPage = document.getElementById('a4DocumentContent');
  
  // Set default placeholder for metrics
  document.getElementById('scoreATS').textContent = '—';
  document.getElementById('scoreBullet').textContent = '—';
  document.getElementById('scoreReadability').textContent = '—';
  document.getElementById('scoreFit').textContent = '—';

  docPage.innerHTML = `
    <div class="onboarding-empty-state" style="text-align: center; padding: 4.5rem 1.5rem; color: var(--text-secondary); display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 500px;">
      <div style="width: 56px; height: 56px; background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.15); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; color: var(--primary);">
        <i data-lucide="graduation-cap" style="width: 28px; height: 28px;"></i>
      </div>
      <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem;">Build Your Recruiter-Grade Credentials</h3>
      <p style="font-size: 0.875rem; color: var(--text-secondary); max-width: 440px; line-height: 1.6; margin-bottom: 2rem;">
        Upload or paste your resume and target job details to run full semantic alignment, optimize ATS readability, and generate tailored recruiter-grade documents.
      </p>
      <div style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%; max-width: 320px;">
        <button class="btn btn-glow" id="onboardingUploadBtn" style="width: 100%; justify-content: center; font-size: 0.85rem; padding: 0.6rem 1rem;">
          <i data-lucide="upload-cloud" class="icon-xs"></i> Upload Resume File
        </button>
        <button class="btn btn-secondary" id="onboardingPasteBtn" style="width: 100%; justify-content: center; font-size: 0.85rem; padding: 0.6rem 1rem;">
          <i data-lucide="edit-3" class="icon-xs"></i> Paste Resume Content
        </button>
      </div>
    </div>
  `;

  // Wire up onboarding buttons
  document.getElementById('onboardingUploadBtn').addEventListener('click', () => {
    const fileInput = document.getElementById('studentFileInput');
    if (fileInput) {
      fileInput.click();
    }
  });

  document.getElementById('onboardingPasteBtn').addEventListener('click', () => {
    const studentResumeText = document.getElementById('studentResumeText');
    if (studentResumeText) {
      studentResumeText.focus();
      studentResumeText.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  const statusEl = document.getElementById('studentStatus');
  statusEl.className = "status-indicator ready";
  statusEl.textContent = "Standby";

  if (window.lucide) {
    lucide.createIcons();
  }
}

function showTargetJobDetailsRequiredWarning() {
  const docPage = document.getElementById('a4DocumentContent');
  
  // Set placeholder for alignment metrics and hide job-specific data
  hideAlignmentMetricsAndRecommendations();

  // Render warning state inside the document preview
  docPage.innerHTML = `
    <div class="warning-empty-state" style="text-align: center; padding: 4.5rem 1.5rem; color: var(--text-secondary); display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 500px;">
      <div style="width: 56px; height: 56px; background: rgba(249, 115, 22, 0.08); border: 1px solid rgba(249, 115, 22, 0.2); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; color: var(--primary);">
        <i data-lucide="alert-triangle" style="width: 28px; height: 28px;"></i>
      </div>
      <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem;">Target Job Details Required</h3>
      <p style="font-size: 0.875rem; color: var(--text-secondary); max-width: 440px; line-height: 1.6; margin-bottom: 2rem;">
        Upload or paste a target job description to generate accurate ATS analysis, role alignment, and tailored resume optimization.
      </p>
      <div style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%; max-width: 320px;">
        <button class="btn btn-primary" id="warningPasteJdBtn" style="width: 100%; justify-content: center; font-size: 0.85rem; padding: 0.6rem 1rem;">
          <i data-lucide="edit-3" class="icon-xs"></i> Paste Job Description
        </button>
        <button class="btn btn-secondary" id="warningUploadJdBtn" style="width: 100%; justify-content: center; font-size: 0.85rem; padding: 0.6rem 1rem;">
          <i data-lucide="link" class="icon-xs"></i> Upload JD
        </button>
        <button class="btn btn-glow" id="warningGenericOptBtn" style="width: 100%; justify-content: center; font-size: 0.85rem; padding: 0.6rem 1rem;">
          <i data-lucide="sparkles" class="icon-xs"></i> Continue With Generic Optimization
        </button>
      </div>
    </div>
  `;

  // Wire up warning options
  document.getElementById('warningPasteJdBtn').addEventListener('click', () => {
    const tabJdManual = document.getElementById('tabJdManual');
    if (tabJdManual) {
      tabJdManual.click();
      const studentJobText = document.getElementById('studentJobText');
      if (studentJobText) {
        studentJobText.focus();
        studentJobText.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  document.getElementById('warningUploadJdBtn').addEventListener('click', () => {
    const tabJdUrl = document.getElementById('tabJdUrl');
    if (tabJdUrl) {
      tabJdUrl.click();
      const studentJobUrlInput = document.getElementById('studentJobUrlInput');
      if (studentJobUrlInput) {
        studentJobUrlInput.focus();
        studentJobUrlInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  document.getElementById('warningGenericOptBtn').addEventListener('click', () => {
    const resumeText = document.getElementById('studentResumeText').value;
    runGenericOptimization(resumeText);
  });

  const statusEl = document.getElementById('studentStatus');
  statusEl.className = "status-indicator ready";
  statusEl.textContent = "Awaiting JD";

  if (window.lucide) {
    lucide.createIcons();
  }
}

function hideAlignmentMetricsAndRecommendations() {
  // Hide compatibility, role alignment, and missing skills
  const scoreAtsEl = document.getElementById('scoreATS');
  const scoreFitEl = document.getElementById('scoreFit');
  
  if (scoreAtsEl) {
    scoreAtsEl.innerHTML = `<span style="font-size: 0.72rem; font-weight: 600; color: var(--text-tertiary); font-family: sans-serif; white-space: normal; line-height: 1.2;">Awaiting target job criteria.</span>`;
  }
  if (scoreFitEl) {
    scoreFitEl.innerHTML = `<span style="font-size: 0.72rem; font-weight: 600; color: var(--text-tertiary); font-family: sans-serif; white-space: normal; line-height: 1.2;">Awaiting target job criteria.</span>`;
  }

  // Clear skills alignment missing tags
  const countMissing = document.getElementById('countMissing');
  const tagsMissing = document.getElementById('tagsMissing');
  if (countMissing) countMissing.textContent = '—';
  if (tagsMissing) {
    tagsMissing.innerHTML = `<span class="legend-tag missing" style="color: var(--text-tertiary); border-color: var(--border);">Awaiting target job criteria.</span>`;
  }

  // Clear matched tags to default or neutral if JD is missing
  const countMatched = document.getElementById('countMatched');
  const tagsMatched = document.getElementById('tagsMatched');
  if (countMatched) countMatched.textContent = '0';
  if (tagsMatched) {
    tagsMatched.innerHTML = `<span class="legend-tag matched" style="color: var(--text-tertiary); border-color: var(--border);">Awaiting target job criteria.</span>`;
  }

  // Clear or render gray skills alignment chart
  const ctx = document.getElementById('studentSkillChart');
  if (ctx) {
    const ctx2d = ctx.getContext('2d');
    if (studentChart) {
      studentChart.destroy();
    }
    studentChart = new Chart(ctx2d, {
      type: 'doughnut',
      data: {
        labels: ['Awaiting Job Details'],
        datasets: [{
          data: [100],
          backgroundColor: ['rgba(255, 255, 255, 0.05)'],
          borderColor: document.body.classList.contains('light-theme') ? '#ffffff' : '#16161f',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        cutout: '75%'
      }
    });
  }

  // Hide job-specific recommendations in bullet quality
  const bulletList = document.getElementById('bulletFeedbackList');
  if (bulletList) {
    bulletList.innerHTML = `
      <div class="feedback-card info">
        <i data-lucide="info" class="icon-sm text-primary" style="margin-top:0.15rem;"></i>
        <div class="feedback-body">
          <h4>Job Specific Alignment</h4>
          <p>Awaiting target job criteria.</p>
        </div>
      </div>
    `;
  }

  // Hide recommended learning path
  const roadmap = document.getElementById('studentRoadmapPanel');
  if (roadmap) {
    roadmap.innerHTML = `
      <div class="feedback-card info">
        <i data-lucide="compass" class="icon-sm text-primary" style="margin-top:0.15rem;"></i>
        <div class="feedback-body">
          <h4>Recommended Learning Path</h4>
          <p>Awaiting target job criteria.</p>
        </div>
      </div>
    `;
  }

  if (window.lucide) {
    lucide.createIcons();
  }
}

function runGenericOptimization(resumeText) {
  const statusEl = document.getElementById('studentStatus');
  statusEl.className = "status-indicator loading";
  statusEl.textContent = "AI Optimizing...";

  // Show loading skeleton inside A4 sheet during computation
  const docPage = document.getElementById('a4DocumentContent');
  docPage.innerHTML = `
    <div style="padding:1rem;">
      <div class="skeleton-loader sk-title"></div>
      <div class="skeleton-loader sk-text" style="width:50%; margin-bottom:2.5rem;"></div>
      <div class="skeleton-loader sk-text" style="height:15px; margin-bottom:1.5rem;"></div>
      <div class="skeleton-loader sk-text" style="height:80px; margin-bottom:2rem;"></div>
    </div>
  `;

  setTimeout(() => {
    isGenericOptimizationMode = true;

    // Run general optimization (no JD text used)
    hideAlignmentMetricsAndRecommendations();

    // Still audit the general bullet index and readability because they don't depend on the JD!
    const analysis = computeSemanticCompliance(resumeText, "");

    // Render general metrics
    document.getElementById('scoreBullet').textContent = `${analysis.bulletScore}%`;
    document.getElementById('scoreReadability').textContent = `${analysis.readability}%`;

    // Render general bullet quality audit
    const bulletList = document.getElementById('bulletFeedbackList');
    bulletList.innerHTML = "";
    
    if (analysis.bulletScore > 85) {
      bulletList.innerHTML += `
        <div class="feedback-card success">
          <i data-lucide="check-circle" class="icon-sm text-success" style="margin-top:0.15rem;"></i>
          <div class="feedback-body">
            <h4>Quantitative Bullets Audited</h4>
            <p>Your resume bullets include specific engineering tasks and quantified accomplishments. Format is standard.</p>
          </div>
        </div>
      `;
    } else {
      bulletList.innerHTML += `
        <div class="feedback-card crit">
          <i data-lucide="alert-circle" class="icon-sm text-danger" style="margin-top:0.15rem;"></i>
          <div class="feedback-body">
            <h4>Missing Quantified Performance Metrics</h4>
            <p>Write your project bullets to include specific performance indicators (e.g. "reducing query times by 30%").</p>
          </div>
        </div>
        <div class="feedback-card warn">
          <i data-lucide="alert-triangle" class="icon-sm text-warning" style="margin-top:0.15rem;"></i>
          <div class="feedback-body">
            <h4>Passive Action Verbs Omitted</h4>
            <p>Swap out passive keywords like "worked on" or "responsible for" for standard action verbs like "engineered", "designed", and "developed".</p>
          </div>
        </div>
      `;
    }

    bulletList.innerHTML += `
      <div class="feedback-card info">
        <i data-lucide="info" class="icon-sm text-primary" style="margin-top:0.15rem;"></i>
        <div class="feedback-body">
          <h4>Job-Specific Alignment</h4>
          <p>Awaiting target job criteria.</p>
        </div>
      </div>
    `;

    // Audit general layout diagnostics
    const formatList = document.getElementById('formatFeedbackList');
    formatList.innerHTML = "";
    
    let checks = [];
    if (!resumeText.includes("@") && !resumeText.toLowerCase().includes("email")) {
      checks.push({ title: "Email Coordinates Missing", desc: "No email address found. Add your contact coordinates to ensure visibility.", severity: "crit" });
    }
    if (!resumeText.toLowerCase().includes("linkedin.com")) {
      checks.push({ title: "LinkedIn Link Omitted", desc: "Add your LinkedIn URL to complete profile diagnostics.", severity: "warn" });
    }
    if (resumeText.length > 5000) {
      checks.push({ title: "Length Warning", desc: "Resume text exceeds 1,000 words. Keep your descriptions concise.", severity: "warn" });
    }

    if (checks.length === 0) {
      formatList.innerHTML = `
        <div class="feedback-card success">
          <i data-lucide="check" class="icon-sm text-success" style="margin-top:0.15rem;"></i>
          <div class="feedback-body">
            <h4>Layout Diagnostics Clear</h4>
            <p>Contact details and layout dimensions are fully compliant.</p>
          </div>
        </div>
      `;
    } else {
      checks.forEach(c => {
        const iconColor = c.severity === 'crit' ? 'text-danger' : 'text-warning';
        formatList.innerHTML += `
          <div class="feedback-card ${c.severity}">
            <i data-lucide="alert-circle" class="icon-sm ${iconColor}" style="margin-top:0.15rem;"></i>
            <div class="feedback-body">
              <h4>${c.title}</h4>
              <p>${c.desc}</p>
            </div>
          </div>
        `;
      });
    }

    // Compile human-sounding content (generally optimized resume)
    const nameMatch = resumeText.match(/^([A-Z][a-z]+)\s+([A-Z][a-z]+)/);
    const candidateName = nameMatch ? `${nameMatch[1]} ${nameMatch[2]}` : "Candidate Developer";
    const gitUser = document.getElementById('studentGitInput').value.trim() || "developer";
    const studentEmail = resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/) || ["candidate@applygeniuz.com"];

    // In generic mode, we extract skills from the resume text using SEMANTIC_VOCABULARY tags present in the resume
    const matchedResumeTags = [];
    const resumeLower = resumeText.toLowerCase();
    for (const [key, category] of Object.entries(SEMANTIC_VOCABULARY)) {
      category.tags.forEach(t => {
        if (resumeLower.includes(t)) {
          matchedResumeTags.push(t);
        }
      });
    }

    generatedResumeContent = generateHumanResume(candidateName, studentEmail[0], gitUser, matchedResumeTags, "", resumeText);
    
    // For Cover Letter in generic mode, show awaiting target job criteria warning
    generatedCoverContent = `
      <div style="text-align:center; padding: 6rem 1.5rem; color:var(--text-tertiary);">
        <i data-lucide="mail" class="icon-lg" style="margin:0 auto 1rem; opacity:0.3; display:block;"></i>
        <h3 style="font-weight:600; font-size:1.15rem; color:var(--text-primary);">Awaiting Target Job Details</h3>
        <p style="font-size:0.85rem; max-width:320px; margin:0.5rem auto; line-height:1.5;">
          A target job description is required to generate a dynamically tailored, recruiter-grade cover letter.
        </p>
      </div>
    `;

    renderActiveA4Document();

    statusEl.className = "status-indicator ready";
    statusEl.textContent = "Generic Mode";
    showToast("General Resume Optimization Complete!", "success");

    if (window.lucide) {
      lucide.createIcons();
    }
  }, 1200);
}

function runFullAlignmentAssessment(resumeText, jobText) {
  const statusEl = document.getElementById('studentStatus');
  statusEl.className = "status-indicator loading";
  statusEl.textContent = "AI Assessing...";
  
  // Show loading skeleton inside A4 sheet during computation
  const docPage = document.getElementById('a4DocumentContent');
  docPage.innerHTML = `
    <div style="padding:1rem;">
      <div class="skeleton-loader sk-title"></div>
      <div class="skeleton-loader sk-text" style="width:50%; margin-bottom:2.5rem;"></div>
      <div class="skeleton-loader sk-text" style="height:15px; margin-bottom:1.5rem;"></div>
      <div class="skeleton-loader sk-text" style="height:80px; margin-bottom:2rem;"></div>
      <div class="skeleton-loader sk-text" style="height:15px; margin-bottom:1.5rem;"></div>
      <div class="skeleton-loader sk-text" style="height:100px;"></div>
    </div>
  `;

  setTimeout(() => {
    const analysis = computeSemanticCompliance(resumeText, jobText);
    
    // Render scores widgets (Compatibility & Alignment Tiers)
    document.getElementById('scoreATS').textContent = typeof analysis.atsScore === 'number' ? `${analysis.atsScore}%` : analysis.atsScore;
    document.getElementById('scoreBullet').textContent = typeof analysis.bulletScore === 'number' ? `${analysis.bulletScore}%` : analysis.bulletScore;
    document.getElementById('scoreReadability').textContent = typeof analysis.readability === 'number' ? `${analysis.readability}%` : analysis.readability;
    document.getElementById('scoreFit').textContent = typeof analysis.fitScore === 'number' ? getAlignmentTier(analysis.fitScore) : analysis.fitScore;
    
    // Tags lists
    const countMatched = document.getElementById('countMatched');
    const countMissing = document.getElementById('countMissing');
    const tagsMatched = document.getElementById('tagsMatched');
    const tagsMissing = document.getElementById('tagsMissing');
    
    const matched = analysis.matchedTags.length ? Array.from(new Set(analysis.matchedTags)) : ["React.js", "TypeScript", "JavaScript", "CSS/HTML"];
    const missing = analysis.missingTags.length ? Array.from(new Set(analysis.missingTags)) : ["CI/CD pipelines", "Redis Cache", "PostgreSQL database index"];
    
    countMatched.textContent = matched.length;
    countMissing.textContent = missing.length;
    
    tagsMatched.innerHTML = matched.map(t => `<span class="legend-tag matched">${t}</span>`).join('');
    tagsMissing.innerHTML = missing.map(t => `<span class="legend-tag missing">${t}</span>`).join('');

    renderStudentSkillChart(matched.length, missing.length);

    // Audit Bullet strength breakdowns
    const bulletList = document.getElementById('bulletFeedbackList');
    bulletList.innerHTML = "";
    
    if (typeof analysis.bulletScore === 'number') {
      if (analysis.bulletScore > 85) {
        bulletList.innerHTML += `
          <div class="feedback-card success">
            <i data-lucide="check-circle" class="icon-sm text-success" style="margin-top:0.15rem;"></i>
            <div class="feedback-body">
              <h4>Quantitative Bullets Audited</h4>
              <p>Your resume bullets include specific engineering tasks and quantified accomplishments. Format is standard.</p>
              <span class="feedback-badge" style="background:rgba(16,185,129,0.15); color:var(--success);">Top Indexed</span>
            </div>
          </div>
        `;
      } else {
        bulletList.innerHTML += `
          <div class="feedback-card crit">
            <i data-lucide="alert-circle" class="icon-sm text-danger" style="margin-top:0.15rem;"></i>
            <div class="feedback-body">
              <h4>Missing Quantified Performance Metrics</h4>
              <p>Write your project bullets to include specific performance indicators. (e.g. "reducing query times by 30%").</p>
              <span class="feedback-badge">Maturity Check</span>
            </div>
          </div>
          <div class="feedback-card warn">
            <i data-lucide="alert-triangle" class="icon-sm text-warning" style="margin-top:0.15rem;"></i>
            <div class="feedback-body">
              <h4>Passive Action Verbs Omitted</h4>
              <p>Swap out passive keywords like "worked on" or "responsible for" for standard action verbs like "engineered", "designed", and "developed".</p>
            </div>
          </div>
        `;
      }
    } else {
      bulletList.innerHTML += `
        <div class="feedback-card info">
          <i data-lucide="info" class="icon-sm text-primary" style="margin-top:0.15rem;"></i>
          <div class="feedback-body">
            <h4>No Experience Bullets Detected</h4>
            <p>Write your project bullets or experience lists starting with standard bullet points (-, *, •).</p>
            <span class="feedback-badge">Needs Review</span>
          </div>
        </div>
      `;
    }

    // Diagnostics checklists
    const formatList = document.getElementById('formatFeedbackList');
    formatList.innerHTML = "";
    
    let checks = [];
    if (!resumeText.includes("@") && !resumeText.toLowerCase().includes("email")) {
      checks.push({ title: "Email Coordinates Missing", desc: "No email address found. Add your contact coordinates to ensure visibility.", severity: "crit" });
    }
    if (!resumeText.toLowerCase().includes("linkedin.com")) {
      checks.push({ title: "LinkedIn Link Omitted", desc: "Add your LinkedIn URL to complete profile diagnostics.", severity: "warn" });
    }
    if (resumeText.length > 5000) {
      checks.push({ title: "Length Warning", desc: "Resume text exceeds 1,000 words. Keep your descriptions concise.", severity: "warn" });
    }

    if (checks.length === 0) {
      formatList.innerHTML = `
        <div class="feedback-card success">
          <i data-lucide="check" class="icon-sm text-success" style="margin-top:0.15rem;"></i>
          <div class="feedback-body">
            <h4>Layout Diagnostics Clear</h4>
            <p>Contact details and layout dimensions are fully compliant.</p>
          </div>
        </div>
      `;
    } else {
      checks.forEach(c => {
        const iconColor = c.severity === 'crit' ? 'text-danger' : 'text-warning';
        formatList.innerHTML += `
          <div class="feedback-card ${c.severity}">
            <i data-lucide="alert-circle" class="icon-sm ${iconColor}" style="margin-top:0.15rem;"></i>
            <div class="feedback-body">
              <h4>${c.title}</h4>
              <p>${c.desc}</p>
            </div>
          </div>
        `;
      });
    }

    // Roadmap
    const roadmap = document.getElementById('studentRoadmapPanel');
    if (missing.length === 0) {
      roadmap.innerHTML = `
        <div class="feedback-card success">
          <i data-lucide="check" class="icon-sm text-success" style="margin-top:0.15rem;"></i>
          <div class="feedback-body">
            <h4>Concept Profile Complete</h4>
            <p>Your experience matches all technical requirements in the target job brief.</p>
          </div>
        </div>
      `;
    } else {
      roadmap.innerHTML = `
        <div class="feedback-card info" style="background:rgba(139,92,246,0.03); border-color:rgba(139,92,246,0.25);">
          <i data-lucide="compass" class="icon-sm text-accent" style="margin-top:0.15rem;"></i>
          <div class="feedback-body">
            <h4 style="color:var(--accent);">Recommended Skills & Project Focus</h4>
            <p style="margin-bottom:0.75rem;">To optimize compatibility scores, we recommend detailing these topics in your experiences:</p>
            <ul style="margin-left:1.25rem; font-size:0.8rem; display:flex; flex-direction:column; gap:0.25rem; color:var(--text-secondary);">
              <li>Build an integration project showcasing <strong>${missing[0] || 'CI/CD pipelines'}</strong>.</li>
              <li>Master concepts regarding <strong>${missing[1] || 'State Management systems'}</strong>.</li>
              <li>Incorporate database references in your professional experiences lists.</li>
            </ul>
          </div>
        </div>
      `;
    }

    // Compile human-sounding content
    const nameMatch = resumeText.match(/^([A-Z][a-z]+)\s+([A-Z][a-z]+)/);
    const candidateName = nameMatch ? `${nameMatch[1]} ${nameMatch[2]}` : "Candidate Developer";
    const gitUser = document.getElementById('studentGitInput').value.trim() || "developer";
    const studentEmail = resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/) || ["candidate@applygeniuz.com"];

    generatedResumeContent = generateHumanResume(candidateName, studentEmail[0], gitUser, matched, jobText, resumeText);
    generatedCoverContent = generateHumanCover(candidateName, studentEmail[0], gitUser, matched, jobText, resumeText);

    // Refresh A4 Preview Sheet
    renderActiveA4Document();

    statusEl.className = "status-indicator ready";
    statusEl.textContent = "Ready";
    showToast("Assessment Complete!", "success");
    
    // Re-draw Lucide Icons inside feedback blocks
    if (window.lucide) {
      lucide.createIcons();
    }
  }, 1200);
}

function renderStudentSkillChart(matched, missing) {
  const ctx = document.getElementById('studentSkillChart').getContext('2d');
  
  if (studentChart) {
    studentChart.destroy();
  }

  studentChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Matched Concepts', 'Skill Gaps'],
      datasets: [{
        data: [matched || 4, missing || 3],
        backgroundColor: ['#3b82f6', '#dc2626'],
        borderColor: document.body.classList.contains('light-theme') ? '#ffffff' : '#16161f',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      cutout: '75%'
    }
  });
}

async function syncStudentGitHub() {
  const user = document.getElementById('studentGitInput').value.trim();
  const avatar = document.getElementById('gitProfileAvatar');
  const nameEl = document.getElementById('gitProfileName');
  const bioEl = document.getElementById('gitProfileBio');
  const reposEl = document.getElementById('gitRepos');
  const followersEl = document.getElementById('gitFollowers');
  const credScoreEl = document.getElementById('gitCredScore');

  if (!user) {
    showToast("Please provide a valid GitHub username.", "error");
    return;
  }

  showToast(`Accessing GitHub public endpoint for /${user}...`, "success");

  try {
    const resp = await fetch(`https://api.github.com/users/${encodeURIComponent(user)}`);
    if (!resp.ok) throw new Error("GitHub profile not found.");
    const data = await resp.json();
    
    avatar.style.backgroundImage = `url('${data.avatar_url}')`;
    nameEl.textContent = data.name || data.login;
    bioEl.textContent = data.bio || "No public bio provided.";
    reposEl.textContent = data.public_repos;
    followersEl.textContent = data.followers;
    
    const credScore = Math.min(100, Math.round(((data.public_repos * 1.5) + (data.followers * 2.5)) / 2) + 60);
    credScoreEl.textContent = `${credScore}%`;
    
    showToast("GitHub profile synchronized!", "success");
  } catch (err) {
    showToast("Local API failed, rendering credentials simulated.", "warn");
    avatar.style.backgroundImage = `url('https://avatars.githubusercontent.com/u/9919?v=4')`;
    nameEl.textContent = `${user} — Platform Developer`;
    bioEl.textContent = "AI microservices builder & frontend open source contributor.";
    reposEl.textContent = "24";
    followersEl.textContent = "38";
    credScoreEl.textContent = "84%";
  }
}

/* ====================================================================
   8. ENTERPRISE RECRUITER WORKSPACE
   ==================================================================== */

function initRecruiterWorkspace() {
  const roleSelect = document.getElementById('recruiterRoleSelect');
  const uploadZone = document.getElementById('recruiterUploadZone');
  const fileInput = document.getElementById('recruiterFileInput');
  const bulkIndicator = document.getElementById('bulkFilesIndicator');
  const processBtn = document.getElementById('recruiterProcessBtn');
  const minAtsSlider = document.getElementById('recruiterMinAts');
  const minAtsLabel = document.getElementById('minAtsValue');
  const sortSelect = document.getElementById('recruiterSort');
  const statusFilter = document.getElementById('recruiterStatusFilter');
  const searchInput = document.getElementById('recruiterSearch');
  const downloadXlsBtn = document.getElementById('recruiterDownloadXls');

  roleSelect.addEventListener('change', (e) => {
    const customContainer = document.getElementById('customJdContainer');
    if (e.target.value === 'custom') {
      customContainer.style.display = "block";
    } else {
      customContainer.style.display = "none";
    }
  });

  uploadZone.addEventListener('click', () => fileInput.click());
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
      handleBulkRecruiterFiles(e.dataTransfer.files);
    }
  });
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
      handleBulkRecruiterFiles(e.target.files);
    }
  });

  processBtn.addEventListener('click', () => {
    processBulkRecruiterCandidates();
  });

  minAtsSlider.addEventListener('input', (e) => {
    minAtsLabel.textContent = `${e.target.value}%`;
    renderLeaderboard();
  });

  sortSelect.addEventListener('change', () => renderLeaderboard());
  statusFilter.addEventListener('change', () => renderLeaderboard());
  searchInput.addEventListener('input', () => renderLeaderboard());

  downloadXlsBtn.addEventListener('click', () => {
    exportRecruiterCSV();
  });
}

let loadedBulkFiles = [];

function handleBulkRecruiterFiles(files) {
  const bulkIndicator = document.getElementById('bulkFilesIndicator');
  loadedBulkFiles = Array.from(files);
  bulkIndicator.textContent = `${loadedBulkFiles.length} Resume files queued.`;
  bulkIndicator.style.display = "block";
  showToast(`Successfully queued ${loadedBulkFiles.length} resumes. Click matching button.`, "success");
}

async function processBulkRecruiterCandidates() {
  const statusEl = document.getElementById('recruiterStatus');
  const roleValue = document.getElementById('recruiterRoleSelect').value;
  
  if (loadedBulkFiles.length === 0) {
    showToast("Please upload bulk resume files first.", "error");
    return;
  }

  statusEl.className = "status-indicator loading";
  statusEl.textContent = "Batch Screening...";
  showToast(`Evaluating ${loadedBulkFiles.length} resumes...`, "success");

  for (let i = 0; i < loadedBulkFiles.length; i++) {
    const file = loadedBulkFiles[i];
    try {
      let fileText = "";
      if (file.name.split('.').pop().toLowerCase() === 'pdf') {
        fileText = await extractTextFromPdf(file);
      } else {
        fileText = await file.text();
      }
      
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      const uppercaseName = cleanName.replace(/\b\w/g, c => c.toUpperCase());
      
      const compliance = computeSemanticCompliance(fileText, roleValue);
      const isShortlisted = compliance.fitScore >= 80;
      
      const newCand = {
        id: recruiterCandidates.length + 1,
        name: uppercaseName,
        title: roleValue === 'frontend' ? 'UI Developer' : roleValue === 'backend' ? 'Microservices Engineer' : 'Platform Developer',
        email: `${cleanName.replace(/\s+/g, ".")}@applygeniuz.com`,
        github: `github.com/${cleanName.replace(/\s+/g, "")}`,
        experience: "4+ Years",
        atsScore: compliance.atsScore,
        roleAlignment: getAlignmentTier(compliance.fitScore),
        bulletIndex: compliance.bulletScore,
        readability: compliance.readability,
        status: isShortlisted ? "Shortlist" : "Review",
        stage: "Applied",
        skills: compliance.radarSkills,
        insights: `Assessment of parsed text. Conceptual match shows compatibility. Experience bullets index averaged ${compliance.bulletScore}%.`,
        techStack: ["React.js", "Express", "Node.js", "Docker", "Git"]
      };
      
      recruiterCandidates.push(newCand);
    } catch (e) {
      console.error(e);
      showToast(`Error processing file: ${file.name}`, "error");
    }
  }

  loadedBulkFiles = [];
  document.getElementById('bulkFilesIndicator').style.display = "none";
  document.getElementById('recruiterFileInput').value = "";

  setTimeout(() => {
    renderLeaderboard();
    statusEl.className = "status-indicator ready";
    statusEl.textContent = "Batch Matching Done";
    showToast("Completed batch evaluation!", "success");
  }, 1500);
}

function renderLeaderboard() {
  const tableBody = document.getElementById('leaderboardBody');
  const searchVal = document.getElementById('recruiterSearch').value.toLowerCase();
  const minAtsVal = parseInt(document.getElementById('recruiterMinAts').value, 10);
  const statusFilter = document.getElementById('recruiterStatusFilter').value;
  const sortVal = document.getElementById('recruiterSort').value;

  if (!tableBody) return;
  tableBody.innerHTML = "";

  let filtered = recruiterCandidates.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchVal) || c.title.toLowerCase().includes(searchVal);
    const matchAts = c.atsScore >= minAtsVal;
    let matchStatus = true;
    if (statusFilter === 'shortlist') matchStatus = c.status === 'Shortlist';
    if (statusFilter === 'review') matchStatus = c.status === 'Review';
    return matchSearch && matchAts && matchStatus;
  });

  filtered.sort((a, b) => {
    if (sortVal === 'ats') return b.atsScore - a.atsScore;
    if (sortVal === 'similarity') return a.roleAlignment.localeCompare(b.roleAlignment); // tier sorting
    if (sortVal === 'bullet') return b.bulletIndex - a.bulletIndex;
    if (sortVal === 'alphabetical') return a.name.localeCompare(b.name);
    return b.atsScore - a.atsScore;
  });

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">
          <i data-lucide="folder-open" class="empty-icon" style="display:block; margin:0 auto 1rem; opacity:0.5;"></i>
          <h3>No Pipeline Matches</h3>
          <p>Adjust sorting settings or lower screening threshold values.</p>
        </td>
      </tr>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  filtered.forEach(c => {
    const row = document.createElement('tr');
    if (selectedCandidateId === c.id) row.className = "selected";
    
    // Role alignment maps to qualitative bands
    const alignmentClass = c.roleAlignment === "Strong Match" ? "text-success" : c.roleAlignment === "Moderate Match" ? "text-accent" : "text-danger";
    
    row.innerHTML = `
      <td>
        <div class="cand-name-block">
          <div class="cand-avatar">${c.name.split(" ").map(w => w[0]).join("")}</div>
          <div>
            <div style="font-weight: 700; color: var(--text-primary);">${c.name}</div>
            <div class="cand-title">${c.title}</div>
          </div>
        </div>
      </td>
      <td><strong style="color:var(--primary); font-family:monospace;">${c.atsScore}%</strong></td>
      <td><strong class="${alignmentClass}">${c.roleAlignment}</strong></td>
      <td><strong style="color:var(--success); font-family:monospace;">${c.bulletIndex}%</strong></td>
      <td>
        <span class="badge-status ${c.status.toLowerCase()}">${c.stage}</span>
      </td>
    `;
    row.addEventListener('click', () => selectCandidateRow(c.id, row));
    tableBody.appendChild(row);
  });
  
  if (window.lucide) {
    lucide.createIcons();
  }
}

function selectCandidateRow(candId, rowElement) {
  selectedCandidateId = candId;
  const rows = document.querySelectorAll('#leaderboardBody tr');
  rows.forEach(r => r.classList.remove('selected'));
  rowElement.classList.add('selected');

  const cand = recruiterCandidates.find(c => c.id === candId);
  if (!cand) return;

  const panel = document.getElementById('candidateInspectPanel');
  document.getElementById('inspectName').textContent = cand.name;
  document.getElementById('inspectTitle').textContent = cand.title;
  document.getElementById('inspectInsights').textContent = cand.insights;
  document.getElementById('inspectEmail').textContent = cand.email;
  document.getElementById('inspectGit').textContent = cand.github;
  document.getElementById('inspectExp').textContent = cand.experience;

  const shortlistBtn = document.getElementById('inspectShortlistBtn');
  if (cand.status === 'Shortlist') {
    shortlistBtn.innerHTML = "<i data-lucide='check' class='icon-xs'></i> Shortlisted";
    shortlistBtn.className = "btn btn-primary";
  } else {
    shortlistBtn.innerHTML = "<i data-lucide='plus' class='icon-xs'></i> Shortlist Candidate";
    shortlistBtn.className = "btn btn-glow";
  }

  shortlistBtn.onclick = () => toggleCandidateShortlist(cand.id);

  const heatmapGrid = document.getElementById('inspectHeatmap');
  heatmapGrid.innerHTML = cand.techStack.map(s => {
    let val = "high";
    if (s === "Express" || s === "MongoDB") val = "mid";
    if (s === "CI/CD" || s === "Docker") val = "low";
    return `<div class="heatmap-block ${val}">${s}</div>`;
  }).join('');

  panel.classList.add('active');
  renderRecruiterRadarChart(cand.skills);
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  
  if (window.lucide) {
    lucide.createIcons();
  }
}

function closeInspector() {
  const panel = document.getElementById('candidateInspectPanel');
  panel.classList.remove('active');
  selectedCandidateId = null;
  renderLeaderboard();
}

function toggleCandidateShortlist(candId) {
  const cand = recruiterCandidates.find(c => c.id === candId);
  if (!cand) return;

  if (cand.status === 'Shortlist') {
    cand.status = 'Review';
    cand.stage = 'Applied';
    showToast(`Removed ${cand.name} from Shortlist`, 'success');
  } else {
    cand.status = 'Shortlist';
    cand.stage = 'Manager Review';
    showToast(`Shortlisted ${cand.name}!`, 'success');
  }
  renderLeaderboard();
  const rowElement = document.querySelector('#leaderboardBody tr.selected');
  if (rowElement) selectCandidateRow(candId, rowElement);
}

function renderRecruiterRadarChart(skills) {
  const ctx = document.getElementById('recruiterRadarChart').getContext('2d');
  if (recruiterRadarChart) recruiterRadarChart.destroy();

  recruiterRadarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Frontend', 'Backend', 'DevOps Systems', 'AI/Data Science', 'Agile Leadership'],
      datasets: [{
        label: 'Candidate Competency Ratio',
        data: [skills.frontend, skills.backend, skills.devops, skills.aiData, skills.agile],
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderColor: '#8b5cf6',
        pointBackgroundColor: '#8b5cf6',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          grid: { color: 'rgba(255, 255, 255, 0.08)' },
          angleLines: { color: 'rgba(255, 255, 255, 0.08)' },
          pointLabels: {
            color: '#a1a1aa',
            font: { size: 10, weight: 'bold' }
          },
          ticks: { display: false, maxTicksLimit: 3 },
          suggestedMin: 20,
          suggestedMax: 100
        }
      },
      plugins: { legend: { display: false } }
    }
  });
}

function exportRecruiterCSV() {
  let csv = "Name,Job Title,Email,GitHub profile,Comp Score,Role Alignment,Bullet Index,Pipeline Stage\n";
  recruiterCandidates.forEach(c => {
    csv += `"${c.name}","${c.title}","${c.email}","${c.github}",${c.atsScore}%,${c.roleAlignment},${c.bulletIndex}%,"${c.stage}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "applygeniuz_applicants_leaderboard.csv";
  a.click();
  URL.revokeObjectURL(url);
  showToast("Exported candidate database to CSV!", 'success');
}

/* ====================================================================
   9. PREMIUM ROLE-BASED AUTHENTICATION SYSTEM
   ==================================================================== */

let currentUser = null;
let mockUsers = [
  { id: "u1", name: "Marcus Sterling", email: "marcus@veloscale.com", role: "RECRUITER", signupDate: "2026-05-15T08:30:00.000Z", status: "Active" },
  { id: "u2", name: "Sarah Jenkins", email: "s.jenkins@cloudtech.io", role: "RECRUITER", signupDate: "2026-05-18T10:45:00.000Z", status: "Active" },
  { id: "u3", name: "Alex Rivera", email: "alex.rivera@gmail.com", role: "STUDENT", signupDate: "2026-05-20T14:15:00.000Z", status: "Active" },
  { id: "u4", name: "Priya Patel", email: "priya.patel@devbox.net", role: "STUDENT", signupDate: "2026-05-22T11:00:00.000Z", status: "Active" },
  { id: "u5", name: "Jordan Chen", email: "jordan.chen@academic.edu", role: "STUDENT", signupDate: "2026-05-24T09:20:00.000Z", status: "Active" },
  { id: "u6", name: "Admin Geniuz", email: "admin@applygeniuz.com", role: "ADMIN", signupDate: "2026-05-01T08:00:00.000Z", status: "Active" }
];

let adminTrendChart = null;

function initAuthSystem() {
  const navAuthBtn = document.getElementById('navAuthBtn');
  const navUserDropdown = document.getElementById('navUserDropdown');
  const navProfileBtn = document.getElementById('navProfileBtn');
  const userMenuItems = document.getElementById('userMenuItems');
  const btnLogout = document.getElementById('btnLogout');
  const toggleAdmin = document.getElementById('toggleAdmin');
  
  // Auth view toggles
  const tabAuthLogin = document.getElementById('tabAuthLogin');
  const tabAuthSignup = document.getElementById('tabAuthSignup');
  const authLoginForm = document.getElementById('authLoginForm');
  const authSignupForm = document.getElementById('authSignupForm');
  const authForgotForm = document.getElementById('authForgotForm');
  const authGoForgotPassword = document.getElementById('authGoForgotPassword');
  const authBackToLogin = document.getElementById('authBackToLogin');
  
  // Forms submit
  const signupRole = document.getElementById('signupRole');
  const signupGithubField = document.getElementById('signupGithubField');

  // Load user session from local storage if available
  const storedUser = localStorage.getItem('applygeniuz_session');
  if (storedUser) {
    try {
      currentUser = JSON.parse(storedUser);
      applyLoginState(currentUser);
    } catch (e) {
      console.error("Session parse error", e);
    }
  }

  // Navbar auth triggers
  if (navAuthBtn) {
    navAuthBtn.addEventListener('click', () => {
      switchView('auth');
      showAuthPanel('login');
    });
  }

  if (navProfileBtn && userMenuItems) {
    navProfileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userMenuItems.style.display = userMenuItems.style.display === 'none' ? 'flex' : 'none';
    });
    
    document.addEventListener('click', () => {
      userMenuItems.style.display = 'none';
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      logoutUser();
    });
  }

  // Auth Switch Tabs
  if (tabAuthLogin && tabAuthSignup && authLoginForm && authSignupForm && authForgotForm) {
    tabAuthLogin.addEventListener('click', () => {
      tabAuthLogin.classList.add('active');
      tabAuthSignup.classList.remove('active');
      authLoginForm.style.display = 'block';
      authSignupForm.style.display = 'none';
      authForgotForm.style.display = 'none';
    });

    tabAuthSignup.addEventListener('click', () => {
      tabAuthSignup.classList.add('active');
      tabAuthLogin.classList.remove('active');
      authLoginForm.style.display = 'none';
      authSignupForm.style.display = 'block';
      authForgotForm.style.display = 'none';
    });
  }

  if (authGoForgotPassword && authLoginForm && authForgotForm) {
    authGoForgotPassword.addEventListener('click', (e) => {
      e.preventDefault();
      authLoginForm.style.display = 'none';
      authForgotForm.style.display = 'block';
    });
  }

  if (authBackToLogin && authLoginForm && authForgotForm) {
    authBackToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      authForgotForm.style.display = 'none';
      authLoginForm.style.display = 'block';
    });
  }

  if (signupRole && signupGithubField) {
    signupRole.addEventListener('change', (e) => {
      if (e.target.value === 'STUDENT') {
        signupGithubField.style.display = 'block';
      } else {
        signupGithubField.style.display = 'none';
      }
    });
  }

  // LOGIN SUBMIT
  const authLoginFormEl = document.getElementById('authLoginForm');
  if (authLoginFormEl) {
    authLoginFormEl.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;

      if (!email || !password) {
        showToast("Please provide all login credentials.", "error");
        return;
      }

      showToast("Verifying identity gateway...", "success");

      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (response.ok) {
          const data = await response.json();
          currentUser = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            token: data.token
          };
          localStorage.setItem('applygeniuz_session', JSON.stringify(currentUser));
          applyLoginState(currentUser);
          showToast(`Access granted! Welcome, ${currentUser.name}.`, "success");
          
          if (currentUser.role === 'STUDENT') switchView('student');
          else if (currentUser.role === 'RECRUITER') switchView('recruiter');
          else if (currentUser.role === 'ADMIN') switchView('admin');
        } else {
          const err = await response.json();
          throw new Error(err.error || "Access Denied.");
        }
      } catch (err) {
        console.warn("Backend auth offline. Initiating high-fidelity simulated failover...", err);
        // Database offline fallback mock accounts
        let matched = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        // Let admin login offline too
        if (email.toLowerCase() === 'admin@applygeniuz.com') {
          matched = { id: "u6", name: "Admin Geniuz", email: "admin@applygeniuz.com", role: "ADMIN" };
        } else if (!matched) {
          // Dynamic mock login for test ease
          matched = {
            id: "umock_" + Math.random().toString(36).substr(2, 9),
            name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            email,
            role: email.toLowerCase().includes('recruiter') ? 'RECRUITER' : 'STUDENT'
          };
        }

        currentUser = {
          id: matched.id,
          name: matched.name,
          email: matched.email,
          role: matched.role,
          token: "mock_jwt_token_" + matched.id
        };

        localStorage.setItem('applygeniuz_session', JSON.stringify(currentUser));
        applyLoginState(currentUser);
        showToast(`Access granted (Offline simulation)! Welcome, ${currentUser.name}.`, "success");
        
        if (currentUser.role === 'STUDENT') switchView('student');
        else if (currentUser.role === 'RECRUITER') switchView('recruiter');
        else if (currentUser.role === 'ADMIN') switchView('admin');
      }
    });
  }

  // SIGNUP SUBMIT
  const authSignupFormEl = document.getElementById('authSignupForm');
  if (authSignupFormEl) {
    authSignupFormEl.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('signupName').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const password = document.getElementById('signupPassword').value;
      const role = document.getElementById('signupRole').value;
      const githubUser = document.getElementById('signupGithub').value.trim();

      if (!name || !email || !password) {
        showToast("Please provide all registration requirements.", "error");
        return;
      }

      if (password.length < 6) {
        showToast("Password must be at least 6 characters.", "error");
        return;
      }

      showToast("Registering credentials on secure node...", "success");

      try {
        const response = await fetch('http://localhost:5000/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, role, githubUser })
        });

        if (response.ok) {
          const data = await response.json();
          currentUser = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            token: data.token
          };
          localStorage.setItem('applygeniuz_session', JSON.stringify(currentUser));
          applyLoginState(currentUser);
          showToast(`Account registered! Welcome, ${currentUser.name}.`, "success");
          
          if (currentUser.role === 'STUDENT') switchView('student');
          else if (currentUser.role === 'RECRUITER') switchView('recruiter');
        } else {
          const err = await response.json();
          throw new Error(err.error || "Registration faulted.");
        }
      } catch (err) {
        console.warn("Backend auth offline. Caching mock signup in local session...", err);
        
        currentUser = {
          id: "umock_" + Math.random().toString(36).substr(2, 9),
          name,
          email,
          role,
          token: "mock_jwt_token_new"
        };

        // Cache mock user inside directory list for admin panel simulation
        mockUsers.push({
          id: currentUser.id,
          name,
          email,
          role,
          signupDate: new Date().toISOString(),
          status: "Active"
        });

        localStorage.setItem('applygeniuz_session', JSON.stringify(currentUser));
        applyLoginState(currentUser);
        showToast(`Account registered (Offline simulation)! Welcome, ${currentUser.name}.`, "success");
        
        if (currentUser.role === 'STUDENT') switchView('student');
        else if (currentUser.role === 'RECRUITER') switchView('recruiter');
      }
    });
  }

  // RECOVERY RESET SUBMIT
  const authForgotFormEl = document.getElementById('authForgotForm');
  if (authForgotFormEl) {
    authForgotFormEl.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('forgotEmail').value.trim();
      showToast(`Recovery dispatch sent to: ${email}`, "success");
      authForgotFormEl.reset();
      showAuthPanel('login');
    });
  }
}

function showAuthPanel(panel) {
  const tabAuthLogin = document.getElementById('tabAuthLogin');
  const tabAuthSignup = document.getElementById('tabAuthSignup');
  const authLoginForm = document.getElementById('authLoginForm');
  const authSignupForm = document.getElementById('authSignupForm');
  const authForgotForm = document.getElementById('authForgotForm');

  if (panel === 'login') {
    if (tabAuthLogin) tabAuthLogin.click();
  } else if (panel === 'signup') {
    if (tabAuthSignup) tabAuthSignup.click();
  }
}

function applyLoginState(user) {
  const navAuthBtn = document.getElementById('navAuthBtn');
  const navUserDropdown = document.getElementById('navUserDropdown');
  const navUserName = document.getElementById('navUserName');
  const navUserAvatar = document.getElementById('navUserAvatar');
  const navUserRoleBadge = document.getElementById('navUserRoleBadge');
  const toggleAdmin = document.getElementById('toggleAdmin');

  if (navAuthBtn) navAuthBtn.style.display = 'none';
  if (navUserDropdown) navUserDropdown.style.display = 'block';
  if (navUserName) navUserName.textContent = user.name;
  if (navUserAvatar) navUserAvatar.textContent = user.name.charAt(0).toUpperCase();

  if (navUserRoleBadge) {
    navUserRoleBadge.textContent = user.role;
    navUserRoleBadge.className = `badge-status ${user.role.toLowerCase()}`;
  }

  if (toggleAdmin) {
    if (user.role === 'ADMIN') {
      toggleAdmin.style.display = 'inline-flex';
    } else {
      toggleAdmin.style.display = 'none';
    }
  }

  // Refresh active workspaces data lists
  renderStudentHistory();
  renderRecruiterHistory();
  renderAdminDashboard();
}

function logoutUser() {
  localStorage.removeItem('applygeniuz_session');
  currentUser = null;

  const navAuthBtn = document.getElementById('navAuthBtn');
  const navUserDropdown = document.getElementById('navUserDropdown');
  const toggleAdmin = document.getElementById('toggleAdmin');

  if (navAuthBtn) navAuthBtn.style.display = 'block';
  if (navUserDropdown) navUserDropdown.style.display = 'none';
  if (toggleAdmin) toggleAdmin.style.display = 'none';

  showToast("Logged out successfully.", "success");
  switchView('landing');
}

/* ====================================================================
   10. PERSISTENT WORKSPACES & HISTORICAL TELEMETRY ENGINE
   ==================================================================== */

function initSavedWorkspaces() {
  // Overwrite Student run assessment trigger to automatically persist
  const studentAnalyzeBtn = document.getElementById('studentAnalyzeBtn');
  if (studentAnalyzeBtn) {
    studentAnalyzeBtn.addEventListener('click', () => {
      // Small timeout to allow computation to finalize before caching
      setTimeout(() => {
        const resumeText = document.getElementById('studentResumeText').value.trim();
        const jobText = document.getElementById('studentJobText').value.trim();
        const atsText = document.getElementById('scoreATS').textContent;
        const bulletText = document.getElementById('scoreBullet').textContent;
        const readabilityText = document.getElementById('scoreReadability').textContent;
        
        if (resumeText && atsText !== '—') {
          saveStudentSession({
            title: resumeText.split('\n')[0].trim().slice(0, 30) || "Resume Assessment",
            text: resumeText,
            jobCriteria: jobText,
            ats: parseInt(atsText) || 70,
            bullet: parseInt(bulletText) || 60,
            readability: parseInt(readabilityText) || 80,
            timestamp: new Date().toISOString()
          });
        }
      }, 1500);
    });
  }

  // Overwrite Recruiter match button to persist screening batch session
  const recruiterProcessBtn = document.getElementById('recruiterProcessBtn');
  if (recruiterProcessBtn) {
    recruiterProcessBtn.addEventListener('click', () => {
      setTimeout(() => {
        const roleText = document.getElementById('recruiterRoleSelect').value;
        const avgATS = Math.round(recruiterCandidates.reduce((sum, c) => sum + c.atsScore, 0) / recruiterCandidates.length) || 75;
        
        if (recruiterCandidates.length > 0) {
          saveRecruiterSession({
            campaign: roleText === 'frontend' ? 'Senior Frontend Engineer' : roleText === 'backend' ? 'Backend Microservices Lead' : 'Platform Developer',
            avgAts: avgATS,
            count: recruiterCandidates.length,
            candidates: JSON.parse(JSON.stringify(recruiterCandidates)),
            timestamp: new Date().toISOString()
          });
        }
      }, 1800);
    });
  }
}

// Student History
function saveStudentSession(session) {
  if (!currentUser) return; // Only cache when logged in
  
  const cacheKey = `applygeniuz_student_history_${currentUser.id}`;
  let history = [];
  try {
    history = JSON.parse(localStorage.getItem(cacheKey)) || [];
  } catch (e) {}

  // Prevent identical duplicate listings
  history = history.filter(h => h.title !== session.title);
  history.unshift(session);
  
  // Max 5 saved history entries
  if (history.length > 5) history.pop();
  
  localStorage.setItem(cacheKey, JSON.stringify(history));

  // Sync to database
  fetch('http://localhost:5000/api/resumes/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentId: currentUser.id,
      title: session.title,
      text: session.text,
      ats: session.ats,
      bullet: session.bullet,
      readability: session.readability
    })
  }).catch(e => console.warn("Offline: Database resume sync cached locally."));

  renderStudentHistory();

  // Populate Admin live feeds
  triggerAdminLiveActivity({
    name: currentUser.name,
    jobTitle: session.title,
    atsScore: session.ats,
    status: 'Applied'
  });
}

function renderStudentHistory() {
  const container = document.getElementById('studentWorkspaceHistory');
  if (!container) return;

  if (!currentUser || currentUser.role !== 'STUDENT') {
    container.innerHTML = `
      <div class="empty-state" style="padding: 1.5rem 1rem;">
        <p style="font-size: 0.8rem; color: var(--text-tertiary); margin:0;">Please <a href="#" onclick="switchView('auth'); showAuthPanel('login'); return false;" style="color:var(--primary); font-weight:600; text-decoration:none;">Sign In</a> to activate persistent workspaces and saved session history.</p>
      </div>
    `;
    return;
  }

  const cacheKey = `applygeniuz_student_history_${currentUser.id}`;
  let history = [];
  try {
    history = JSON.parse(localStorage.getItem(cacheKey)) || [];
  } catch (e) {}

  if (history.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding: 1.5rem 1rem;">
        <p style="font-size: 0.8rem; color: var(--text-tertiary); margin:0;">No saved sessions yet. Run an alignment assessment to automatically persist your workspace.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = "";
  history.forEach((session, idx) => {
    const dateStr = new Date(session.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
    const row = document.createElement('div');
    row.className = "history-item-row";
    row.innerHTML = `
      <div class="history-meta">
        <span class="history-title">${session.title}</span>
        <span class="history-subtitle">Score: <strong style="color:var(--primary);">${session.ats}%</strong> | optimized ${dateStr}</span>
      </div>
      <div class="history-actions">
        <button class="btn btn-secondary" style="padding:0.35rem 0.6rem; font-size:0.7rem;" onclick="loadStudentSession(${idx})">
          <i data-lucide="folder-open" class="icon-xs" style="width:12px; height:12px; margin-right:0.2rem;"></i> Restore
        </button>
      </div>
    `;
    container.appendChild(row);
  });

  if (window.lucide) lucide.createIcons();
}

window.loadStudentSession = function(index) {
  if (!currentUser) return;
  const cacheKey = `applygeniuz_student_history_${currentUser.id}`;
  let history = [];
  try {
    history = JSON.parse(localStorage.getItem(cacheKey)) || [];
  } catch (e) {}

  const session = history[index];
  if (!session) return;

  const resumeText = document.getElementById('studentResumeText');
  const jobText = document.getElementById('studentJobText');
  
  if (resumeText) resumeText.value = session.text;
  if (jobText) jobText.value = session.jobCriteria;

  showToast("Restoring workspace credentials...", "success");

  // Re-run diagnostic parsing locally to populate panels
  setTimeout(() => {
    runStudentSemanticAssessment();
    showToast("Workspace session restored successfully!", "success");
  }, 400);
};

// Recruiter History
function saveRecruiterSession(session) {
  if (!currentUser) return;
  
  const cacheKey = `applygeniuz_recruiter_history_${currentUser.id}`;
  let history = [];
  try {
    history = JSON.parse(localStorage.getItem(cacheKey)) || [];
  } catch (e) {}

  history = history.filter(h => h.campaign !== session.campaign);
  history.unshift(session);
  
  if (history.length > 5) history.pop();
  
  localStorage.setItem(cacheKey, JSON.stringify(history));
  renderRecruiterHistory();
}

function renderRecruiterHistory() {
  const container = document.getElementById('recruiterWorkspaceHistory');
  if (!container) return;

  if (!currentUser || currentUser.role !== 'RECRUITER') {
    container.innerHTML = `
      <div class="empty-state" style="padding:0.75rem; text-align:center;">
        <p style="font-size:0.75rem; color:var(--text-tertiary); margin:0;">Please <a href="#" onclick="switchView('auth'); showAuthPanel('login'); return false;" style="color:var(--primary); font-weight:600; text-decoration:none;">Sign In</a> to activate persistent workspaces.</p>
      </div>
    `;
    return;
  }

  const cacheKey = `applygeniuz_recruiter_history_${currentUser.id}`;
  let history = [];
  try {
    history = JSON.parse(localStorage.getItem(cacheKey)) || [];
  } catch (e) {}

  if (history.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding:0.75rem; text-align:center;">
        <p style="font-size:0.75rem; color:var(--text-tertiary); margin:0;">No saved batches. Run batch matches to cache history.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = "";
  history.forEach((session, idx) => {
    const dateStr = new Date(session.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const row = document.createElement('div');
    row.className = "history-item-row";
    row.style.padding = "0.5rem 0.75rem";
    row.style.marginBottom = "0.4rem";
    row.innerHTML = `
      <div class="history-meta">
        <span class="history-title" style="font-size:0.75rem;">${session.campaign}</span>
        <span class="history-subtitle" style="font-size:0.65rem;">${session.count} applicants | Avg ${session.avgAts}% | ${dateStr}</span>
      </div>
      <div class="history-actions">
        <button class="btn btn-secondary" style="padding:0.25rem 0.45rem; font-size:0.65rem;" onclick="loadRecruiterSession(${idx})">
          Load
        </button>
      </div>
    `;
    container.appendChild(row);
  });
}

window.loadRecruiterSession = function(index) {
  if (!currentUser) return;
  const cacheKey = `applygeniuz_recruiter_history_${currentUser.id}`;
  let history = [];
  try {
    history = JSON.parse(localStorage.getItem(cacheKey)) || [];
  } catch (e) {}

  const session = history[index];
  if (!session) return;

  recruiterCandidates = session.candidates;
  showToast(`Reloading campaign candidates list...`, "success");
  
  setTimeout(() => {
    renderLeaderboard();
    showToast(`Screening campaign restored!`, "success");
  }, 400);
};

/* ====================================================================
   11. DATA-DRIVEN ADMINISTRATION CONTROLLER
   ==================================================================== */

let liveAdminLogs = [
  { candidateName: "Sarah Jenkins", jobTitle: "Backend Microservices Lead", atsScore: 89, status: "Shortlist", timestamp: new Date(Date.now() - 3600000).toISOString() },
  { candidateName: "Jordan Chen", jobTitle: "Data Scientist / AI Developer", atsScore: 82, status: "Review", timestamp: new Date(Date.now() - 7200000).toISOString() },
  { candidateName: "Priya Patel", jobTitle: "Fullstack Platform Engineer", atsScore: 76, status: "Review", timestamp: new Date(Date.now() - 10800000).toISOString() }
];

function initAdminControls() {
  const adminUserSearch = document.getElementById('adminUserSearch');
  const adminRoleFilter = document.getElementById('adminRoleFilter');

  if (adminUserSearch) {
    adminUserSearch.addEventListener('input', () => renderAdminUserDirectory());
  }

  if (adminRoleFilter) {
    adminRoleFilter.addEventListener('change', () => renderAdminUserDirectory());
  }
}

async function renderAdminDashboard() {
  if (!currentUser || currentUser.role !== 'ADMIN') return;

  const admTotalUsers = document.getElementById('admTotalUsers');
  const admActiveUsers = document.getElementById('admActiveUsers');
  const admTotalResumes = document.getElementById('admTotalResumes');
  const admTotalJobs = document.getElementById('admTotalJobs');

  showToast("Polling system telemetry data...", "success");

  try {
    const response = await fetch('http://localhost:5000/api/admin/analytics');
    if (response.ok) {
      const data = await response.json();
      
      if (admTotalUsers) admTotalUsers.textContent = data.stats.users.total;
      if (admActiveUsers) admActiveUsers.textContent = data.stats.users.active;
      if (admTotalResumes) admTotalResumes.textContent = data.stats.activity.totalResumes || 28;
      if (admTotalJobs) admTotalJobs.textContent = data.stats.activity.totalJobs || 6;

      renderAdminUserDirectory(data.recentSignups);
      renderAdminActivityStream(data.recentActivity);
      renderAdminTrendsChart(data.usageTrends);
    } else {
      throw new Error();
    }
  } catch (err) {
    console.warn("Backend admin offline. Loading mock telemetry indices...", err);
    // Offline simulated dashboard counts
    if (admTotalUsers) admTotalUsers.textContent = mockUsers.length;
    if (admActiveUsers) admActiveUsers.textContent = Math.round(mockUsers.length * 0.85);
    const parsedResumesCount = 14 + (recruiterCandidates.length - 4);
    if (admTotalResumes) admTotalResumes.textContent = parsedResumesCount;
    if (admTotalJobs) admTotalJobs.textContent = 4;

    renderAdminUserDirectory();
    renderAdminActivityStream();
    renderAdminTrendsChart();
  }
}

function renderAdminUserDirectory(apiUsers = null) {
  const tbody = document.getElementById('adminUserTableBody');
  const searchVal = document.getElementById('adminUserSearch')?.value.toLowerCase() || "";
  const roleVal = document.getElementById('adminRoleFilter')?.value || "ALL";

  if (!tbody) return;
  tbody.innerHTML = "";

  const usersList = apiUsers || mockUsers;

  const filtered = usersList.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchVal) || u.email.toLowerCase().includes(searchVal);
    const matchRole = roleVal === 'ALL' || u.role === roleVal;
    return matchSearch && matchRole;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="empty-state" style="padding:1.5rem 0;">No matching users indexed.</td>
      </tr>
    `;
    return;
  }

  filtered.forEach(u => {
    const dateStr = new Date(u.signupDate || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div style="font-weight: 700; color: var(--text-primary);">${u.name}</div>
        <div style="font-size: 0.75rem; color: var(--text-secondary);">${u.email}</div>
      </td>
      <td>
        <span class="badge-role ${u.role.toLowerCase()}">${u.role}</span>
      </td>
      <td style="color:var(--text-secondary); font-family:monospace; font-size:0.8rem;">${dateStr}</td>
      <td>
        <span class="badge-status shortlist" style="background:rgba(16,185,129,0.1); color:var(--success);">Active</span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderAdminActivityStream(apiActivity = null) {
  const tbody = document.getElementById('adminActivityTableBody');
  if (!tbody) return;
  tbody.innerHTML = "";

  const activities = apiActivity || liveAdminLogs;

  activities.forEach(act => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div style="font-weight: 700; color: var(--text-primary);">${act.candidateName}</div>
        <div style="font-size:0.75rem; color:var(--text-secondary);">${act.candidateEmail || 'candidate@gmail.com'}</div>
      </td>
      <td style="font-size: 0.8rem; font-weight:600;">${act.jobTitle.slice(0, 30)}...</td>
      <td><strong style="color:var(--primary); font-family:monospace;">${act.atsScore}%</strong></td>
      <td>
        <span class="badge-status ${act.status.toLowerCase()}">Applied</span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function triggerAdminLiveActivity(log) {
  liveAdminLogs.unshift({
    candidateName: log.name,
    candidateEmail: currentUser?.email || 'N/A',
    jobTitle: log.jobTitle,
    atsScore: log.atsScore,
    status: log.status || 'Applied',
    timestamp: new Date().toISOString()
  });
  if (liveAdminLogs.length > 10) liveAdminLogs.pop();
  renderAdminDashboard();
}

function renderAdminTrendsChart(apiTrends = null) {
  const ctx = document.getElementById('adminTrendChart');
  if (!ctx) return;

  const ctx2d = ctx.getContext('2d');
  if (adminTrendChart) adminTrendChart.destroy();

  const labels = apiTrends ? apiTrends.map(t => t.name) : ["React.js", "TypeScript", "Node.js", "Express", "PostgreSQL", "Docker"];
  const counts = apiTrends ? apiTrends.map(t => t.count) : [12, 9, 10, 8, 6, 5];

  adminTrendChart = new Chart(ctx2d, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Candidate Affinity Hits',
        data: counts,
        backgroundColor: 'rgba(59, 130, 246, 0.45)',
        borderColor: '#3b82f6',
        borderWidth: 1.5,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#a1a1aa', font: { size: 9, weight: 'bold' } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#a1a1aa', font: { size: 9 }, stepSize: 3 }
        }
      },
      plugins: { legend: { display: false } }
    }
  });
}

/* ====================================================================
   6. PREMIUM MOUSE PARALLAX TILT ENGINE
   ==================================================================== */

function initCardParallax() {
  // Select all target card containers
  const cards = document.querySelectorAll(
    '.hero-preview-container, .preview-widget, .fail-card, .workflow-step, .comparison-card, .testimonial-card, .metric-widget'
  );
  
  cards.forEach(card => {
    // Dynamically insert light glow element if not already present
    let lightGlow = card.querySelector('.card-light-glow');
    if (!lightGlow) {
      lightGlow = document.createElement('div');
      lightGlow.className = 'card-light-glow';
      card.appendChild(lightGlow);
    }
    
    // Set 3D preserve context
    card.style.transformStyle = 'preserve-3d';
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate normal offset relative to center
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const percentX = (x - centerX) / centerX;
      const percentY = (y - centerY) / centerY;
      
      // Calculate rotate coordinates (strictly capped at 2.5 degrees max for maximum subtlety!)
      const rotateX = (-percentY * 2.5).toFixed(2);
      const rotateY = (percentX * 2.5).toFixed(2);
      
      // Check theme to adjust dynamic shadow contrast
      const isLightTheme = document.body.classList.contains('light-theme');
      const shadowColor = isLightTheme ? 'rgba(0, 0, 0, 0.04)' : 'rgba(0, 0, 0, 0.28)';
      
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
      card.style.boxShadow = `${(-percentX * 4).toFixed(1)}px ${( -percentY * 4 + 8).toFixed(1)}px 24px ${shadowColor}`;
      
      // Highlight coordinates of soft light follow
      lightGlow.style.opacity = '1';
      lightGlow.style.background = `radial-gradient(circle 100px at ${x}px ${y}px, rgba(249, 115, 22, 0.07), transparent)`;
    });
    
    card.addEventListener('mouseleave', () => {
      // Reset back to baseline smoothly
      card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0)';
      card.style.boxShadow = '';
      lightGlow.style.opacity = '0';
    });
  });
}
