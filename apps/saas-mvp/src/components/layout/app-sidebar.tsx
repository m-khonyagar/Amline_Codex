"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "داشبورد" },
  { href: "/organizations", label: "سازمان‌ها" },
  { href: "/workspace", label: "ورک‌اسپیس" },
  { href: "/projects", label: "پروژه‌ها" },
  { href: "/tasks", label: "وظایف" },
  { href: "/crm", label: "CRM" },
  { href: "/notifications", label: "اعلان‌ها" },
  { href: "/members", label: "اعضا" },
  { href: "/settings", label: "تنظیمات" }
];

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn("hidden border-l border-slate-200 bg-white transition-all md:block", collapsed ? "w-[84px]" : "w-64")}>
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
        <div className={cn("font-extrabold text-brand-700", collapsed && "text-sm")}>{collapsed ? "HP" : "همکار پلاس"}</div>
        <button onClick={() => setCollapsed((prev) => !prev)} className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600">{collapsed ? "باز" : "جمع"}</button>
      </div>

      <nav className="space-y-1 p-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded-xl px-3 py-2 text-sm transition",
              pathname.startsWith(item.href) ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:bg-slate-100"
            )}
          >
            {collapsed ? item.label.slice(0, 2) : item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
