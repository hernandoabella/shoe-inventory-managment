import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: string;
  accent?: "indigo" | "emerald" | "amber" | "sky";
}

const accents: Record<string, string> = {
  indigo: "bg-indigo-50 text-indigo-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  sky: "bg-sky-50 text-sky-600",
};

export function StatsCard({
  title,
  value,
  icon,
  trend,
  accent = "indigo",
}: StatsCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-1 text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        {icon && (
          <div className={cn("rounded-lg p-2.5", accents[accent])}>{icon}</div>
        )}
      </div>
      {trend && (
        <p className="mt-3 text-xs text-gray-400">
          {trend}
        </p>
      )}
    </div>
  );
}

export default StatsCard;
