import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/session";

export default async function OrganizationsPage() {
  const user = await requireUser();
  const memberships = await prisma.membership.findMany({ where: { userId: user.id }, include: { organization: true } });

  return (
    <Card title="سازمان‌ها">
      <div className="space-y-2">{memberships.map((item) => <div key={item.id} className="rounded-xl border border-slate-200 p-3 text-sm">{item.organization.name}</div>)}</div>
    </Card>
  );
}
