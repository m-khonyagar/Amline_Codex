import { cn } from "@/lib/utils";

const statuses: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700",
  PLANNING: "bg-blue-50 text-blue-700",
  ON_HOLD: "bg-amber-50 text-amber-700",
  COMPLETED: "bg-slate-100 text-slate-700",
  TODO: "bg-slate-100 text-slate-700",
  IN_PROGRESS: "bg-blue-50 text-blue-700",
  IN_REVIEW: "bg-violet-50 text-violet-700",
  DONE: "bg-emerald-50 text-emerald-700",
  LOW: "bg-slate-100 text-slate-700",
  MEDIUM: "bg-blue-50 text-blue-700",
  HIGH: "bg-amber-50 text-amber-700",
  URGENT: "bg-red-50 text-red-700",
  LEAD: "bg-slate-100 text-slate-700",
  CONTACTED: "bg-blue-50 text-blue-700",
  NEGOTIATION: "bg-amber-50 text-amber-700",
  CONTRACT: "bg-indigo-50 text-indigo-700",
  WON: "bg-emerald-50 text-emerald-700",
  LOST: "bg-red-50 text-red-700"
};

export function StatusBadge({ value, className }: { value: string; className?: string }) {
  return <span className={cn("badge", statuses[value] ?? "bg-slate-100 text-slate-700", className)}>{value}</span>;
}
