import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { prisma } from "@/lib/db/prisma";
import { getUserWorkspace } from "@/lib/server-context";

export default async function MembersPage() {
  const { membership, workspace } = await getUserWorkspace();

  const members = await prisma.membership.findMany({
    where: { organizationId: membership.organizationId },
    include: { user: true },
    orderBy: { createdAt: "asc" }
  });

  return (
    <Card title="اعضا و نقش‌ها" description={`ورک‌اسپیس: ${workspace.name}`}>
      <div className="space-y-2">
        {members.map((m) => (
          <div key={m.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm">
            <span>{m.user.fullName}</span>
            <StatusBadge value={m.role} />
          </div>
        ))}
      </div>
    </Card>
  );
}
