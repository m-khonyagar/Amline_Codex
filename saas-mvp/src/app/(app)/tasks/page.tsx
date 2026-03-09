import Link from "next/link";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { prisma } from "@/lib/db/prisma";
import { getUserWorkspace } from "@/lib/server-context";

export default async function TasksPage() {
  const { workspace } = await getUserWorkspace();

  const tasks = await prisma.task.findMany({
    where: { project: { workspaceId: workspace.id } },
    include: { project: true, assignee: true, tags: { include: { tag: true } } },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <Card title="لیست وظایف" description="نمای جدول مدرن برای مدیریت سریع وظایف">
      {tasks.length === 0 ? (
        <p className="text-sm text-slate-500">هیچ داده‌ای یافت نشد</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-right text-slate-500">
                <th className="p-3">عنوان</th>
                <th className="p-3">پروژه</th>
                <th className="p-3">وضعیت</th>
                <th className="p-3">اولویت</th>
                <th className="p-3">مسئول</th>
                <th className="p-3">جزئیات</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b border-slate-100">
                  <td className="p-3 font-medium">{task.title}</td>
                  <td className="p-3">{task.project.name}</td>
                  <td className="p-3"><StatusBadge value={task.status} /></td>
                  <td className="p-3"><StatusBadge value={task.priority} /></td>
                  <td className="p-3">{task.assignee?.fullName ?? "-"}</td>
                  <td className="p-3"><Link href={`/tasks/${task.id}`} className="text-brand-600">مشاهده جزئیات</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
