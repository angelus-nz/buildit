import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardPage from "../dashboard/page";

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("DashboardPage", () => {
  describe("Navigation", () => {
    it("renders BuildIt brand in header", () => {
      render(<DashboardPage />);
      expect(screen.getAllByText("BuildIt").length).toBeGreaterThanOrEqual(1);
    });

    it("renders Dashboard nav link", () => {
      render(<DashboardPage />);
      expect(
        screen.getByRole("link", { name: "Dashboard" })
      ).toHaveAttribute("href", "/dashboard");
    });

    it("renders Create Project CTA linking to /projects/new", () => {
      render(<DashboardPage />);
      expect(
        screen.getByRole("link", { name: /create project/i })
      ).toHaveAttribute("href", "/projects/new");
    });
  });

  describe("Stats overview", () => {
    it("renders Active Projects metric card", () => {
      render(<DashboardPage />);
      expect(screen.getByText("Active Projects")).toBeDefined();
    });

    it("renders the page heading", () => {
      render(<DashboardPage />);
      expect(
        screen.getByRole("heading", { name: /dashboard/i })
      ).toBeDefined();
    });
  });

  describe("Design system tokens", () => {
    it("root element uses slate-50 background", () => {
      const { container } = render(<DashboardPage />);
      const root = container.firstElementChild as HTMLElement;
      expect(root.className).toContain("bg-slate-50");
    });

    it("header uses white background token", () => {
      const { container } = render(<DashboardPage />);
      const header = container.querySelector("header");
      expect(header?.className).toContain("bg-white");
    });
  });
});
