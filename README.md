
# DeadCatSociety

DeadCatSociety is a class notes and academic event management platform designed for students and educators. It helps organize semesters, courses, and class notes efficiently with a searchable interface powered by vector embeddings. It also features a conversational interface to query PDFs using Gemini and Supabase.

---

## 🧰 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router + Turbopack)
- **Styling**: Tailwind CSS, Framer Motion, GSAP
- **UI Components**: shadcn/ui, HeroUI
- **State Management**: Zustand
- **Forms & Validation**: React Hook Form + Zod
- **Database ORM**: Drizzle ORM

### Backend (src-limi)
- **Framework**: FastAPI
- **PDF QA**: LangChain + Gemini (Google Generative AI)
- **Vector Search**: Supabase + pgvector
- **Dependencies**: Managed with Poetry
- **Serving**: Uvicorn (dev reload enabled)

---

## ✨ Features

- 📚 Organize semesters, courses, and individual classes
- 📎 Attach references, contributors, and markdown note links
- 📆 Academic calendar with event view
- 🤖 AI Q&A over uploaded class notes and PDFs
- 🔍 Semantic search with vector embeddings
- 💻 Sleek and responsive UI

---

## 🚀 Getting Started

### 1. Setup Environment Variables

Create a `.env.local` file at the root and include:

```env
# Frontend
LIMI_BASE_URL=<Backend API URL>
DATABASE_URL=<PostgreSQL URL>

# Backend (src-limi)
GOOGLE_API_KEY=<Gemini API Key>
SUPABASE_DB_URL=<Supabase Vector DB URL>
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001
```

Add your deployed frontend URLs to `ALLOWED_ORIGINS` if needed.

---

### 2. Running the Project

#### 🟦 Frontend (Main App)

```bash
pnpm install
pnpm run dev
```

* App runs at: [http://localhost:3000](http://localhost:3000)

#### 🟨 Backend (Limi API)

```bash
poetry install
poetry run uvicorn src_limi.main:app --reload
```

* API runs at: [http://localhost:8000](http://localhost:8000)


