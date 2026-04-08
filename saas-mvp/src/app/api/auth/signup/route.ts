import { NextRequest, NextResponse } from "next/server";

import { signup } from "@/modules/auth.service";

export async function POST(req: NextRequest) {
  const result = await signup(await req.json());
  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: result.status });
  }

  return NextResponse.json({ message: "ثبت‌نام موفق" }, { status: 201 });
}
