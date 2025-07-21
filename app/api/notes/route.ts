import { NextResponse } from 'next/server';

export async function GET() {
  const mockData = {
    semesters: [
      {
        id: 1,
        name: "Summer 2025",
        is_active: true,
        courses: [
          {
            id: "a5a58d0f-e252-4f29-98df-cb12b9c11f6d",
            semester_id: 1,
            code: "CSE4301",
            name: "Distributed Systems",
            classes: [
              {
                id: "c101de03-6a5b-48e4-b637-9cfa1025b01e",
                course_id: "a5a58d0f-e252-4f29-98df-cb12b9c11f6d",
                title: "Class 1 - Introduction to Distributed Systems",
                content: "https://example.com/notes/class1.md",
                notes: [
                  "https://example.com/notes/ds-overview.pdf",
                  "https://example.com/notes/distributed-vs-centralized.md"
                ],
                resources: [
                  "https://bookds.com/chapter1",
                  "https://youtu.be/ds_intro_video"
                ],
                uploaded_by: "rahim@example.com",
                created_at: "2025-07-18T10:34:23Z"
              },
              {
                id: "e983f7e7-3271-4d0e-9a2d-6d3d9026b14e",
                course_id: "a5a58d0f-e252-4f29-98df-cb12b9c11f6d",
                title: "Class 2 - RPC and Message Passing",
                content: "https://example.com/notes/class2.md",
                notes: [
                  "https://example.com/notes/rpc-notes.md"
                ],
                resources: [
                  "https://docs.oracle.com/javase/tutorial/rmi/index.html"
                ],
                uploaded_by: "labiba@example.com",
                created_at: "2025-07-19T08:15:45Z"
              }
            ]
          },
          {
            id: "d5d54cf2-a2bd-4af6-9993-e7761f2a1b94",
            semester_id: 1,
            code: "CSE4305",
            name: "Machine Learning",
            classes: []
          }
        ]
      }
    ]
  };

  return NextResponse.json(mockData);
}
