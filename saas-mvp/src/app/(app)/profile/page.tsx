import { LogoutButton } from "@/components/forms/logout-button";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <Card title="پروفایل کاربر">
      <div className="space-y-3 text-sm">
        <p>نام: {user.fullName}</p>
        <p>ایمیل: {user.email}</p>
        <LogoutButton />
      </div>
    </Card>
  );
}
