"use client";
import { Home, Fan, Bolt, Calendar, Sparkles, Notebook } from "lucide-react";
import { ExpandedTabs } from "@/components/ui/expanded-tabs";

function Navbar() {
  const tabs = [
    { title: "Home", icon: Home, path: "/" },
    { title: "Notes", icon: Notebook, path: "/projects" },
    { title: "Askity", icon: Sparkles , path: "/crates" },
    { title: "Events", icon: Calendar, path: "/crates" },
    { title: "Settings", icon: Bolt, path: "/settings" },
    { title: "About", icon: Fan, path: "/about" },
  ];

  return (
    <div className="flex justify-center py-4">
      <div className="flex flex-col gap-4">
        <ExpandedTabs tabs={tabs} />
      </div>
    </div>
  );
}
export default Navbar;
