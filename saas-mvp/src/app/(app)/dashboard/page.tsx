import Link from "next/link";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { prisma } from "@/lib/db/prisma";
import { getUserWorkspace } from "@/lib/server-context";
import { formatDate } from "@/lib/utils";
import { dashboardSummary } from "@/modules/dashboard.service";

export default async function DashboardPage() {
  const { workspace } = await getUserWorkspace();
  const summary = await dashboardSummary(workspace.id);

  const workload = await prisma.user.findMany({
    where: { memberships: { some: { organization: { workspaces: { some: { id: workspace.id } } } } } },
    select: {
      id: true,
      fullName: true,
      _count: { select: { assignedTasks: { where: { project: { workspaceId: workspace.id }, status: { not: "DONE" } } } } }
    }
  });

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-l from-brand-700 to-brand-500 p-6 text-white shadow-card">
        <p className="text-sm text-blue-100">داشبورد مدیریتی</p>
        <h1 className="mt-2 text-2xl font-black">نمای کلی عملیات تیمی ورک‌اسپیس {workspace.name}</h1>
        <p className="mt-2 text-sm text-blue-100">شاخص‌های کلیدی پروژه، وظایف و فروش در یک نگاه.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["پروژه‌های فعال", String(summary.activeProjects)],
          ["وظایف باز", String(summary.openTasks)],
          ["وظایف امروز", String(summary.todayTasks)],
          ["عقب‌افتاده", String(summary.overdueTasks)]
        ].map(([label, value]) => (
          <Card key={label}><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-black text-slate-900">{value}</p></Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card title="فعالیت‌های اخیر" description="آخرین تغییرات تیم">
          <div className="space-y-3">
            {summary.recentActivity.length === 0 ? <p className="text-sm text-slate-500">هنوز فعالیتی ثبت نشده است.</p> : summary.recentActivity.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 p-3">
                <p className="text-sm font-semibold">{item.action}</p>
                <p className="mt-1 text-xs text-slate-500">{item.actor?.fullName ?? "سیستم"} - {formatDate(item.createdAt)}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card title="خلاصه پایپ‌لاین فروش" description="وضعیت مراحل معاملات">
          <div className="space-y-3">
            {summary.deals.length === 0 ? <p className="text-sm text-slate-500">هنوز معامله‌ای ثبت نشده است.</p> : summary.deals.map((d) => (
              <div key={d.stage} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                <StatusBadge value={d.stage} />
                <p className="text-sm text-slate-700">{d._count.id} مورد</p>
              </div>
            ))}
          </div>
          <Link href="/crm/deals" className="btn-secondary mt-4">مشاهده معاملات</Link>
        </Card>
      </section>

      <Card title="وضعیت بار کاری تیم">
        <div className="space-y-2">
          {workload.map((member) => (
            <div key={member.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm">
              <span>{member.fullName}</span>
              <span>{member._count.assignedTasks} وظیفه باز</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
