import { Role } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";
import { assertWorkspaceAccess } from "@/lib/rbac/permissions";
import { taskSchema } from "@/lib/validation/schemas";

export async function listTasks(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { workspaceId: true } });
  if (!project) throw new Error("NOT_FOUND");

  const access = await assertWorkspaceAccess(userId, project.workspaceId, Role.MEMBER);
  if (!access) throw new Error("UNAUTHORIZED");

  return prisma.task.findMany({
    where: { projectId },
    include: {
      assignee: { select: { id: true, fullName: true } },
      comments: { include: { author: { select: { fullName: true } } }, orderBy: { createdAt: "desc" }, take: 3 },
      tags: { include: { tag: true } },
      subtasks: true
    },
    orderBy: { updatedAt: "desc" }
  });
}

export async function createTask(input: unknown, userId: string) {
  const parsed = taskSchema.safeParse(input);
  if (!parsed.success) throw new Error("VALIDATION");

  const project = await prisma.project.findUnique({ where: { id: parsed.data.projectId }, select: { workspaceId: true } });
  if (!project) throw new Error("NOT_FOUND");

  const access = await assertWorkspaceAccess(userId, project.workspaceId, Role.MEMBER);
  if (!access) throw new Error("UNAUTHORIZED");

  const task = await prisma.task.create({
    data: {
      projectId: parsed.data.projectId,
      taskListId: parsed.data.taskListId,
      assigneeId: parsed.data.assigneeId,
      title: parsed.data.title,
      description: parsed.data.description,
      priority: parsed.data.priority,
      status: parsed.data.status,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null
    }
  });

  await prisma.activityLog.create({
    data: {
      actorId: userId,
      workspaceId: project.workspaceId,
      projectId: parsed.data.projectId,
      taskId: task.id,
      entityType: "Task",
      entityId: task.id,
      action: "TASK_CREATED"
    }
  });

  return task;
}
