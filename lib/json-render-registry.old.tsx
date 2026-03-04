"use client";

import { defineRegistry } from "@json-render/react";
import { shadcnComponents } from "@json-render/shadcn";
import { playgroundCatalog } from "@/lib/json-render-catalog";
import ArtifactChart from "@/components/chat/artifact-chart";
import { cn } from "@/lib/utils";

// ─── Custom renderers ─────────────────────────────────────────────────────────

const Rating = ({
  props,
}: {
  props: { value: number; max?: number | null; label?: string | null };
}) => {
  const max = props.max ?? 5;
  const value = Math.min(max, Math.max(0, props.value ?? 0));
  return (
    <div className="space-y-1">
      {props.label && <div className="text-sm font-medium">{props.label}</div>}
      <div className="flex gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <svg
            key={i}
            className={cn(
              "w-5 h-5",
              i < value
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted",
            )}
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    </div>
  );
};

// ─── Registry ─────────────────────────────────────────────────────────────────

const { registry, handlers } = defineRegistry(playgroundCatalog, {
  components: {
    // ── Layout ──────────────────────────────────────────────────────────
    Card: shadcnComponents.Card,
    Stack: shadcnComponents.Stack,
    Grid: shadcnComponents.Grid,
    Separator: shadcnComponents.Separator,
    Tabs: shadcnComponents.Tabs,
    Accordion: shadcnComponents.Accordion,
    Collapsible: shadcnComponents.Collapsible,
    Dialog: shadcnComponents.Dialog,
    Drawer: shadcnComponents.Drawer,
    Carousel: shadcnComponents.Carousel,

    // ── Data Display ────────────────────────────────────────────────────
    Table: shadcnComponents.Table,
    Heading: shadcnComponents.Heading,
    Text: shadcnComponents.Text,
    Image: shadcnComponents.Image,
    Avatar: shadcnComponents.Avatar,
    Badge: shadcnComponents.Badge,
    Alert: shadcnComponents.Alert,
    Progress: shadcnComponents.Progress,
    Skeleton: shadcnComponents.Skeleton,
    Spinner: shadcnComponents.Spinner,
    Tooltip: shadcnComponents.Tooltip,
    Popover: shadcnComponents.Popover,
    Rating,

    // ── Charts ──────────────────────────────────────────────────────────
    Chart: ({ props }) => <ArtifactChart {...props} />,

    // ── Form Inputs ─────────────────────────────────────────────────────
    Input: shadcnComponents.Input,
    Textarea: shadcnComponents.Textarea,
    Select: shadcnComponents.Select,
    Checkbox: shadcnComponents.Checkbox,
    Radio: shadcnComponents.Radio,
    Switch: shadcnComponents.Switch,
    Slider: shadcnComponents.Slider,

    // ── Actions ─────────────────────────────────────────────────────────
    Button: shadcnComponents.Button,
    Link: shadcnComponents.Link,
    DropdownMenu: shadcnComponents.DropdownMenu,
    Toggle: shadcnComponents.Toggle,
    ToggleGroup: shadcnComponents.ToggleGroup,
    ButtonGroup: shadcnComponents.ButtonGroup,
    Pagination: shadcnComponents.Pagination,
  },
  actions: {
    buttonClick: async () => {
      // Simple toast notification simulation
      console.log("Button clicked");
    },
    formSubmit: async () => {
      console.log("Form submitted");
    },
    linkClick: async () => {
      console.log("Link clicked");
    },
  },
});

export { registry, handlers };
