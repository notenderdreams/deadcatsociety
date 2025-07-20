"use client";
import { Home, Fan, Bolt, Package } from "lucide-react";
import { ExpandedTabs } from "@/components/ui/expanded-tabs";

function Navbar() {
  const tabs = [
    { title: "Home", icon: Home, path: "/" },
    { title: "Notes", icon: Home, path: "/projects" },
    { title: "Batman", icon: Package, path: "/crates" },
    { type: "separator" as const },
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
