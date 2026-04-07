import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/session";
import { markAllRead } from "@/modules/notifications/service";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await markAllRead(user.id);
  return NextResponse.json({ message: "اعلان‌ها خوانده شدند" });
}
