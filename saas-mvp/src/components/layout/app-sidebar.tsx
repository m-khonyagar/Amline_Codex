import Link from "next/link";

const items = [
  { href: "/dashboard", label: "داشبورد" },
  { href: "/projects", label: "پروژه‌ها" },
  { href: "/tasks", label: "وظایف" },
  { href: "/crm", label: "CRM" },
  { href: "/notifications", label: "اعلان‌ها" },
  { href: "/members", label: "اعضا و نقش‌ها" },
  { href: "/settings", label: "تنظیمات" }
];

export function AppSidebar() {
  return (
    <aside className="hidden w-64 border-l border-slate-200 bg-white p-4 md:block">
      <div className="rounded-xl bg-brand-50 p-3 text-sm font-bold text-brand-700">همکار پلاس</div>
      <nav className="mt-4 space-y-1">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="block rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
