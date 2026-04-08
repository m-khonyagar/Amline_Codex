"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  const variants: Record<string, string> = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    danger: "inline-flex h-11 items-center justify-center rounded-xl bg-red-600 px-5 text-sm font-semibold text-white hover:bg-red-700"
  };

  return <button className={cn(variants[variant], className)} {...props} />;
}
