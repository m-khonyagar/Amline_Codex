"use client";

import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div dir="rtl" lang="fa" className="min-h-screen">
        {children}
      </div>
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}
