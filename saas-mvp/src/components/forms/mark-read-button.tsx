"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function MarkReadButton() {
  const router = useRouter();

  return (
    <Button
      variant="secondary"
      onClick={async () => {
        await fetch("/api/notifications/read", { method: "POST" });
        router.refresh();
      }}
    >
      علامت‌گذاری همه به‌عنوان خوانده‌شده
    </Button>
  );
}
