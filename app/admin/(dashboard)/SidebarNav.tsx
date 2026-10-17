"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Inbox, Users, Settings, Building2, Sparkles, Calendar, Newspaper, BookOpen, Award } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Leadership", href: "/admin/leadership", icon: Award },
  { name: "News & Digest", href: "/admin/news", icon: Newspaper },
  { name: "Blog Posts", href: "/admin/blog", icon: BookOpen },
  { name: "Events & Gallery", href: "/admin/events", icon: Calendar },
  { name: "Submissions", href: "/admin/submissions", icon: Inbox },
  { name: "Spotlights", href: "/admin/spotlights", icon: Sparkles },
  { name: "Associations", href: "/admin/associations", icon: Building2 },
  { name: "Admins", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function SidebarNav({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const pathname = usePathname();


  const visibleNavItems = navItems.filter(item =>
    item.name === "Admins" ? isSuperAdmin : true
  );

  return (
    <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
      {visibleNavItems.map((item) => {
        const Icon = item.icon;

        const isActive = item.href === "/admin"
          ? pathname === "/admin"
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${
              isActive
                ? "bg-[#C85B15] text-white"
                : "text-gray-300 hover:bg-[#22203E] hover:text-white"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
