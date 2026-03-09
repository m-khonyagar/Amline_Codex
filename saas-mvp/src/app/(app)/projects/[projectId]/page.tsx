import Link from "next/link";
import { notFound } from "next/navigation";

import { TaskCreateForm } from "@/components/forms/task-create-form";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { prisma } from "@/lib/db/prisma";

export default async function ProjectDetailsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      members: { include: { user: { select: { id: true, fullName: true } } } },
      taskLists: true,
      tasks: { include: { assignee: true }, orderBy: { updatedAt: "desc" } }
    }
  });

  if (!project) return notFound();

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex items-start justify-between gap-4"><div><h1 className="text-2xl font-black">{project.name}</h1><p className="mt-2 text-sm text-slate-600">{project.description ?? "بدون توضیحات"}</p></div><StatusBadge value={project.status} /></div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card title="افزودن وظیفه" className="lg:col-span-1">
          <TaskCreateForm projectId={project.id} members={project.members.map((m) => ({ id: m.user.id, fullName: m.user.fullName }))} lists={project.taskLists.map((l) => ({ id: l.id, name: l.name }))} />
        </Card>
        <Card title="برد کانبان" className="lg:col-span-2">
          <div className="grid gap-3 md:grid-cols-3">
            {["TODO", "IN_PROGRESS", "DONE"].map((status) => (
              <div key={status} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="mb-3 flex items-center justify-between"><StatusBadge value={status} /><span className="text-xs text-slate-500">{project.tasks.filter((t) => t.status === status).length} مورد</span></div>
                <div className="space-y-2">
                  {project.tasks.filter((t) => t.status === status).map((task) => (
                    <Link href={`/tasks/${task.id}`} key={task.id} className="block rounded-xl border border-slate-200 bg-white p-2 text-sm">
                      <p className="font-semibold">{task.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{task.assignee?.fullName ?? "بدون مسئول"}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
