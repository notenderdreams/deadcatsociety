"use client";

import { useEffect } from "react";
import {
  useInitializeDatabase,
  useDatabaseStore,
} from "@/lib/store/useDatabaseStore";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initializeData = useInitializeDatabase();
  const { isLoading, error, isInitialized } = useDatabaseStore();

  useEffect(() => {
    if (!isInitialized) {
      initializeData();
    }
  }, []); 

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading notes data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-500">
        Error loading data: {error}
      </div>
    );
  }

  return <div>{children}</div>;
}
