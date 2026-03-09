import { SignupForm } from "@/components/forms/signup-form";

export default function SignupPage() {
  return (
    <main className="container-page flex min-h-screen items-center justify-center py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h1 className="text-2xl font-bold">ثبت‌نام</h1>
        <p className="mt-2 text-sm text-slate-500">حساب سازمانی خود را بسازید.</p>
        <div className="mt-6"><SignupForm /></div>
      </div>
    </main>
  );
}
