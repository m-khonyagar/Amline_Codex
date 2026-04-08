import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function getUserWorkspace() {
  const user = await requireUser();

  const membership = await prisma.membership.findFirst({
    where: { userId: user.id },
    include: {
      organization: {
        include: { workspaces: true }
      }
    }
  });

  if (!membership || membership.organization.workspaces.length === 0) {
    throw new Error("WORKSPACE_NOT_FOUND");
  }

  const workspace = membership.organization.workspaces[0];
  return { user, workspace, membership };
}
