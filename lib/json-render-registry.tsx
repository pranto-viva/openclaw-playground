"use client";

import { useState } from "react";
import {
  defineRegistry,
  useBoundProp,
  useStateBinding,
  useFieldValidation,
} from "@json-render/react";
import { toast } from "sonner";

import { playgroundCatalog } from "./json-render-catalog";
import { MarkdownRenderer } from "@/components/chat/markdown-renderer";

// shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Dialog as DialogPrimitive,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion as AccordionPrimitive,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Carousel as CarouselPrimitive,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table as TablePrimitive,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Drawer as DrawerPrimitive,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  DropdownMenu as DropdownMenuPrimitive,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination as PaginationPrimitive,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover as PopoverPrimitive,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import {
  Tabs as TabsPrimitive,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip as TooltipPrimitive,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// =============================================================================
// Registry — components + actions, types inferred from catalog
// =============================================================================

export const { registry, executeAction } = defineRegistry(playgroundCatalog, {
  components: {
    // ── Layout ────────────────────────────────────────────────────────

    Card: ({ props, children }) => {
      const maxWidthClass =
        props.maxWidth === "sm"
          ? "max-w-xs sm:min-w-[280px]"
          : props.maxWidth === "md"
            ? "max-w-sm sm:min-w-[320px]"
            : props.maxWidth === "lg"
              ? "max-w-md sm:min-w-[360px]"
              : "w-full";
      const centeredClass = props.centered ? "mx-auto" : "";

      return (
        <div
          className={`border border-border rounded-lg p-4 bg-card text-card-foreground overflow-hidden ${maxWidthClass} ${centeredClass}`}
        >
          {(props.title || props.description) && (
            <div className="mb-4">
              {props.title && (
                <h3 className="font-semibold text-lg text-left">
                  {props.title}
                </h3>
              )}
              {props.description && (
                <div className="text-sm text-muted-foreground mt-1 text-left">
                  <MarkdownRenderer content={props.description} compact />
                </div>
              )}
            </div>
          )}
          <div className="space-y-3">{children}</div>
        </div>
      );
    },

    Stack: ({ props, children }) => {
      const isHorizontal = props.direction === "horizontal";
      const gapClass =
        props.gap === "lg"
          ? "gap-4"
          : props.gap === "md"
            ? "gap-3"
            : props.gap === "sm"
              ? "gap-2"
              : props.gap === "none"
                ? "gap-0"
                : "gap-3";
      const alignClass =
        props.align === "center"
          ? "items-center"
          : props.align === "end"
            ? "items-end"
            : props.align === "stretch"
              ? "items-stretch"
              : "items-start";
      const justifyClass =
        props.justify === "center"
          ? "justify-center"
          : props.justify === "end"
            ? "justify-end"
            : props.justify === "between"
              ? "justify-between"
              : props.justify === "around"
                ? "justify-around"
                : "";

      return (
        <div
          className={`flex ${isHorizontal ? "flex-row flex-wrap" : "flex-col"} ${gapClass} ${alignClass} ${justifyClass}`}
        >
          {children}
        </div>
      );
    },

    Grid: ({ props, children }) => {
      const n = props.columns ?? 1;
      const cols =
        n >= 6
          ? "grid-cols-6"
          : n >= 5
            ? "grid-cols-5"
            : n >= 4
              ? "grid-cols-4"
              : n >= 3
                ? "grid-cols-3"
                : n >= 2
                  ? "grid-cols-2"
                  : "grid-cols-1";
      const gridGap =
        props.gap === "lg" ? "gap-4" : props.gap === "sm" ? "gap-2" : "gap-3";

      return <div className={`grid ${cols} ${gridGap}`}>{children}</div>;
    },

    Separator: ({ props }) => (
      <Separator
        orientation={props.orientation ?? "horizontal"}
        className={props.orientation === "vertical" ? "h-full mx-2" : "my-3"}
      />
    ),

    Tabs: ({ props, bindings, emit }) => {
      const tabs = props.tabs ?? [];
      const [boundValue, setBoundValue] = useBoundProp<string>(
        props.value as string | undefined,
        bindings?.value,
      );
      const [localValue, setLocalValue] = useState(
        props.defaultValue ?? tabs[0]?.value ?? "",
      );
      const isBound = !!bindings?.value;
      const value = isBound ? (boundValue ?? tabs[0]?.value ?? "") : localValue;
      const setValue = isBound ? setBoundValue : setLocalValue;

      return (
        <TabsPrimitive
          value={value}
          onValueChange={(v) => {
            setValue(v);
            emit("change");
          }}
        >
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </TabsPrimitive>
      );
    },

    Accordion: ({ props }) => {
      const items = props.items ?? [];
      const accordionType = props.type ?? "single";

      if (accordionType === "multiple") {
        return (
          <AccordionPrimitive type="multiple" className="w-full">
            {items.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{item.title}</AccordionTrigger>
                <AccordionContent>
                  <MarkdownRenderer content={item.content} compact />
                </AccordionContent>
              </AccordionItem>
            ))}
          </AccordionPrimitive>
        );
      }
      return (
        <AccordionPrimitive type="single" collapsible className="w-full">
          {items.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{item.title}</AccordionTrigger>
              <AccordionContent>
                <MarkdownRenderer content={item.content} compact />
              </AccordionContent>
            </AccordionItem>
          ))}
        </AccordionPrimitive>
      );
    },

    Collapsible: ({ props, children }) => {
      const [open, setOpen] = useState(props.defaultOpen ?? false);
      return (
        <Collapsible open={open} onOpenChange={setOpen} className="w-full">
          <CollapsibleTrigger asChild>
            <button className="flex w-full items-center justify-between rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
              {props.title}
              <svg
                className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">{children}</CollapsibleContent>
        </Collapsible>
      );
    },

    Dialog: ({ props, children }) => {
      const [open, setOpen] = useStateBinding<boolean>(props.openPath);
      return (
        <DialogPrimitive open={open ?? false} onOpenChange={(v) => setOpen(v)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{props.title}</DialogTitle>
              {props.description && (
                <DialogDescription>{props.description}</DialogDescription>
              )}
            </DialogHeader>
            {children}
          </DialogContent>
        </DialogPrimitive>
      );
    },

    Drawer: ({ props, children }) => {
      const [open, setOpen] = useStateBinding<boolean>(props.openPath);
      return (
        <DrawerPrimitive open={open ?? false} onOpenChange={(v) => setOpen(v)}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{props.title}</DrawerTitle>
              {props.description && (
                <DrawerDescription>{props.description}</DrawerDescription>
              )}
            </DrawerHeader>
            <div className="p-4">{children}</div>
          </DrawerContent>
        </DrawerPrimitive>
      );
    },

    Carousel: ({ props }) => {
      const items = props.items ?? [];
      return (
        <CarouselPrimitive className="w-full">
          <CarouselContent>
            {items.map((item, i) => (
              <CarouselItem
                key={i}
                className="basis-3/4 md:basis-1/2 lg:basis-1/3"
              >
                <div className="border border-border rounded-lg p-4 bg-card h-full">
                  {item.title && (
                    <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                  )}
                  {item.description && (
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </CarouselPrimitive>
      );
    },

    // ── Data Display ──────────────────────────────────────────────────

    Table: ({ props }) => {
      const columns = props.columns ?? [];
      const rawRows: unknown[] = Array.isArray(props.rows) ? props.rows : [];

      const rows = rawRows.map((row) => {
        if (Array.isArray(row)) return row.map(String);
        if (row && typeof row === "object") {
          const obj = row as Record<string, unknown>;
          return columns.map((col) =>
            String(obj[col] ?? obj[col.toLowerCase()] ?? ""),
          );
        }
        return columns.map(() => "");
      });

      return (
        <div className="rounded-md border border-border overflow-hidden">
          <TablePrimitive>
            {props.caption && <TableCaption>{props.caption}</TableCaption>}
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col}>{col}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={i}>
                  {row.map((cell, j) => (
                    <TableCell key={j}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </TablePrimitive>
        </div>
      );
    },

    Heading: ({ props }) => {
      const level = props.level ?? "h2";
      const headingClass =
        level === "h1"
          ? "text-2xl font-bold"
          : level === "h3"
            ? "text-base font-semibold"
            : level === "h4"
              ? "text-sm font-semibold"
              : "text-lg font-semibold";

      if (level === "h1")
        return <h1 className={`${headingClass} text-left`}>{props.text}</h1>;
      if (level === "h3")
        return <h3 className={`${headingClass} text-left`}>{props.text}</h3>;
      if (level === "h4")
        return <h4 className={`${headingClass} text-left`}>{props.text}</h4>;
      return <h2 className={`${headingClass} text-left`}>{props.text}</h2>;
    },

    Text: ({ props }) => {
      const textClass =
        props.variant === "caption"
          ? "text-xs"
          : props.variant === "muted"
            ? "text-sm text-muted-foreground"
            : props.variant === "lead"
              ? "text-xl text-muted-foreground"
              : props.variant === "code"
                ? "font-mono text-sm bg-muted px-1.5 py-0.5 rounded"
                : "text-sm";

      if (props.variant === "code") {
        return <code className={`${textClass} text-left`}>{props.text}</code>;
      }
      return (
        <div className={`${textClass} text-left`}>
          <MarkdownRenderer content={props.text} compact />
        </div>
      );
    },

    Image: ({ props }) => (
      <div
        className="bg-muted border border-border rounded flex items-center justify-center text-xs text-muted-foreground aspect-video"
        style={{ width: props.width ?? 80, height: props.height ?? 60 }}
      >
        {props.alt || "img"}
      </div>
    ),

    Avatar: ({ props }) => {
      const name = props.name || "?";
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
      const avatarSize =
        props.size === "lg"
          ? "w-12 h-12 text-base"
          : props.size === "sm"
            ? "w-8 h-8 text-xs"
            : "w-10 h-10 text-sm";

      return (
        <div
          className={`${avatarSize} rounded-full bg-muted flex items-center justify-center font-medium`}
        >
          {initials}
        </div>
      );
    },

    Badge: ({ props }) => {
      // Handle variant prop - use type assertion to work around strict typing
      const variantValue = props.variant as string | null;
      let variant: "default" | "secondary" | "destructive" | "outline" =
        "default";
      let customClass = "";

      // Map custom variants to shadcn variants
      if (variantValue === "danger") {
        variant = "destructive";
      } else if (variantValue === "success") {
        variant = "secondary";
        customClass =
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      } else if (variantValue === "warning") {
        variant = "secondary";
        customClass =
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      } else if (
        variantValue &&
        ["default", "secondary", "destructive", "outline"].includes(
          variantValue,
        )
      ) {
        variant = variantValue as
          | "default"
          | "secondary"
          | "destructive"
          | "outline";
      }

      return (
        <Badge variant={variant} className={customClass}>
          {props.text}
        </Badge>
      );
    },

    Alert: ({ props }) => {
      const variant = props.type === "error" ? "destructive" : "default";
      const customClass =
        props.type === "success"
          ? "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100"
          : props.type === "warning"
            ? "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100"
            : props.type === "info"
              ? "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100"
              : "";

      return (
        <Alert variant={variant} className={customClass}>
          <AlertTitle>{props.title}</AlertTitle>
          {props.message && (
            <AlertDescription>
              <MarkdownRenderer content={props.message} compact />
            </AlertDescription>
          )}
        </Alert>
      );
    },

    Progress: ({ props }) => {
      const value = Math.min(100, Math.max(0, props.value || 0));
      return (
        <div className="space-y-2">
          {props.label && (
            <Label className="text-sm text-muted-foreground">
              {props.label}
            </Label>
          )}
          <Progress value={value} />
        </div>
      );
    },

    Skeleton: ({ props }) => (
      <Skeleton
        className={props.rounded ? "rounded-full" : "rounded-md"}
        style={{
          width: props.width ?? "100%",
          height: props.height ?? "1.25rem",
        }}
      />
    ),

    Spinner: ({ props }) => {
      const sizeClass =
        props.size === "lg"
          ? "h-8 w-8"
          : props.size === "sm"
            ? "h-4 w-4"
            : "h-6 w-6";
      return (
        <div className="flex items-center gap-2">
          <svg
            className={`${sizeClass} animate-spin text-muted-foreground`}
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          {props.label && (
            <span className="text-sm text-muted-foreground">{props.label}</span>
          )}
        </div>
      );
    },

    Tooltip: ({ props }) => (
      <TooltipProvider>
        <TooltipPrimitive>
          <TooltipTrigger asChild>
            <span className="text-sm underline decoration-dotted cursor-help">
              {props.text}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{props.content}</p>
          </TooltipContent>
        </TooltipPrimitive>
      </TooltipProvider>
    ),

    Popover: ({ props }) => (
      <PopoverPrimitive>
        <PopoverTrigger asChild>
          <Button variant="outline" className="text-sm">
            {props.trigger}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <p className="text-sm">{props.content}</p>
        </PopoverContent>
      </PopoverPrimitive>
    ),

    Rating: ({ props }) => {
      const ratingValue = props.value || 0;
      const maxRating = props.max ?? 5;
      return (
        <div className="space-y-2">
          {props.label && (
            <Label className="text-sm text-muted-foreground">
              {props.label}
            </Label>
          )}
          <div className="flex gap-1">
            {Array.from({ length: maxRating }).map((_, i) => (
              <span
                key={i}
                className={`text-lg ${i < ratingValue ? "text-yellow-400" : "text-muted"}`}
              >
                *
              </span>
            ))}
          </div>
        </div>
      );
    },

    // ── Charts ────────────────────────────────────────────────────────
    Chart: ({ props }) => {
      const data = Array.isArray(props.data) ? props.data : [];
      const height = props.height ?? 400;
      const chartType = props.type ?? "bar";

      // Extract keys for data access
      const xKey = props.xKey ?? props.categoryKey ?? "name";
      const valueKey = props.valueKey ?? "value";
      const series = props.series ?? [{ key: valueKey }];

      // Helper to safely get numeric value
      const getNumericValue = (
        obj: Record<string, unknown>,
        key: string,
      ): number => {
        const val = obj[key];
        return typeof val === "number" ? val : 0;
      };

      // Bar Chart
      if (chartType === "bar") {
        const maxValue = Math.max(
          ...data.map((item) =>
            series.reduce((sum, s) => sum + getNumericValue(item, s.key), 0),
          ),
          1,
        );

        const chartHeight = height - 80; // Reserve space for labels

        return (
          <div className="space-y-3">
            {props.title && (
              <h3 className="font-semibold text-sm">{props.title}</h3>
            )}
            {props.description && (
              <p className="text-xs text-muted-foreground">
                {props.description}
              </p>
            )}
            <div
              className="flex gap-3 items-end"
              style={{ height: `${chartHeight}px` }}
            >
              {data.map((item, i) => {
                const label = String(item[xKey] ?? i);
                const totalValue = series.reduce(
                  (sum, s) => sum + getNumericValue(item, s.key),
                  0,
                );
                // Calculate actual pixel height based on value proportion
                const barHeight = Math.max(
                  (totalValue / maxValue) * chartHeight,
                  totalValue > 0 ? 8 : 0,
                );

                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center justify-end gap-2"
                    style={{ height: `${chartHeight}px` }}
                  >
                    <div className="text-xs text-muted-foreground font-medium">
                      {totalValue}
                    </div>
                    <div
                      className="w-full rounded-t-md transition-all hover:opacity-80"
                      style={{
                        height: `${barHeight}px`,
                        backgroundColor:
                          series[0]?.color ??
                          `hsl(${(i * 137.5) % 360}, 70%, 50%)`,
                      }}
                      title={`${label}: ${totalValue}`}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex gap-3">
              {data.map((item, i) => {
                const label = String(item[xKey] ?? i);
                return (
                  <div key={i} className="flex-1 text-center">
                    <div className="text-xs text-muted-foreground truncate">
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>
            {props.showLegend && series.length > 1 && (
              <div className="flex flex-wrap gap-3 justify-center">
                {series.map((s, idx) => (
                  <div key={s.key} className="flex items-center gap-1.5">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{
                        backgroundColor:
                          s.color ?? `hsl(${(idx * 137.5) % 360}, 70%, 50%)`,
                      }}
                    />
                    <span className="text-xs">{s.label ?? s.key}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      // Line Chart
      if (chartType === "line" || chartType === "area") {
        const allValues = data.flatMap((item) =>
          series.map((s) => getNumericValue(item, s.key)),
        );
        const maxValue = Math.max(...allValues, 1);
        const minValue = Math.min(...allValues, 0);
        const range = maxValue - minValue || 1;

        const width = 400;
        const svgHeight = height - 60;
        const padding = { top: 20, right: 20, bottom: 20, left: 20 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = svgHeight - padding.top - padding.bottom;

        return (
          <div className="space-y-3">
            {props.title && (
              <h3 className="font-semibold text-sm">{props.title}</h3>
            )}
            {props.description && (
              <p className="text-xs text-muted-foreground">
                {props.description}
              </p>
            )}
            <div style={{ height: height }}>
              <svg
                viewBox={`0 0 ${width} ${svgHeight}`}
                className="w-full"
                style={{ height: svgHeight }}
              >
                {/* Grid lines */}
                {props.showGrid !== false && (
                  <g className="text-muted" opacity="0.1">
                    {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
                      <line
                        key={fraction}
                        x1={padding.left}
                        y1={padding.top + chartHeight * (1 - fraction)}
                        x2={width - padding.right}
                        y2={padding.top + chartHeight * (1 - fraction)}
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                    ))}
                  </g>
                )}

                {/* Chart lines/areas */}
                {series.map((s, seriesIdx) => {
                  const points = data.map((item, i) => {
                    const x =
                      padding.left +
                      (data.length > 1
                        ? (i / (data.length - 1)) * chartWidth
                        : chartWidth / 2);
                    const value = getNumericValue(item, s.key);
                    const y =
                      padding.top +
                      chartHeight -
                      ((value - minValue) / range) * chartHeight;
                    return { x, y, value };
                  });

                  const pathD =
                    points.length > 0
                      ? `M ${points.map((p) => `${p.x} ${p.y}`).join(" L ")}`
                      : "";

                  const areaD =
                    chartType === "area" && pathD
                      ? `${pathD} L ${points[points.length - 1]?.x ?? 0} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`
                      : "";

                  const color =
                    s.color ?? `hsl(${(seriesIdx * 137.5) % 360}, 70%, 50%)`;

                  return (
                    <g key={s.key}>
                      {chartType === "area" && areaD && (
                        <path d={areaD} fill={color} opacity="0.2" />
                      )}
                      {pathD && (
                        <path
                          d={pathD}
                          fill="none"
                          stroke={color}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}
                      {points.map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r="3" fill={color}>
                          <title>{`${s.label ?? s.key}: ${p.value}`}</title>
                        </circle>
                      ))}
                    </g>
                  );
                })}
              </svg>

              {/* X-axis labels */}
              <div className="flex justify-between px-5 mt-1">
                {data.map((item, i) => (
                  <div
                    key={i}
                    className="text-xs text-muted-foreground text-center"
                  >
                    {String(item[xKey] ?? i)}
                  </div>
                ))}
              </div>
            </div>

            {props.showLegend !== false && series.length > 1 && (
              <div className="flex flex-wrap gap-3 justify-center">
                {series.map((s, idx) => (
                  <div key={s.key} className="flex items-center gap-1.5">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{
                        backgroundColor:
                          s.color ?? `hsl(${(idx * 137.5) % 360}, 70%, 50%)`,
                      }}
                    />
                    <span className="text-xs">{s.label ?? s.key}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      // Pie Chart
      if (chartType === "pie") {
        // Sum all values for percentage calculation
        const total = data.reduce(
          (sum, item) =>
            sum +
            series.reduce((s, ser) => s + getNumericValue(item, ser.key), 0),
          0,
        );

        if (total === 0) {
          return (
            <div className="space-y-3">
              {props.title && (
                <h3 className="font-semibold text-sm">{props.title}</h3>
              )}
              <div
                className="flex items-center justify-center border border-border rounded-lg bg-muted/20"
                style={{ height: height }}
              >
                <p className="text-sm text-muted-foreground">
                  No data to display
                </p>
              </div>
            </div>
          );
        }

        const size = Math.min(height - 60, 300);
        const radius = size / 2 - 10;
        const centerX = size / 2;
        const centerY = size / 2;

        let currentAngle = -90; // Start at top

        return (
          <div className="space-y-3">
            {props.title && (
              <h3 className="font-semibold text-sm">{props.title}</h3>
            )}
            {props.description && (
              <p className="text-xs text-muted-foreground">
                {props.description}
              </p>
            )}
            <div className="flex items-center justify-center">
              <svg width={size} height={size} className="transform">
                {data.map((item, i) => {
                  const label = String(item[xKey] ?? i);
                  const value = series.reduce(
                    (sum, s) => sum + getNumericValue(item, s.key),
                    0,
                  );
                  const percentage = (value / total) * 100;
                  const angle = (value / total) * 360;

                  const startAngle = (currentAngle * Math.PI) / 180;
                  const endAngle = ((currentAngle + angle) * Math.PI) / 180;

                  const x1 = centerX + radius * Math.cos(startAngle);
                  const y1 = centerY + radius * Math.sin(startAngle);
                  const x2 = centerX + radius * Math.cos(endAngle);
                  const y2 = centerY + radius * Math.sin(endAngle);

                  const largeArcFlag = angle > 180 ? 1 : 0;

                  const pathD = [
                    `M ${centerX} ${centerY}`,
                    `L ${x1} ${y1}`,
                    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    "Z",
                  ].join(" ");

                  const color =
                    series[0]?.color ?? `hsl(${(i * 137.5) % 360}, 70%, 50%)`;

                  currentAngle += angle;

                  return (
                    <path
                      key={i}
                      d={pathD}
                      fill={color}
                      className="hover:opacity-80 transition-opacity"
                    >
                      <title>{`${label}: ${value} (${percentage.toFixed(1)}%)`}</title>
                    </path>
                  );
                })}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
              {data.map((item, i) => {
                const label = String(item[xKey] ?? i);
                const value = series.reduce(
                  (sum, s) => sum + getNumericValue(item, s.key),
                  0,
                );
                const percentage = ((value / total) * 100).toFixed(1);
                const color =
                  series[0]?.color ?? `hsl(${(i * 137.5) % 360}, 70%, 50%)`;

                return (
                  <div key={i} className="flex items-center gap-1.5 text-xs">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-medium">{label}:</span>
                    <span className="text-muted-foreground">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      // Fallback
      return (
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-sm text-muted-foreground">
            Chart type "{chartType}" not implemented
          </p>
        </div>
      );
    },

    // ── Form Inputs ───────────────────────────────────────────────────

    Input: ({ props, bindings, emit }) => {
      const [boundValue, setBoundValue] = useBoundProp<string>(
        props.value as string | undefined,
        bindings?.value,
      );
      const [localValue, setLocalValue] = useState("");
      const isBound = !!bindings?.value;
      const value = isBound ? (boundValue ?? "") : localValue;
      const setValue = isBound ? setBoundValue : setLocalValue;

      const hasValidation = !!(bindings?.value && props.checks?.length);
      const { errors, validate } = useFieldValidation(
        bindings?.value ?? "",
        hasValidation ? { checks: props.checks ?? [] } : undefined,
      );

      return (
        <div className="space-y-2">
          {props.label && <Label htmlFor={props.name}>{props.label}</Label>}
          <Input
            id={props.name}
            name={props.name}
            type={props.type ?? "text"}
            placeholder={props.placeholder ?? ""}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") emit("submit");
            }}
            onFocus={() => emit("focus")}
            onBlur={() => {
              if (hasValidation) validate();
              emit("blur");
            }}
          />
          {errors.length > 0 && (
            <p className="text-sm text-destructive">{errors[0]}</p>
          )}
        </div>
      );
    },

    Textarea: ({ props, bindings }) => {
      const [boundValue, setBoundValue] = useBoundProp<string>(
        props.value as string | undefined,
        bindings?.value,
      );
      const [localValue, setLocalValue] = useState("");
      const isBound = !!bindings?.value;
      const value = isBound ? (boundValue ?? "") : localValue;
      const setValue = isBound ? setBoundValue : setLocalValue;

      const hasValidation = !!(bindings?.value && props.checks?.length);
      const { errors, validate } = useFieldValidation(
        bindings?.value ?? "",
        hasValidation ? { checks: props.checks ?? [] } : undefined,
      );

      return (
        <div className="space-y-2">
          {props.label && <Label htmlFor={props.name}>{props.label}</Label>}
          <Textarea
            id={props.name}
            name={props.name}
            placeholder={props.placeholder ?? ""}
            rows={props.rows ?? 3}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => {
              if (hasValidation) validate();
            }}
          />
          {errors.length > 0 && (
            <p className="text-sm text-destructive">{errors[0]}</p>
          )}
        </div>
      );
    },

    Select: ({ props, bindings, emit }) => {
      const [boundValue, setBoundValue] = useBoundProp<string>(
        props.value as string | undefined,
        bindings?.value,
      );
      const [localValue, setLocalValue] = useState<string>("");
      const isBound = !!bindings?.value;
      const value = isBound ? (boundValue ?? "") : localValue;
      const setValue = isBound ? setBoundValue : setLocalValue;
      const rawOptions = props.options ?? [];
      // Coerce options to strings – AI may produce objects/numbers instead of
      // plain strings which would cause duplicate `[object Object]` keys.
      const options = rawOptions.map((opt) =>
        typeof opt === "string" ? opt : String(opt ?? ""),
      );

      const hasValidation = !!(bindings?.value && props.checks?.length);
      const { errors, validate } = useFieldValidation(
        bindings?.value ?? "",
        hasValidation ? { checks: props.checks ?? [] } : undefined,
      );

      return (
        <div className="space-y-2">
          <Label>{props.label}</Label>
          <Select
            value={value}
            onValueChange={(v) => {
              setValue(v);
              if (hasValidation) validate();
              emit("change");
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={props.placeholder ?? "Select..."} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt, idx) => (
                <SelectItem
                  key={`${idx}-${opt}`}
                  value={opt || `option-${idx}`}
                >
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.length > 0 && (
            <p className="text-sm text-destructive">{errors[0]}</p>
          )}
        </div>
      );
    },

    Checkbox: ({ props, bindings, emit }) => {
      const [boundChecked, setBoundChecked] = useBoundProp<boolean>(
        props.checked as boolean | undefined,
        bindings?.checked,
      );
      const [localChecked, setLocalChecked] = useState(!!props.checked);
      const isBound = !!bindings?.checked;
      const checked = isBound ? (boundChecked ?? false) : localChecked;
      const setChecked = isBound ? setBoundChecked : setLocalChecked;

      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={props.name}
            checked={checked}
            onCheckedChange={(c) => {
              setChecked(c === true);
              emit("change");
            }}
          />
          <Label htmlFor={props.name} className="cursor-pointer">
            {props.label}
          </Label>
        </div>
      );
    },

    Radio: ({ props, bindings, emit }) => {
      const rawOptions = props.options ?? [];
      const options = rawOptions.map((opt) =>
        typeof opt === "string" ? opt : String(opt ?? ""),
      );
      const [boundValue, setBoundValue] = useBoundProp<string>(
        props.value as string | undefined,
        bindings?.value,
      );
      const [localValue, setLocalValue] = useState(options[0] ?? "");
      const isBound = !!bindings?.value;
      const value = isBound ? (boundValue ?? "") : localValue;
      const setValue = isBound ? setBoundValue : setLocalValue;

      return (
        <div className="space-y-2">
          {props.label && <Label>{props.label}</Label>}
          <RadioGroup
            value={value}
            onValueChange={(v) => {
              setValue(v);
              emit("change");
            }}
          >
            {options.map((opt, idx) => (
              <div
                key={`${idx}-${opt}`}
                className="flex items-center space-x-2"
              >
                <RadioGroupItem
                  value={opt || `option-${idx}`}
                  id={`${props.name}-${idx}-${opt}`}
                />
                <Label
                  htmlFor={`${props.name}-${idx}-${opt}`}
                  className="cursor-pointer"
                >
                  {opt}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );
    },

    Switch: ({ props, bindings, emit }) => {
      const [boundChecked, setBoundChecked] = useBoundProp<boolean>(
        props.checked as boolean | undefined,
        bindings?.checked,
      );
      const [localChecked, setLocalChecked] = useState(!!props.checked);
      const isBound = !!bindings?.checked;
      const checked = isBound ? (boundChecked ?? false) : localChecked;
      const setChecked = isBound ? setBoundChecked : setLocalChecked;

      return (
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor={props.name} className="cursor-pointer">
            {props.label}
          </Label>
          <Switch
            id={props.name}
            checked={checked}
            onCheckedChange={(c) => {
              setChecked(c);
              emit("change");
            }}
          />
        </div>
      );
    },

    Slider: ({ props, bindings, emit }) => {
      const [boundValue, setBoundValue] = useBoundProp<number>(
        props.value as number | undefined,
        bindings?.value,
      );
      const [localValue, setLocalValue] = useState(props.min ?? 0);
      const isBound = !!bindings?.value;
      const value = isBound ? (boundValue ?? props.min ?? 0) : localValue;
      const setValue = isBound ? setBoundValue : setLocalValue;

      return (
        <div className="space-y-2">
          {props.label && (
            <div className="flex justify-between">
              <Label className="text-sm">{props.label}</Label>
              <span className="text-sm text-muted-foreground">{value}</span>
            </div>
          )}
          <Slider
            value={[value]}
            min={props.min ?? 0}
            max={props.max ?? 100}
            step={props.step ?? 1}
            onValueChange={(v) => {
              setValue(v[0] ?? 0);
              emit("change");
            }}
          />
        </div>
      );
    },

    // ── Actions ───────────────────────────────────────────────────────

    Button: ({ props, emit }) => {
      const variant =
        props.variant === "danger"
          ? "destructive"
          : props.variant === "secondary"
            ? "secondary"
            : "default";

      return (
        <Button
          variant={variant}
          disabled={props.disabled ?? false}
          onClick={() => emit("press")}
        >
          {props.label}
        </Button>
      );
    },

    Link: ({ props, emit }) => (
      <Button
        variant="link"
        className="h-auto p-0"
        onClick={() => emit("press")}
      >
        {props.label}
      </Button>
    ),

    DropdownMenu: ({ props, emit }) => {
      const items = props.items ?? [];
      return (
        <DropdownMenuPrimitive>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{props.label}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {items.map((item) => (
              <DropdownMenuItem key={item.value} onClick={() => emit("select")}>
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenuPrimitive>
      );
    },

    Toggle: ({ props, bindings, emit }) => {
      const [boundPressed, setBoundPressed] = useBoundProp<boolean>(
        props.pressed as boolean | undefined,
        bindings?.pressed,
      );
      const [localPressed, setLocalPressed] = useState(props.pressed ?? false);
      const isBound = !!bindings?.pressed;
      const pressed = isBound ? (boundPressed ?? false) : localPressed;
      const setPressed = isBound ? setBoundPressed : setLocalPressed;

      return (
        <Toggle
          variant={props.variant ?? "default"}
          pressed={pressed}
          onPressedChange={(v) => {
            setPressed(v);
            emit("change");
          }}
        >
          {props.label}
        </Toggle>
      );
    },

    ToggleGroup: ({ props, bindings, emit }) => {
      const type = props.type ?? "single";
      const items = props.items ?? [];
      const [boundValue, setBoundValue] = useBoundProp<string>(
        props.value as string | undefined,
        bindings?.value,
      );
      const [localValue, setLocalValue] = useState(items[0]?.value ?? "");
      const isBound = !!bindings?.value;
      const value = isBound ? (boundValue ?? "") : localValue;
      const setValue = isBound ? setBoundValue : setLocalValue;

      if (type === "multiple") {
        return (
          <ToggleGroup type="multiple">
            {items.map((item) => (
              <ToggleGroupItem key={item.value} value={item.value}>
                {item.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        );
      }

      return (
        <ToggleGroup
          type="single"
          value={value}
          onValueChange={(v) => {
            if (v) {
              setValue(v);
              emit("change");
            }
          }}
        >
          {items.map((item) => (
            <ToggleGroupItem key={item.value} value={item.value}>
              {item.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      );
    },

    ButtonGroup: ({ props, bindings, emit }) => {
      const buttons = props.buttons ?? [];
      const [boundSelected, setBoundSelected] = useBoundProp<string>(
        props.selected as string | undefined,
        bindings?.selected,
      );
      const [localValue, setLocalValue] = useState(buttons[0]?.value ?? "");
      const isBound = !!bindings?.selected;
      const value = isBound ? (boundSelected ?? "") : localValue;
      const setValue = isBound ? setBoundSelected : setLocalValue;

      return (
        <div className="inline-flex rounded-md border border-border">
          {buttons.map((btn, i) => (
            <button
              key={btn.value}
              className={`px-3 py-1.5 text-sm transition-colors ${
                value === btn.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-muted"
              } ${i > 0 ? "border-l border-border" : ""} ${
                i === 0 ? "rounded-l-md" : ""
              } ${i === buttons.length - 1 ? "rounded-r-md" : ""}`}
              onClick={() => {
                setValue(btn.value);
                emit("change");
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      );
    },

    Pagination: ({ props, bindings, emit }) => {
      const [boundPage, setBoundPage] = useBoundProp<number>(
        props.page as number | undefined,
        bindings?.page,
      );
      const currentPage = boundPage ?? 1;
      const pages = Array.from({ length: props.totalPages }, (_, i) => i + 1);

      return (
        <PaginationPrimitive>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) {
                    setBoundPage(currentPage - 1);
                    emit("change");
                  }
                }}
              />
            </PaginationItem>
            {pages.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    setBoundPage(page);
                    emit("change");
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < props.totalPages) {
                    setBoundPage(currentPage + 1);
                    emit("change");
                  }
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </PaginationPrimitive>
      );
    },
  },

  actions: {
    // Demo actions — show toasts
    buttonClick: async (params) => {
      const message = (params?.message as string) || "Button clicked!";
      toast.success(message);
    },

    formSubmit: async (params) => {
      const formName = (params?.formName as string) || "Form";
      toast.success(`${formName} submitted successfully!`);
    },

    linkClick: async (params) => {
      const href = (params?.href as string) || "#";
      toast.info(`Navigating to: ${href}`);
    },
  },
});

// Fallback component for unknown types
export function Fallback({ type }: { type: string }) {
  return <div className="text-xs text-muted-foreground">[{type}]</div>;
}
