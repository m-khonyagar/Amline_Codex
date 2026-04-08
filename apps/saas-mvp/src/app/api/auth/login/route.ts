import { NextRequest, NextResponse } from "next/server";

import { login } from "@/modules/auth.service";

export async function POST(req: NextRequest) {
  const result = await login(await req.json());
  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: result.status });
  }

  return NextResponse.json({ message: "ورود موفق" }, { status: 200 });
}
