import { prisma } from "@/lib/db/prisma";

export async function dashboardSummary(workspaceId: string) {
  const [activeProjects, openTasks, overdueTasks, todayTasks, recentActivity, deals] = await Promise.all([
    prisma.project.count({ where: { workspaceId, status: { in: ["ACTIVE", "PLANNING"] }, archivedAt: null } }),
    prisma.task.count({ where: { project: { workspaceId }, status: { not: "DONE" } } }),
    prisma.task.count({ where: { project: { workspaceId }, dueDate: { lt: new Date() }, status: { not: "DONE" } } }),
    prisma.task.count({
      where: {
        project: { workspaceId },
        dueDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999))
        }
      }
    }),
    prisma.activityLog.findMany({ where: { workspaceId }, orderBy: { createdAt: "desc" }, take: 8, include: { actor: true } }),
    prisma.deal.groupBy({ by: ["stage"], where: { workspaceId }, _sum: { value: true }, _count: { id: true } })
  ]);

  return { activeProjects, openTasks, overdueTasks, todayTasks, recentActivity, deals };
}
