import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-5">
      <Card title="تنظیمات عمومی"><p className="text-sm text-slate-600">در این بخش می‌توانید تنظیمات سازمان، اعلان‌ها و یکپارچه‌سازی‌ها را مدیریت کنید.</p></Card>
      <Card title="تنظیمات ذخیره‌سازی"><p className="text-sm text-slate-600">در نسخه MVP از local storage abstraction استفاده شده و برای S3-ready طراحی شده است.</p></Card>
    </div>
  );
}
