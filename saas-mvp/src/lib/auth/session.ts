import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";

import { prisma } from "@/lib/db/prisma";

const SESSION_COOKIE = "hamkar_session";
const SESSION_AGE = 60 * 60 * 24 * 7;

export type SessionUser = {
  id: string;
  fullName: string;
  email: string;
};

export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_AGE * 1000);

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_AGE
  });

  await prisma.activityLog.create({
    data: {
      actorId: userId,
      entityType: "AuthSession",
      entityId: token,
      action: "USER_LOGIN",
      metadata: { expiresAt }
    }
  });

  cookies().set("user_id", userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_AGE
  });
}

export function clearSession() {
  cookies().delete(SESSION_COOKIE);
  cookies().delete("user_id");
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const userId = cookies().get("user_id")?.value;
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, fullName: true, email: true }
  });

  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
