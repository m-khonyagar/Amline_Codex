import { DealCreateForm } from "@/components/forms/deal-create-form";
import { Card } from "@/components/ui/card";
import { getUserWorkspace } from "@/lib/server-context";

export default async function CrmPage() {
  const { workspace } = await getUserWorkspace();

  return (
    <div className="space-y-5">
      <Card title="مدیریت CRM" description="سرنخ‌ها، مشتریان و معاملات را در یک مسیر فروش یکپارچه مدیریت کنید">
        <div className="grid gap-3 md:grid-cols-3">
          <a href="/crm/leads" className="card">سرنخ‌ها</a>
          <a href="/crm/customers" className="card">مشتریان</a>
          <a href="/crm/deals" className="card">معاملات</a>
        </div>
      </Card>
      <Card title="ایجاد معامله جدید">
        <DealCreateForm workspaceId={workspace.id} />
      </Card>
    </div>
  );
}
