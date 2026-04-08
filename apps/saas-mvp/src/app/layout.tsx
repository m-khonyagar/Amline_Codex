import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";

import { AppProviders } from "@/components/providers/app-providers";

export const metadata: Metadata = {
  title: "پلتفرم یکپارچه مدیریت کار",
  description: "مدیریت پروژه، وظایف، همکاری تیمی و CRM در یک سیستم فارسی"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
