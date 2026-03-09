import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/session";
import { createDeal, listDeals } from "@/modules/crm/service";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const workspaceId = req.nextUrl.searchParams.get("workspaceId");
  if (!workspaceId) return NextResponse.json({ message: "workspaceId required" }, { status: 400 });

  try {
    const data = await listDeals(workspaceId, user.id);
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ message: "خطا در دریافت معاملات" }, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const data = await createDeal(await req.json(), user.id);
    return NextResponse.json({ data, message: "معامله ایجاد شد" }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "خطا در ثبت اطلاعات" }, { status: 400 });
  }
}
