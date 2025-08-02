"use client";

import { Home, Fan, Bolt, Calendar, Notebook } from "lucide-react";
import { ExpandedTabs } from "@/components/ui/expanded-tabs";

function Navbar() {
  const tabs = [
    { title: "Home", icon: Home, route: "/" },
    { title: "Notes", icon: Notebook, route: "/notes" },
    { title: "Limi", icon: Fan, route: "/limi" },
    { title: "Events", icon: Calendar, route: "/events" },
    { title: "Settings", icon: Bolt, route: "/settings" },
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
