// /api/notes/route.ts
import { NextResponse } from 'next/server';
import { mockDatabase } from '@/lib/mock'; // Adjust the import path if needed

export async function GET() {
  // In a real scenario, you would fetch from the database here.
  // For now, we just return the mock data.
  try {
    // Simulate a slight delay to mimic network request (optional)
    // await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json(mockDatabase);
  } catch (error) {
    console.error("Error fetching mock data:", error);
    return NextResponse.json({ error: "Failed to load mock data" }, { status: 500 });
  }
}