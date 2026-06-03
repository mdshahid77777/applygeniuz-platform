# ApplyGeniuz Backend Infrastructure

This is the production-ready Node.js + Express backend service for **ApplyGeniuz** (AI Recruitment & Resume Intelligence Platform). It utilizes **Prisma ORM** for database connections with **PostgreSQL** and incorporates a highly optimized semantic assessment engine.

---

## Technical Stack & Architecture

- **Runtime Environment:** Node.js v18+
- **API Framework:** Express.js with CORS and Multer in-memory file streams
- **Database Layer:** PostgreSQL connected through Prisma Client ORM
- **Text Parser Node:** `pdf-parse` for fast client-to-server buffer parsing
- **Algorithmic Engine:** Concept-group synonym dictionaries and bullet impact checkers

---

## Directory Layout

```
backend/
├── package.json          # Server dependencies & scripts
├── prisma/
│   └── schema.prisma     # Relational database models (PostgreSQL)
├── src/
│   ├── app.js            # Express app entrypoint
│   ├── routes/
│   │   ├── auth.js       # JWT & BCrypt auth routes
│   │   ├── resumes.js    # PDF parsing & resumes score savers
│   │   └── jobs.js       # Job posters & applicant leaderboards
│   └── services/
│       └── semanticEngine.js # Shared concept-matching logic
└── README.md             # This document
```

---

## Setup & Local Installation

### 1. Configure Environment Variables
Create a `.env` file in the root of the `backend/` directory:

```env
PORT=5000
NODE_ENV=development

# Database Connection (Replace with local PostgreSQL credentials)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/applygeniuz_db?schema=public"

# Authorization Secrets
JWT_SECRET="applygeniuz_super_secret_token"
```

### 2. Install Server Dependencies
Execute standard package install from your command prompt:

```bash
npm install
```

### 3. Initialize Prisma & PostgreSQL Migrations
Deploy SQL schema tables to your running PostgreSQL server instance:

```bash
# Generate Prisma JavaScript Client
npx prisma generate

# Create and deploy PostgreSQL database tables
npx prisma migrate dev --name init_applygeniuz_db
```

### 4. Boot Express Server
Run the local hot-reloader or production start scripts:

```bash
# Launch in hot-reload mode
npm run dev

# Launch in production mode
npm start
```

---

## Primary API Endpoints Map

### 🔓 Authentication Portal (`/api/auth`)
- `POST /signup` — Register a new student or recruiter user.
- `POST /login` — Authenticate user and sign active JWT.

### 📄 Profile Assessment Portal (`/api/resumes`)
- `POST /parse` — Parse a PDF, TXT, or MD resume buffer, analyze semantic overlap ratios, bullet index metrics, and readability.
- `POST /save` — Persist computed resume assessment indices to PostgreSQL.
- `GET /my-resumes/:studentId` — Retrieve historical student resumes.

### 💼 Recruiter Suite & Leaderboards (`/api/jobs`)
- `POST /create` — Post a job description detailing criteria targets.
- `GET /:jobId/candidates` — Extract ranked applicant leaderboard for a job posting.
- `PUT /shortlist/:candidateId` — Perform manual candidate shortlist status changes and annotate logs.
