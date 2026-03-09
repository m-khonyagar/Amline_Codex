import { cn } from "@/lib/utils";

type CardProps = {
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
};

export function Card({ title, description, className, children }: CardProps) {
  return (
    <section className={cn("card", className)}>
      {title ? <h3 className="text-base font-bold text-slate-900">{title}</h3> : null}
      {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      <div className={title || description ? "mt-4" : ""}>{children}</div>
    </section>
  );
}
