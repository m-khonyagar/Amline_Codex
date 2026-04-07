import bcrypt from "bcryptjs";

import { createSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { loginSchema, signupSchema } from "@/lib/validation/schemas";

export async function signup(payload: unknown) {
  const parsed = signupSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, status: 400, message: "لطفاً همه فیلدهای ضروری را تکمیل کنید" };
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return { ok: false, status: 409, message: "این ایمیل قبلاً ثبت شده است" };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      fullName: parsed.data.fullName,
      passwordHash
    }
  });

  const organization = await prisma.organization.create({
    data: {
      name: `سازمان ${parsed.data.fullName}`,
      slug: `org-${Date.now()}`
    }
  });

  await prisma.membership.create({
    data: { userId: user.id, organizationId: organization.id, role: "OWNER" }
  });

  await prisma.workspace.create({
    data: { organizationId: organization.id, name: "ورک‌اسپیس اصلی", slug: "main" }
  });

  await createSession(user.id);

  return { ok: true, status: 201, data: user };
}

export async function login(payload: unknown) {
  const parsed = loginSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, status: 400, message: "اطلاعات ورود معتبر نیست" };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) {
    return { ok: false, status: 401, message: "ایمیل یا رمز عبور اشتباه است" };
  }

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) {
    return { ok: false, status: 401, message: "ایمیل یا رمز عبور اشتباه است" };
  }

  await createSession(user.id);
  return { ok: true, status: 200, data: user };
}
