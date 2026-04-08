import { Role } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { assertWorkspaceAccess } from "@/lib/rbac/permissions";
import { dealSchema } from "@/lib/validation/schemas";

export async function listDeals(workspaceId: string, userId: string) {
  const access = await assertWorkspaceAccess(userId, workspaceId, Role.MEMBER);
  if (!access) throw new Error("UNAUTHORIZED");

  return prisma.deal.findMany({
    where: { workspaceId },
    include: { customer: true, project: true },
    orderBy: { updatedAt: "desc" }
  });
}

export async function createDeal(payload: unknown, userId: string) {
  const parsed = dealSchema.safeParse(payload);
  if (!parsed.success) throw new Error("VALIDATION");

  const access = await assertWorkspaceAccess(userId, parsed.data.workspaceId, Role.MEMBER);
  if (!access) throw new Error("UNAUTHORIZED");

  const deal = await prisma.deal.create({
    data: {
      workspaceId: parsed.data.workspaceId,
      customerId: parsed.data.customerId,
      projectId: parsed.data.projectId,
      title: parsed.data.title,
      value: parsed.data.value,
      stage: parsed.data.stage
    }
  });

  await prisma.activityLog.create({
    data: {
      actorId: userId,
      workspaceId: parsed.data.workspaceId,
      entityType: "Deal",
      entityId: deal.id,
      action: "DEAL_CREATED"
    }
  });

  return deal;
}
