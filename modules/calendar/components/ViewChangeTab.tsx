"use client";
import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Tabs, Tab } from "@heroui/react";

export function ViewChangeTab() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Map views to routes
  const viewRoutes = {
    month: "/month-view",
    agenda: "/agenda-view",
  };
  
  // Determine current active tab based on URL
  const getCurrentTab = () => {
    if (pathname === viewRoutes.agenda) return "agenda";
    return "month"; // default to month
  };
  
  const handleTabChange = (key: React.Key) => {
    const value = key as string;
    router.push(viewRoutes[value as keyof typeof viewRoutes]);
  };
  
  return (
    <Tabs 
      selectedKey={getCurrentTab()} 
      onSelectionChange={handleTabChange}
      aria-label="View options"
    >
      <Tab key="month" title="Month" />
      <Tab key="agenda" title="Agenda" />
    </Tabs>
  );
}