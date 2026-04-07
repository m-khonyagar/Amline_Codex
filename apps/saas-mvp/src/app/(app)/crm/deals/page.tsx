import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getUserWorkspace } from "@/lib/server-context";
import { formatPrice } from "@/lib/utils";
import { listDeals } from "@/modules/crm/service";

export default async function DealsPage() {
  const { workspace, user } = await getUserWorkspace();
  const deals = await listDeals(workspace.id, user.id);

  return (
    <Card title="معاملات" description="نمای پایپ‌لاین فروش">
      {deals.length === 0 ? <p className="text-sm text-slate-500">هنوز معامله‌ای ایجاد نشده است</p> : (
        <div className="grid gap-4 md:grid-cols-3">
          {["LEAD", "CONTACTED", "NEGOTIATION", "CONTRACT", "WON", "LOST"].map((stage) => (
            <div key={stage} className="rounded-2xl border border-slate-200 p-3">
              <div className="mb-3"><StatusBadge value={stage} /></div>
              <div className="space-y-2">
                {deals.filter((d) => d.stage === stage).map((d) => (
                  <div key={d.id} className="rounded-xl border border-slate-100 bg-slate-50 p-2 text-sm"><p className="font-semibold">{d.title}</p><p className="text-slate-500">{formatPrice(Number(d.value))}</p></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
