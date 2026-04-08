"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { taskSchema } from "@/lib/validation/schemas";

type TaskInput = z.infer<typeof taskSchema>;

type MemberOption = { id: string; fullName: string };
type ListOption = { id: string; name: string };

export function TaskCreateForm({ projectId, members, lists }: { projectId: string; members: MemberOption[]; lists: ListOption[] }) {
  const router = useRouter();
  const form = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      projectId,
      title: "",
      description: "",
      status: "TODO",
      priority: "MEDIUM",
      taskListId: lists[0]?.id,
      assigneeId: members[0]?.id,
      dueDate: ""
    }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message ?? "خطا در ایجاد وظیفه");
      return;
    }

    toast.success("وظیفه با موفقیت ایجاد شد");
    form.reset({ ...form.getValues(), title: "", description: "" });
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="mb-1 block text-sm">عنوان وظیفه</label>
        <input className="input" {...form.register("title")} />
        {form.formState.errors.title ? <p className="mt-1 text-xs text-red-600">{form.formState.errors.title.message}</p> : null}
      </div>
      <div className="md:col-span-2">
        <label className="mb-1 block text-sm">توضیحات</label>
        <textarea className="input h-24 py-2" {...form.register("description")} />
      </div>
      <div>
        <label className="mb-1 block text-sm">اولویت</label>
        <select className="input" {...form.register("priority")}>
          <option value="LOW">کم</option><option value="MEDIUM">متوسط</option><option value="HIGH">زیاد</option><option value="URGENT">فوری</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm">وضعیت</label>
        <select className="input" {...form.register("status")}>
          <option value="TODO">برای انجام</option><option value="IN_PROGRESS">در حال انجام</option><option value="IN_REVIEW">در بازبینی</option><option value="DONE">انجام شده</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm">مسئول</label>
        <select className="input" {...form.register("assigneeId")}>
          {members.map((m) => <option key={m.id} value={m.id}>{m.fullName}</option>)}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm">لیست</label>
        <select className="input" {...form.register("taskListId")}>
          {lists.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm">تاریخ سررسید</label>
        <input type="date" className="input" {...form.register("dueDate")} />
      </div>
      <div className="md:col-span-2"><Button type="submit" disabled={form.formState.isSubmitting}>افزودن وظیفه</Button></div>
    </form>
  );
}
