import { BusinessCategory } from "@prisma/client";

export const CATEGORY_LABELS: Record<BusinessCategory, string> = {
  PLUMBING: "Plumber",
  ELECTRICAL: "Electrician",
  CARPENTRY: "Carpenter",
  PAINTING: "Painter",
  ROOFING: "Roofer",
  LANDSCAPING: "Landscaper",
  HVAC: "HVAC Technician",
  MASONRY: "Mason",
  TILING: "Tiler",
  GENERAL: "General Builder",
  OTHER: "Tradesman",
};

export const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).map(
  ([value, label]) => ({ value: value as BusinessCategory, label })
);
