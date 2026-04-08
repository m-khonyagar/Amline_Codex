"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { loginSchema } from "@/lib/validation/schemas";

type LoginInput = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message ?? "خطا در ورود");
      return;
    }

    toast.success("ورود با موفقیت انجام شد");
    router.push("/dashboard");
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm">ایمیل</label>
        <input className="input" {...form.register("email")} placeholder="name@company.com" />
        {form.formState.errors.email ? <p className="mt-1 text-xs text-red-600">{form.formState.errors.email.message}</p> : null}
      </div>
      <div>
        <label className="mb-1 block text-sm">رمز عبور</label>
        <input type="password" className="input" {...form.register("password")} />
        {form.formState.errors.password ? <p className="mt-1 text-xs text-red-600">{form.formState.errors.password.message}</p> : null}
      </div>
      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>ورود به حساب</Button>
      <p className="text-center text-sm text-slate-500">حساب ندارید؟ <Link className="text-brand-600" href="/signup">ثبت‌نام</Link></p>
    </form>
  );
}
