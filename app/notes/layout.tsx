// notes/layout.tsx
"use client"; // Make it a Client Component to use hooks

import { useEffect } from 'react';
import { useInitializeDatabase, useDatabaseStore } from '@/lib/store/useDatabaseStore'; // Adjust path if needed

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initializeData = useInitializeDatabase();
  const { isLoading, error } = useDatabaseStore(); // Access loading/error state

  useEffect(() => {
    // Only initialize if data hasn't been loaded yet
    // You might want more sophisticated logic here later
    if (!isLoading) { // Check if not already loading
       initializeData();
    }
  }, [initializeData, isLoading]); // Re-run if initializeData changes (unlikely) or isLoading changes

  // Optional: Show loading or error state globally for the notes section
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading notes data...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">Error loading  {error}</div>;
  }

  return <div>{children}</div>;
}