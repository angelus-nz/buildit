import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardPage from "../dashboard/page";

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("DashboardPage", () => {
  describe("Page heading", () => {
    it("renders Dashboard heading", () => {
      render(<DashboardPage />);
      expect(screen.getByRole("heading", { name: /dashboard/i })).toBeDefined();
    });

    it("renders New Project CTA linking to /dashboard/projects/new", () => {
      render(<DashboardPage />);
      const link = screen.getByRole("link", { name: /new project/i });
      expect(link).toHaveAttribute("href", "/dashboard/projects/new");
    });
  });

  describe("Stats overview", () => {
    it("renders Active Projects metric card", () => {
      render(<DashboardPage />);
      expect(screen.getByText("Active Projects")).toBeDefined();
    });

    it("renders Pending Quotes metric card", () => {
      render(<DashboardPage />);
      expect(screen.getByText("Pending Quotes")).toBeDefined();
    });

    it("renders Revenue metric card", () => {
      render(<DashboardPage />);
      expect(screen.getByText("Revenue (MTD)")).toBeDefined();
    });
  });

  describe("Recent projects", () => {
    it("renders View all link to /dashboard/projects", () => {
      render(<DashboardPage />);
      const link = screen.getByRole("link", { name: /view all/i });
      expect(link).toHaveAttribute("href", "/dashboard/projects");
    });

    it("renders Kitchen Renovation project row", () => {
      render(<DashboardPage />);
      expect(screen.getByText("Kitchen Renovation")).toBeDefined();
    });
  });

  describe("Quick actions — all links must work (US-3, US-4)", () => {
    it("Create Project links to /dashboard/projects/new", () => {
      render(<DashboardPage />);
      const links = screen
        .getAllByRole("link")
        .filter((l) => l.getAttribute("href") === "/dashboard/projects/new");
      expect(links.length).toBeGreaterThanOrEqual(1);
    });

    it("Edit Profile links to /profile/edit", () => {
      render(<DashboardPage />);
      const link = screen.getByRole("link", { name: /edit profile/i });
      expect(link).toHaveAttribute("href", "/profile/edit");
    });

    it("Send Quote links to /dashboard/quotes/new", () => {
      render(<DashboardPage />);
      const link = screen.getByRole("link", { name: /send quote/i });
      expect(link).toHaveAttribute("href", "/dashboard/quotes/new");
    });

    it("New Invoice links to /dashboard/invoices/new", () => {
      render(<DashboardPage />);
      const link = screen.getByRole("link", { name: /new invoice/i });
      expect(link).toHaveAttribute("href", "/dashboard/invoices/new");
    });
  });

  describe("Design tokens", () => {
    it("renders white card backgrounds", () => {
      const { container } = render(<DashboardPage />);
      expect(container.innerHTML).toContain("bg-white");
    });

    it("uses amber accent for primary CTA", () => {
      const { container } = render(<DashboardPage />);
      expect(container.innerHTML).toContain("bg-amber-500");
    });
  });
});
