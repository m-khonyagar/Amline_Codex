import Link from "next/link";

import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function AppHeader() {
  const user = await getCurrentUser();
  const unreadCount = user ? await prisma.notification.count({ where: { userId: user.id, isRead: false } }) : 0;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-6">
      <div className="w-full max-w-lg">
        <input className="input" placeholder="جستجو در پروژه‌ها، وظایف، مشتریان..." />
      </div>

      <div className="mr-4 flex items-center gap-2 text-sm">
        <Link href="/projects" className="hidden rounded-xl border border-slate-200 px-3 py-2 lg:block">ایجاد پروژه</Link>
        <Link href="/notifications" className="relative rounded-xl border border-slate-200 px-3 py-2">
          اعلان‌ها
          {unreadCount > 0 ? <span className="absolute -left-2 -top-2 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] text-white">{unreadCount}</span> : null}
        </Link>
        <Link href="/profile" className="rounded-xl border border-slate-200 px-3 py-2">{user?.fullName ?? "کاربر"}</Link>
      </div>
    </header>
  );
}
