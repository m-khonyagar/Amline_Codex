import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";
import { getUserWorkspace } from "@/lib/server-context";

export default async function LeadsPage() {
  const { workspace } = await getUserWorkspace();
  const leads = await prisma.lead.findMany({ where: { workspaceId: workspace.id }, orderBy: { createdAt: "desc" } });

  return (
    <Card title="سرنخ‌ها">
      {leads.length === 0 ? <p className="text-sm text-slate-500">هنوز سرنخی ثبت نشده است.</p> : (
        <div className="space-y-2">{leads.map((lead) => <div key={lead.id} className="rounded-xl border border-slate-200 p-3 text-sm"><p className="font-semibold">{lead.name}</p><p className="text-slate-500">{lead.company ?? "بدون شرکت"}</p></div>)}</div>
      )}
    </Card>
  );
}
