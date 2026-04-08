import Link from "next/link";

import { ProjectCreateForm } from "@/components/forms/project-create-form";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { prisma } from "@/lib/db/prisma";
import { getUserWorkspace } from "@/lib/server-context";

export default async function ProjectsPage() {
  const { workspace } = await getUserWorkspace();

  const projects = await prisma.project.findMany({
    where: { workspaceId: workspace.id, archivedAt: null },
    include: { _count: { select: { tasks: true } }, members: { include: { user: true } } },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Card title="ایجاد پروژه" description="پروژه جدید را سریع راه‌اندازی کنید" className="lg:col-span-1"><ProjectCreateForm workspaceId={workspace.id} /></Card>
      <Card title="لیست پروژه‌ها" className="lg:col-span-2">
        {projects.length === 0 ? (
          <p className="text-sm text-slate-500">هنوز پروژه‌ای ایجاد نشده است</p>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="block rounded-2xl border border-slate-200 p-4 transition hover:border-brand-300 hover:bg-brand-50/30">
                <div className="flex items-center justify-between"><h3 className="font-bold">{project.name}</h3><StatusBadge value={project.status} /></div>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{project.description ?? "بدون توضیحات"}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500"><span>{project._count.tasks} وظیفه</span><span>{project.members.length} عضو</span></div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
