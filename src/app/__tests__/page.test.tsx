import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "../page";

// Mock next/link to render a plain <a> for testability
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("HomePage — landing page", () => {
  describe("Navigation", () => {
    it("renders the BuildIt brand name", () => {
      render(<HomePage />);
      // Brand appears in header and footer
      const brands = screen.getAllByText("BuildIt");
      expect(brands.length).toBeGreaterThanOrEqual(1);
    });

    it("renders nav links to Projects and Dashboard", () => {
      render(<HomePage />);
      expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute(
        "href",
        "/projects"
      );
      expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
        "href",
        "/dashboard"
      );
    });

    it("renders Sign in button in header", () => {
      render(<HomePage />);
      expect(screen.getByRole("button", { name: /sign in/i })).toBeDefined();
    });
  });

  describe("Hero section", () => {
    it("renders the primary headline", () => {
      render(<HomePage />);
      expect(
        screen.getByRole("heading", {
          level: 1,
          name: /showcase your work in progress to customers/i,
        })
      ).toBeDefined();
    });

    it("renders the hero subheading copy", () => {
      render(<HomePage />);
      expect(
        screen.getByText(/buildit helps tradesmen small businesses/i)
      ).toBeDefined();
    });

    it("renders Get Started Free CTA linking to /register", () => {
      render(<HomePage />);
      const ctaLinks = screen
        .getAllByRole("link")
        .filter((l) => l.getAttribute("href") === "/register");
      expect(ctaLinks.length).toBeGreaterThanOrEqual(1);
      expect(ctaLinks[0].textContent).toMatch(/get started free/i);
    });

    it("renders View Demo button", () => {
      render(<HomePage />);
      expect(screen.getByRole("button", { name: /view demo/i })).toBeDefined();
    });
  });

  describe("Features section", () => {
    it("renders the features heading", () => {
      render(<HomePage />);
      expect(
        screen.getByRole("heading", { name: /powerful tools for tradesmen/i })
      ).toBeDefined();
    });

    it("renders Project Showcase feature card", () => {
      render(<HomePage />);
      expect(screen.getByText("Project Showcase")).toBeDefined();
      expect(
        screen.getByText(/display your work in progress/i)
      ).toBeDefined();
    });

    it("renders Business Management feature card", () => {
      render(<HomePage />);
      expect(screen.getByText("Business Management")).toBeDefined();
      expect(
        screen.getByText(/handle quotes, invoices/i)
      ).toBeDefined();
    });

    it("renders Customer Marketplace feature card", () => {
      render(<HomePage />);
      expect(screen.getByText("Customer Marketplace")).toBeDefined();
      expect(
        screen.getByText(/find new customers and grow your business with our integrated marketplace/i)
      ).toBeDefined();
    });
  });

  describe("Social proof / Testimonials", () => {
    it("renders the Trusted by Tradesmen section", () => {
      render(<HomePage />);
      expect(
        screen.getByRole("heading", { name: /trusted by tradesmen/i })
      ).toBeDefined();
    });

    it("renders John Doe testimonial", () => {
      render(<HomePage />);
      expect(screen.getByText("John Doe")).toBeDefined();
      expect(screen.getByText("Construction Contractor")).toBeDefined();
    });

    it("renders Sarah Johnson testimonial", () => {
      render(<HomePage />);
      expect(screen.getByText("Sarah Johnson")).toBeDefined();
      expect(screen.getByText("Kitchen Remodeler")).toBeDefined();
    });
  });

  describe("CTA section", () => {
    it("renders Ready to Transform Your Business heading", () => {
      render(<HomePage />);
      expect(
        screen.getByRole("heading", {
          name: /ready to transform your business/i,
        })
      ).toBeDefined();
    });

    it("renders second Get Started Free CTA", () => {
      render(<HomePage />);
      const ctaLinks = screen
        .getAllByRole("link")
        .filter((l) => l.getAttribute("href") === "/register");
      // Hero CTA + bottom CTA = 2
      expect(ctaLinks.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Footer", () => {
    it("renders About, Terms, Privacy links", () => {
      render(<HomePage />);
      expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
        "href",
        "/about"
      );
      expect(screen.getByRole("link", { name: "Terms" })).toHaveAttribute(
        "href",
        "/terms"
      );
      expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute(
        "href",
        "/privacy"
      );
    });

    it("renders copyright notice with current year", () => {
      render(<HomePage />);
      const year = new Date().getFullYear().toString();
      expect(screen.getByText(new RegExp(year))).toBeDefined();
    });
  });

  describe("Design system — visual tokens", () => {
    it("root element uses slate-50 background token", () => {
      const { container } = render(<HomePage />);
      const root = container.firstElementChild as HTMLElement;
      expect(root.className).toContain("bg-slate-50");
    });

    it("header uses white background token", () => {
      const { container } = render(<HomePage />);
      const header = container.querySelector("header");
      expect(header?.className).toContain("bg-white");
    });

    it("hero section uses amber accent in gradient", () => {
      const { container } = render(<HomePage />);
      const hero = container.querySelector("section");
      expect(hero?.className).toContain("amber");
    });
  });
});
