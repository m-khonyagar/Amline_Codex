import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/session";
import { createTask, listTasks } from "@/modules/tasks/service";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const projectId = req.nextUrl.searchParams.get("projectId");
  if (!projectId) return NextResponse.json({ message: "projectId required" }, { status: 400 });

  try {
    const data = await listTasks(projectId, user.id);
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ message: "خطا در دریافت وظایف" }, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const data = await createTask(await req.json(), user.id);
    return NextResponse.json({ data, message: "وظیفه با موفقیت ایجاد شد" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error && error.message === "VALIDATION" ? "لطفاً همه فیلدهای ضروری را تکمیل کنید" : "خطا در ثبت اطلاعات" }, { status: 400 });
  }
}
