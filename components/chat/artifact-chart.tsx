"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const FALLBACK_COLORS = [
  "#d97706", // muted orange
  "#818cf8", // soft indigo
  "#4ade80", // muted green
  "#22d3ee", // soft cyan
  "#f87171", // soft red
  "#c084fc", // soft purple
  "#2dd4bf", // muted teal
  "#f472b6", // soft pink
];

type ChartType = "bar" | "line" | "area" | "pie";

type ChartDataPoint = Record<string | number | symbol, unknown>;

interface ChartSeries {
  key: string;
  label?: string;
  color?: string;
  stackId?: string;
}

export interface ArtifactChartProps {
  type: ChartType;
  data: ChartDataPoint[];
  title?: string | null;
  description?: string | null;
  xKey?: string | null;
  categoryKey?: string | null;
  valueKey?: string | null;
  series?: ChartSeries[];
  height?: number | null;
  showGrid?: boolean | null;
  showLegend?: boolean | null;
  showTooltip?: boolean | null;
}

function isNumberLike(value: unknown) {
  return typeof value === "number" && Number.isFinite(value);
}

function inferNumericKeys(data: ChartDataPoint[]) {
  const keys = new Set<string>();

  for (const row of data) {
    for (const [key, value] of Object.entries(row)) {
      if (isNumberLike(value)) {
        keys.add(key);
      }
    }
  }

  return Array.from(keys);
}

export default function ArtifactChart(props: ArtifactChartProps) {
  const {
    type,
    data,
    title,
    description,
    xKey,
    categoryKey,
    valueKey,
    series,
    height,
    showGrid,
    showLegend,
    showTooltip,
  } = props;

  const safeData = React.useMemo(
    () => (Array.isArray(data) ? data : []),
    [data],
  );
  const resolvedHeight = Math.max(220, Math.min(520, height ?? 300));
  const hasData = safeData.length > 0;

  const inferredNumericKeys = React.useMemo(
    () => inferNumericKeys(safeData),
    [safeData],
  );

  const resolvedXKey =
    xKey && xKey.length > 0
      ? xKey
      : Object.keys(safeData[0] ?? {}).find(
          (key) => !inferredNumericKeys.includes(key),
        );

  const resolvedSeries =
    series && series.length > 0
      ? series
      : inferredNumericKeys
          .filter((key) => key !== resolvedXKey)
          .map<ChartSeries>((key, i) => ({
            key,
            label: key,
            color: FALLBACK_COLORS[i % FALLBACK_COLORS.length],
          }));

  const canRenderCartesian =
    hasData && !!resolvedXKey && resolvedSeries.length > 0 && type !== "pie";

  const pieNameKey =
    categoryKey && categoryKey.length > 0
      ? categoryKey
      : (resolvedXKey ?? "name");
  const pieValueKey =
    valueKey && valueKey.length > 0
      ? valueKey
      : (resolvedSeries[0]?.key ?? inferredNumericKeys[0] ?? "value");

  const chartConfig = React.useMemo(() => {
    if (type === "pie") {
      return {
        [pieValueKey]: {
          label: pieValueKey,
          color: FALLBACK_COLORS[0],
        },
      };
    }

    return Object.fromEntries(
      resolvedSeries.map((item, i) => [
        item.key,
        {
          label: item.label ?? item.key,
          color: item.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
        },
      ]),
    );
  }, [type, pieValueKey, resolvedSeries]);

  if (!hasData) {
    return (
      <Alert>
        <AlertTitle>No chart data available</AlertTitle>
        <AlertDescription>
          The chart component needs a non-empty `data` array.
        </AlertDescription>
      </Alert>
    );
  }

  if (type !== "pie" && !canRenderCartesian) {
    return (
      <Alert>
        <AlertTitle>Unable to render chart</AlertTitle>
        <AlertDescription>
          Provide `xKey` and at least one numeric series in `data`.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      {(title || description) && (
        <div className="space-y-1">
          {title && <h4 className="text-sm font-semibold">{title}</h4>}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      <ChartContainer
        config={chartConfig}
        className="w-full"
        style={{ height: `${resolvedHeight}px` }}
      >
        {type === "bar" ? (
          <BarChart data={safeData} margin={{ left: 4, right: 4 }}>
            {showGrid !== false && <CartesianGrid vertical={false} />}
            <XAxis dataKey={resolvedXKey} tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={36} />
            {showTooltip !== false && (
              <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            )}
            {showLegend !== false && (
              <ChartLegend content={<ChartLegendContent />} />
            )}
            {resolvedSeries.map((item) => (
              <Bar
                key={item.key}
                dataKey={item.key}
                stackId={item.stackId}
                fill={`var(--color-${item.key})`}
                radius={4}
              />
            ))}
          </BarChart>
        ) : type === "line" ? (
          <LineChart data={safeData} margin={{ left: 4, right: 4 }}>
            {showGrid !== false && <CartesianGrid vertical={false} />}
            <XAxis dataKey={resolvedXKey} tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={36} />
            {showTooltip !== false && (
              <ChartTooltip
                content={<ChartTooltipContent indicator="line" />}
              />
            )}
            {showLegend !== false && (
              <ChartLegend content={<ChartLegendContent />} />
            )}
            {resolvedSeries.map((item) => (
              <Line
                key={item.key}
                dataKey={item.key}
                stroke={`var(--color-${item.key})`}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        ) : type === "area" ? (
          <AreaChart data={safeData} margin={{ left: 4, right: 4 }}>
            {showGrid !== false && <CartesianGrid vertical={false} />}
            <XAxis dataKey={resolvedXKey} tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={36} />
            {showTooltip !== false && (
              <ChartTooltip
                content={<ChartTooltipContent indicator="line" />}
              />
            )}
            {showLegend !== false && (
              <ChartLegend content={<ChartLegendContent />} />
            )}
            {resolvedSeries.map((item) => (
              <Area
                key={item.key}
                dataKey={item.key}
                type="monotone"
                stroke={`var(--color-${item.key})`}
                fill={`var(--color-${item.key})`}
                fillOpacity={0.22}
              />
            ))}
          </AreaChart>
        ) : (
          <PieChart>
            {showTooltip !== false && (
              <ChartTooltip
                content={
                  <ChartTooltipContent indicator="dot" nameKey={pieNameKey} />
                }
              />
            )}
            {showLegend !== false && (
              <ChartLegend
                content={<ChartLegendContent nameKey={pieNameKey} />}
              />
            )}
            <Pie
              data={safeData}
              dataKey={pieValueKey}
              nameKey={pieNameKey}
              innerRadius={50}
              outerRadius={95}
            >
              {safeData.map((entry, i) => (
                <Cell
                  key={`${String(entry[pieNameKey] ?? "slice")}-${i}`}
                  fill={FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        )}
      </ChartContainer>
    </div>
  );
}
