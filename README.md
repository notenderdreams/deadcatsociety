# Database Schema 

**Table**: semesters
- id  (int ++) ->key 
- name (e.g., " Summer 2025")
- is_active

**Table**: courses
- id ( string e.g., "CSE4301") ->Key
- semester_id (foreign key)
- name
- updated_at

**Table**: classes
- id (uuid)
- course_id (foreign key)
- title
- description (markdown or file URL)
- topic [] 
- Note [] (Will be Links)
- Reference[]
- contributor []
- updated_at
