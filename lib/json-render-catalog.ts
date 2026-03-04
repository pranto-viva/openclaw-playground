import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { shadcnComponentDefinitions } from "@json-render/shadcn/catalog";
import { z } from "zod";

/**
 * Web playground component catalog
 *
 * This defines the components available for AI generation in the playground.
 * Components and actions are implemented in lib/registry.tsx via defineRegistry.
 *
 * Keep schemas simple — one format per prop, no unions.
 * Fewer components = less confusion for the AI.
 */

// Custom component definitions not in shadcn
const ratingDefinition = {
  props: z.object({
    value: z.number(),
    max: z.number().nullable(),
    label: z.string().nullable(),
  }),
  description: "Star rating display",
};

const chartDefinition = {
  props: z.object({
    type: z.enum(["bar", "line", "area", "pie"]),
    data: z.array(
      z.record(z.string(), z.union([z.string(), z.number(), z.null()])),
    ),
    title: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    xKey: z.string().nullable().optional(),
    categoryKey: z.string().nullable().optional(),
    valueKey: z.string().nullable().optional(),
    series: z
      .array(
        z.object({
          key: z.string(),
          label: z.string().optional(),
          color: z.string().optional(),
          stackId: z.string().optional(),
        }),
      )
      .optional(),
    height: z.number().int().min(180).max(600).nullable().optional(),
    showGrid: z.boolean().nullable().optional(),
    showLegend: z.boolean().nullable().optional(),
    showTooltip: z.boolean().nullable().optional(),
  }),
  description:
    "Statistical chart widget for time series and categorical analysis. Supports bar, line, area, and pie charts.",
};

export const playgroundCatalog = defineCatalog(schema, {
  components: {
    // ── Layout ──────────────────────────────────────────────────────────
    // Use shadcnComponentDefinitions for components that exist in shadcn
    Card: shadcnComponentDefinitions.Card,
    Stack: shadcnComponentDefinitions.Stack,
    Grid: shadcnComponentDefinitions.Grid,
    Separator: shadcnComponentDefinitions.Separator,
    Tabs: shadcnComponentDefinitions.Tabs,
    Accordion: shadcnComponentDefinitions.Accordion,
    Collapsible: shadcnComponentDefinitions.Collapsible,
    Dialog: shadcnComponentDefinitions.Dialog,
    Drawer: shadcnComponentDefinitions.Drawer,
    Carousel: shadcnComponentDefinitions.Carousel,

    // ── Data Display ────────────────────────────────────────────────────
    Table: shadcnComponentDefinitions.Table,
    Heading: shadcnComponentDefinitions.Heading,
    Text: shadcnComponentDefinitions.Text,
    Image: shadcnComponentDefinitions.Image,
    Avatar: shadcnComponentDefinitions.Avatar,
    Badge: shadcnComponentDefinitions.Badge,
    Alert: shadcnComponentDefinitions.Alert,
    Progress: shadcnComponentDefinitions.Progress,
    Skeleton: shadcnComponentDefinitions.Skeleton,
    Spinner: shadcnComponentDefinitions.Spinner,
    Tooltip: shadcnComponentDefinitions.Tooltip,
    Popover: shadcnComponentDefinitions.Popover,
    Rating: ratingDefinition,

    // ── Charts ──────────────────────────────────────────────────────────
    Chart: chartDefinition,

    // ── Form Inputs ─────────────────────────────────────────────────────
    Input: shadcnComponentDefinitions.Input,
    Textarea: shadcnComponentDefinitions.Textarea,
    Select: shadcnComponentDefinitions.Select,
    Checkbox: shadcnComponentDefinitions.Checkbox,
    Radio: shadcnComponentDefinitions.Radio,
    Switch: shadcnComponentDefinitions.Switch,
    Slider: shadcnComponentDefinitions.Slider,

    // ── Actions ─────────────────────────────────────────────────────────
    Button: shadcnComponentDefinitions.Button,
    Link: shadcnComponentDefinitions.Link,
    DropdownMenu: shadcnComponentDefinitions.DropdownMenu,
    Toggle: shadcnComponentDefinitions.Toggle,
    ToggleGroup: shadcnComponentDefinitions.ToggleGroup,
    ButtonGroup: shadcnComponentDefinitions.ButtonGroup,
    Pagination: shadcnComponentDefinitions.Pagination,
  },

  actions: {
    buttonClick: {
      params: z.object({
        message: z.string().nullable(),
      }),
      description: "Shows a toast with the message.",
    },

    formSubmit: {
      params: z.object({
        formName: z.string().nullable(),
      }),
      description: "Shows a toast confirming form submission.",
    },

    linkClick: {
      params: z.object({
        href: z.string(),
      }),
      description: "Shows a toast with the link destination.",
    },
  },
});
