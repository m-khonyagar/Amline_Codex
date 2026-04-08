"use client";

import { useRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function AttachmentUploadForm({ projectId, taskId }: { projectId?: string; taskId?: string }) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function submit() {
    const file = inputRef.current?.files?.[0];
    if (!file) {
      toast.error("لطفاً فایل را انتخاب کنید");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    if (projectId) formData.append("projectId", projectId);
    if (taskId) formData.append("taskId", taskId);

    const res = await fetch("/api/attachments", { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message ?? "خطا در آپلود فایل");
      return;
    }

    toast.success("فایل آپلود شد");
    if (inputRef.current) inputRef.current.value = "";
    window.location.reload();
  }

  return (
    <div className="space-y-2">
      <input ref={inputRef} type="file" className="input h-auto py-2" />
      <Button type="button" onClick={submit}>آپلود فایل</Button>
    </div>
  );
}
