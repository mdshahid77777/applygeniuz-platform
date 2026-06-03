
# 🚀 ApplyGeniuz — AI Recruitment & Resume Intelligence Platform

A full-stack AI-powered SaaS platform for optimizing resumes, analyzing ATS compatibility, improving recruiter visibility, and streamlining intelligent resume assessment workflows for students and job seekers.

The platform provides semantic resume analysis, AI-powered optimization, secure authentication, scalable backend infrastructure, recruiter-focused scoring systems, and real-time resume intelligence operations.

---

# ✨ Features

* 🤖 AI-Powered Resume Optimization
* 📄 ATS Compatibility & Resume Scoring
* 🧠 Semantic Resume Intelligence Engine
* 🔐 JWT Authentication & Protected Routes
* 📊 Readability & Bullet Impact Analysis
* 💼 Job Description Matching System
* ⚡ Real-Time Resume Feedback
* 📁 PDF Resume Parsing Infrastructure
* 🛡️ Middleware-Based Authorization
* 🚀 Scalable REST API Architecture
* 📈 Resume History Tracking
* 🧠 Concept-Based Semantic Matching

---

# 🏗️ Tech Stack

## Backend

* Node.js
* Express.js
* PostgreSQL
* Prisma ORM
* JWT Authentication
* Multer
* pdf-parse

## Frontend

* React.js
* TypeScript
* Tailwind CSS
* React Query
* Axios
* Framer Motion

## AI & Resume Intelligence

* OpenAI API
* Semantic Matching Engine
* ATS Optimization Logic
* Resume Parsing Algorithms

---

# 🧠 System Architecture

## Authentication & Authorization

Implemented:

* JWT-based authentication
* Middleware-driven route protection
* Secure authorization workflows
* Protected dashboard APIs

---

## Resume Intelligence Infrastructure

Integrated AI-powered resume assessment system with:

* Resume parsing
* Semantic overlap analysis
* ATS compatibility scoring
* Keyword gap detection
* Bullet impact validation
* Readability calculations
* Role alignment evaluation

---

## Semantic Assessment Engine

Implemented:

* Concept-group synonym matching
* Resume semantic scoring
* Recruiter-focused optimization checks
* Resume ranking infrastructure
* Intelligent keyword matching

This improves resume analysis accuracy and recruiter compatibility evaluation performance.

---

# 📂 Project Structure

```bash
applygeniuz-platform/
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── resumes.js
│   │   │   └── jobs.js
│   │   │
│   │   ├── services/
│   │   │   └── semanticEngine.js
│   │   │
│   │   └── app.js
│   │
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=5000

NODE_ENV=development

DATABASE_URL=your_postgresql_connection

JWT_SECRET=your_jwt_secret

OPENAI_API_KEY=your_openai_key
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/applygeniuz-platform.git
```

---

## Install Backend Dependencies

```bash
cd backend
npm install
```

---

## Setup Prisma Database

```bash
npx prisma generate
```

```bash
npx prisma migrate dev --name init_applygeniuz_db
```

---

## Run Backend

```bash
npm run dev
```

---

## Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## Run Frontend

```bash
npm run dev
```

---

# 📡 Core Modules

* Authentication System
* Resume Parsing Engine
* ATS Optimization System
* Semantic Matching Engine
* Resume Score Dashboard
* Job Description Analyzer
* Resume History Tracking
* Recruiter Compatibility Analysis

---

# 📈 Future Improvements

* AI-generated cover letters
* Multi-role resume generation
* Resume version comparison
* Recruiter analytics dashboard
* Resume export templates
* AI interview preparation system
* Notification infrastructure
* Activity audit logs

---

# 🧠 Key Learnings

This project helped strengthen understanding of:

* AI workflow architecture
* Resume intelligence systems
* ATS optimization strategies
* Semantic analysis engines
* Backend scalability patterns
* Authentication & authorization
* PostgreSQL & Prisma workflows
* REST API architecture
* Production-grade SaaS development

---

# 🌐 Live Demo

https://applygeniuz.netlify.app/

---

# 📌 Author

Md Shahid

---

# ⚠️ Note

This project is actively evolving with a focus on building scalable AI-powered recruitment infrastructure, production-grade resume intelligence systems, and advanced ATS optimization workflows.
