import { Role } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { assertWorkspaceAccess } from "@/lib/rbac/permissions";
import { projectSchema } from "@/lib/validation/schemas";

export async function listProjects(workspaceId: string, userId: string) {
  const access = await assertWorkspaceAccess(userId, workspaceId, Role.MEMBER);
  if (!access) throw new Error("UNAUTHORIZED");

  return prisma.project.findMany({
    where: { workspaceId, archivedAt: null },
    include: {
      members: { include: { user: { select: { id: true, fullName: true } } } },
      _count: { select: { tasks: true } }
    },
    orderBy: { updatedAt: "desc" }
  });
}

export async function createProject(input: unknown, userId: string) {
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) throw new Error("VALIDATION");

  const access = await assertWorkspaceAccess(userId, parsed.data.workspaceId, Role.ADMIN);
  if (!access) throw new Error("UNAUTHORIZED");

  const project = await prisma.project.create({
    data: {
      workspaceId: parsed.data.workspaceId,
      name: parsed.data.name,
      description: parsed.data.description,
      startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      status: "PLANNING"
    }
  });

  await prisma.activityLog.create({
    data: {
      actorId: userId,
      workspaceId: parsed.data.workspaceId,
      projectId: project.id,
      entityType: "Project",
      entityId: project.id,
      action: "PROJECT_CREATED",
      metadata: { name: project.name }
    }
  });

  return project;
}
