import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";
import { getUserWorkspace } from "@/lib/server-context";

export default async function CustomersPage() {
  const { workspace } = await getUserWorkspace();
  const customers = await prisma.customer.findMany({ where: { workspaceId: workspace.id }, orderBy: { createdAt: "desc" } });

  return (
    <Card title="مشتریان">
      {customers.length === 0 ? <p className="text-sm text-slate-500">مشتری‌ای یافت نشد.</p> : (
        <div className="overflow-x-auto"><table className="min-w-full text-sm"><thead><tr className="border-b border-slate-200 text-right"><th className="p-3">نام</th><th className="p-3">شرکت</th><th className="p-3">ایمیل</th></tr></thead><tbody>{customers.map((c) => <tr key={c.id} className="border-b border-slate-100"><td className="p-3">{c.name}</td><td className="p-3">{c.company}</td><td className="p-3">{c.email ?? "-"}</td></tr>)}</tbody></table></div>
      )}
    </Card>
  );
}
