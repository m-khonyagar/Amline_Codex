import { MarkReadButton } from "@/components/forms/mark-read-button";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";
import { listNotifications } from "@/modules/notifications/service";

export default async function NotificationsPage() {
  const user = await requireUser();
  const notifications = await listNotifications(user.id);

  return (
    <Card title="اعلان‌ها" description="مدیریت اعلان‌های درون‌برنامه‌ای">
      <div className="mb-4"><MarkReadButton /></div>
      <div className="space-y-3">
        {notifications.length === 0 ? <p className="text-sm text-slate-500">اعلانی وجود ندارد.</p> : notifications.map((n) => (
          <div key={n.id} className={`rounded-xl border p-3 ${n.isRead ? "border-slate-200 bg-white" : "border-brand-200 bg-brand-50/30"}`}>
            <p className="font-semibold">{n.title}</p>
            <p className="mt-1 text-sm text-slate-600">{n.body}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
