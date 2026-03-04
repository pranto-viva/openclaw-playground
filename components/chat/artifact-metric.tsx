"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ArtifactMetricProps {
  label: string;
  value: string | number;
  format?: "number" | "currency" | "percent" | null;
  trend?: "up" | "down" | "neutral" | null;
  trendValue?: string | null;
}

function formatValue(
  value: string | number,
  format?: "number" | "currency" | "percent" | null,
): string {
  if (typeof value !== "number") return String(value);
  switch (format) {
    case "currency":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(value);
    case "percent":
      return new Intl.NumberFormat("en-US", {
        style: "percent",
        maximumFractionDigits: 1,
      }).format(value / 100);
    case "number":
      return new Intl.NumberFormat("en-US").format(value);
    default:
      return String(value);
  }
}

export default function ArtifactMetric({
  label,
  value,
  format,
  trend,
  trendValue,
}: ArtifactMetricProps) {
  const displayValue = formatValue(value, format);

  return (
    <div className="flex flex-col gap-1.5 rounded-xl border bg-card p-4">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="tabular-nums text-2xl font-bold text-foreground">
        {displayValue}
      </span>
      {trendValue && (
        <span
          className={cn(
            "flex items-center gap-1 text-xs font-medium",
            trend === "up" && "text-emerald-500",
            trend === "down" && "text-red-500",
            trend === "neutral" && "text-muted-foreground",
            !trend && "text-muted-foreground",
          )}
        >
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
        </span>
      )}
    </div>
  );
}
