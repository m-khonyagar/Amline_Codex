"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { projectSchema } from "@/lib/validation/schemas";

type ProjectInput = z.infer<typeof projectSchema>;

export function ProjectCreateForm({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();
  const form = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      workspaceId,
      name: "",
      description: "",
      startDate: "",
      endDate: ""
    }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message ?? "خطا در ایجاد پروژه");
      return;
    }

    toast.success("پروژه با موفقیت ایجاد شد");
    form.reset({ workspaceId, name: "", description: "", startDate: "", endDate: "" });
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="mb-1 block text-sm">نام پروژه</label>
        <input className="input" {...form.register("name")} placeholder="مثال: توسعه پنل فروش" />
        {form.formState.errors.name ? <p className="mt-1 text-xs text-red-600">{form.formState.errors.name.message}</p> : null}
      </div>
      <div className="md:col-span-2">
        <label className="mb-1 block text-sm">توضیحات</label>
        <textarea className="input h-24 py-2" {...form.register("description")} placeholder="توضیح کوتاه درباره اهداف پروژه" />
      </div>
      <div>
        <label className="mb-1 block text-sm">تاریخ شروع</label>
        <input type="date" className="input" {...form.register("startDate")} />
      </div>
      <div>
        <label className="mb-1 block text-sm">تاریخ پایان</label>
        <input type="date" className="input" {...form.register("endDate")} />
      </div>
      <div className="md:col-span-2"><Button type="submit" disabled={form.formState.isSubmitting}>ایجاد پروژه</Button></div>
    </form>
  );
}
