import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
  };
  icon: LucideIcon;
  href?: string;
}

export function MetricCard({ title, value, change, icon: Icon, href }: MetricCardProps) {
  const isPositive = change && change.value > 0;
  const isNegative = change && change.value < 0;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          {change && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                isPositive && "text-green-600",
                isNegative && "text-red-600",
                !isPositive && !isNegative && "text-slate-600"
              )}
            >
              {isPositive && "↑"}
              {isNegative && "↓"}
              {change.value !== 0 && Math.abs(change.value)}
            </div>
          )}
        </div>

        <div className="mt-4">
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          <p className="mt-1 text-sm text-slate-600">{title}</p>
        </div>

        {change && (
          <p className="mt-4 text-xs text-slate-500">{change.label}</p>
        )}

        {href && (
          <a
            href={href}
            className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            Ver todos →
          </a>
        )}
      </CardContent>
    </Card>
  );
}