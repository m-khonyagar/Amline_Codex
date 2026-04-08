import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <main className="container-page flex min-h-screen items-center justify-center py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h1 className="text-2xl font-bold">ورود به حساب</h1>
        <p className="mt-2 text-sm text-slate-500">برای ادامه وارد پنل مدیریتی شوید.</p>
        <div className="mt-6"><LoginForm /></div>
      </div>
    </main>
  );
}
