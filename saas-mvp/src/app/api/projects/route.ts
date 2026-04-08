import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/session";
import { createProject, listProjects } from "@/modules/projects/service";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const workspaceId = req.nextUrl.searchParams.get("workspaceId");
  if (!workspaceId) return NextResponse.json({ message: "workspaceId required" }, { status: 400 });

  try {
    const data = await listProjects(workspaceId, user.id);
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ message: "خطا در دریافت پروژه‌ها" }, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const data = await createProject(await req.json(), user.id);
    return NextResponse.json({ data, message: "پروژه با موفقیت ایجاد شد" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error && error.message === "VALIDATION" ? "لطفاً همه فیلدهای ضروری را تکمیل کنید" : "خطا در ثبت اطلاعات" }, { status: 400 });
  }
}
