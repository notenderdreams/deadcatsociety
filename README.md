# Dead Cat Society - Hackathon Project Plan


### Day 1 
- [ ] Set up project repo with README and license
- [ ] Initialize Next.js app with TailwindCSS
- [ ] Configure database schema with Prisma
- [ ] Implement authentication (email/password or OAuth)
- [ ] Deploy backend (e.g., Railway or Vercel edge functions)

### Day 2 
- [ ] Build basic route structure: /app/notes/[semester]/[course]/[class]
- [ ] Implement DB connection and model relationships
- [ ] Build notes dashboard UI (semester, course, class hierarchy)
- [ ] Seed database with mock data

### Day 3 
- [ ] Add note upload, edit, view (Markdown support)
- [ ] Implement markdown preview & file upload (Cloudinary/Filebase/S3)
- [ ] Enable read-only & editable modes for notes
- [ ] Attach notes to specific class

### Day 4 
- [ ] Build Topic Progress tracking system (note tags & completion)
- [ ] Add search feature (basic fuzzy search with filters)
- [ ] Add user roles & note ownership visibility

### Day 5
- [ ] Add Notebook LLM-like feature (AI Q&A or summary on selected notes)
- [ ] Integrate OpenAI/Groq/LLM API with notes content
- [ ] Add prompt templates for summarize, explain, generate flashcards

### Day 6 
- [ ] Implement event calendar (class & exam dates, deadlines)
- [ ] Use react-calendar or FullCalendar
- [ ] Link events to courses/notes
- [ ] Test offline functionality (PWA/localStorage fallback for notes)

### Day 7
- [ ] Final cleanup & optimization
- [ ] Write full documentation (README, API, usage)
- [ ] Check all features against judging criteria
- [ ] Push final commits & submit GitHub repo

---


# Route  Structure 
```
/app/
├── notes/
│   ├── page.tsx                   # Notes dashboard (list all semesters)
│   ├── [semester]/                # Dynamic semester route
│   │   ├── page.tsx               # List of courses in the semester
│   │   ├── [course]/              # Dynamic course route
│   │   │   ├── page.tsx           # List of classes in the course
│   │   │   └── [class]/           # Dynamic class route
│   │   │       └── page.tsx       # List of notes in the class
│   │   └── layout.tsx             # Optional layout for semester section
```


# Database Schema 

**Table**: semesters
- id (uuid)
- name (e.g., "Semester 7")
- is_active

**Table**: courses
- id (uuid)
- semester_id (foreign key)
- code (e.g., "CSE4301")
- name

**Table**: classes
- id (uuid)
- course_id (foreign key)
- class_number or title
- content (markdown or file URL)
- Notes(Will be Links)
- Resources
- uploaded_by
- created_at
