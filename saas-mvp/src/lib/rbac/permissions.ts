import { Role } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";

const roleWeight: Record<Role, number> = {
  MEMBER: 1,
  ADMIN: 2,
  OWNER: 3
};

export async function getMembership(userId: string, organizationId: string) {
  return prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId
      }
    }
  });
}

export function hasRole(current: Role, expected: Role) {
  return roleWeight[current] >= roleWeight[expected];
}

export async function assertWorkspaceAccess(userId: string, workspaceId: string, minRole: Role = Role.MEMBER) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: { organizationId: true }
  });

  if (!workspace) return false;

  const membership = await getMembership(userId, workspace.organizationId);
  if (!membership) return false;

  return hasRole(membership.role, minRole);
}
