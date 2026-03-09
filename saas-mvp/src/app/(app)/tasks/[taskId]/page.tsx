import { notFound } from "next/navigation";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { prisma } from "@/lib/db/prisma";

export default async function TaskDetailsPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: true,
      assignee: true,
      comments: { include: { author: true }, orderBy: { createdAt: "desc" } },
      subtasks: true,
      attachments: true,
      tags: { include: { tag: true } }
    }
  });

  if (!task) return notFound();

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-black">{task.title}</h1>
          <div className="flex gap-2"><StatusBadge value={task.status} /><StatusBadge value={task.priority} /></div>
        </div>
        <p className="mt-3 text-sm text-slate-600">{task.description ?? "توضیحی ثبت نشده است."}</p>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card title="جزئیات" className="lg:col-span-1">
          <div className="space-y-2 text-sm">
            <p>پروژه: {task.project.name}</p>
            <p>مسئول: {task.assignee?.fullName ?? "تخصیص داده نشده"}</p>
          </div>
        </Card>

        <Card title="زیرتسک‌ها" className="lg:col-span-1">
          <div className="space-y-2">
            {task.subtasks.length === 0 ? <p className="text-sm text-slate-500">زیرتسکی ثبت نشده است.</p> : task.subtasks.map((sub) => <label key={sub.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={sub.done} readOnly />{sub.title}</label>)}
          </div>
        </Card>

        <Card title="اسناد و پیوست‌ها" className="lg:col-span-1">
          <div className="space-y-2 text-sm">
            {task.attachments.length === 0 ? <p className="text-slate-500">فایلی متصل نشده است.</p> : task.attachments.map((a) => <p key={a.id}>{a.fileName}</p>)}
          </div>
        </Card>
      </div>

      <Card title="گفتگو و کامنت‌ها">
        <div className="space-y-3">
          {task.comments.length === 0 ? <p className="text-sm text-slate-500">هنوز کامنتی ثبت نشده است</p> : task.comments.map((comment) => (
            <div key={comment.id} className="rounded-xl border border-slate-200 p-3">
              <p className="text-sm font-semibold">{comment.author.fullName}</p>
              <p className="mt-1 text-sm text-slate-700">{comment.content}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
