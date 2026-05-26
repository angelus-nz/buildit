import { describe, it, expect } from "vitest";

const STATUS_LABELS: Record<string, string> = {
  PLANNING: "Planning",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

const STATUS_COLORS: Record<string, string> = {
  PLANNING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
};

function getStatusLabel(status: string): string | undefined {
  return STATUS_LABELS[status];
}

function getStatusColor(status: string): string | undefined {
  return STATUS_COLORS[status];
}

function buildPhotosPayload(
  urls: string[],
  captions: string[]
): Array<{ url: string; caption: string | null; sortOrder: number }> {
  return urls.map((url, i) => ({
    url,
    caption: captions[i] ?? null,
    sortOrder: i,
  }));
}

function projectUrl(slug: string, projectId: string): string {
  return `/tradesmen/${slug}/projects/${projectId}`;
}

function addUpdateUrl(projectId: string): string {
  return `/dashboard/projects/${projectId}/updates/new`;
}

describe("ProjectStatus display", () => {
  it("returns correct label for each status", () => {
    expect(getStatusLabel("PLANNING")).toBe("Planning");
    expect(getStatusLabel("IN_PROGRESS")).toBe("In Progress");
    expect(getStatusLabel("COMPLETED")).toBe("Completed");
  });

  it("returns undefined for unknown status", () => {
    expect(getStatusLabel("UNKNOWN")).toBeUndefined();
  });

  it("returns color classes for each status", () => {
    expect(getStatusColor("PLANNING")).toContain("yellow");
    expect(getStatusColor("IN_PROGRESS")).toContain("blue");
    expect(getStatusColor("COMPLETED")).toContain("green");
  });
});

describe("buildPhotosPayload", () => {
  it("zips urls and captions with sort order", () => {
    const result = buildPhotosPayload(
      ["https://example.com/a.jpg", "https://example.com/b.jpg"],
      ["Before", "After"]
    );
    expect(result).toEqual([
      { url: "https://example.com/a.jpg", caption: "Before", sortOrder: 0 },
      { url: "https://example.com/b.jpg", caption: "After", sortOrder: 1 },
    ]);
  });

  it("uses null caption when captions array is shorter than urls", () => {
    const result = buildPhotosPayload(["https://example.com/a.jpg"], []);
    expect(result[0].caption).toBeNull();
  });

  it("returns empty array for empty input", () => {
    expect(buildPhotosPayload([], [])).toEqual([]);
  });

  it("assigns correct sort order for 3+ photos", () => {
    const urls = [
      "https://example.com/1.jpg",
      "https://example.com/2.jpg",
      "https://example.com/3.jpg",
    ];
    const result = buildPhotosPayload(urls, ["a", "b", "c"]);
    expect(result.map((p) => p.sortOrder)).toEqual([0, 1, 2]);
  });
});

describe("URL helpers", () => {
  it("builds correct public project URL", () => {
    expect(projectUrl("abc-plumbing", "clx123")).toBe(
      "/tradesmen/abc-plumbing/projects/clx123"
    );
  });

  it("builds correct add-update URL", () => {
    expect(addUpdateUrl("clx123")).toBe("/dashboard/projects/clx123/updates/new");
  });
});
