"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { dealSchema } from "@/lib/validation/schemas";

type DealInput = z.infer<typeof dealSchema>;

export function DealCreateForm({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();
  const form = useForm<DealInput>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      workspaceId,
      title: "",
      value: 0,
      stage: "LEAD"
    }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const res = await fetch("/api/crm/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message ?? "خطا در ایجاد معامله");
      return;
    }

    toast.success("معامله ثبت شد");
    form.reset({ workspaceId, title: "", value: 0, stage: "LEAD" });
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-3">
      <div className="md:col-span-3">
        <label className="mb-1 block text-sm">عنوان معامله</label>
        <input className="input" {...form.register("title")} />
      </div>
      <div>
        <label className="mb-1 block text-sm">مبلغ</label>
        <input type="number" className="input" {...form.register("value")} />
        {form.formState.errors.value ? <p className="mt-1 text-xs text-red-600">{form.formState.errors.value.message}</p> : null}
      </div>
      <div>
        <label className="mb-1 block text-sm">مرحله</label>
        <select className="input" {...form.register("stage")}>
          <option value="LEAD">سرنخ</option>
          <option value="CONTACTED">تماس گرفته شد</option>
          <option value="NEGOTIATION">مذاکره</option>
          <option value="CONTRACT">قرارداد</option>
          <option value="WON">بسته شد</option>
          <option value="LOST">از دست رفت</option>
        </select>
      </div>
      <div className="md:col-span-3"><Button type="submit">ایجاد معامله</Button></div>
    </form>
  );
}
