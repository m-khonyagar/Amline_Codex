import Link from "next/link";

import { getCurrentUser } from "@/lib/auth/session";

export async function AppHeader() {
  const user = await getCurrentUser();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
      <div className="w-full max-w-md">
        <input className="input" placeholder="جستجو در پروژه‌ها، وظایف و مشتریان..." />
      </div>
      <div className="flex items-center gap-3 text-sm">
        <Link href="/notifications" className="rounded-xl border border-slate-200 px-3 py-2">
          اعلان‌ها
        </Link>
        <Link href="/profile" className="rounded-xl border border-slate-200 px-3 py-2">
          {user?.fullName ?? "کاربر"}
        </Link>
      </div>
    </header>
  );
}
