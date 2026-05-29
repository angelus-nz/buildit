import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "../page";

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue(null),
}));

async function renderPage() {
  const element = await HomePage();
  return render(element);
}

describe("HomePage — landing page (logged-out)", () => {
  describe("Navigation", () => {
    it("renders the BuildIt brand", async () => {
      await renderPage();
      const brands = screen.getAllByText("BuildIt");
      expect(brands.length).toBeGreaterThanOrEqual(1);
    });

    it("renders Sign in link to /auth/signin", async () => {
      await renderPage();
      const signInLinks = screen
        .getAllByRole("link")
        .filter((l) => l.getAttribute("href") === "/auth/signin");
      expect(signInLinks.length).toBeGreaterThanOrEqual(1);
    });

    it("renders Get Started link to /auth/register", async () => {
      await renderPage();
      const registerLinks = screen
        .getAllByRole("link")
        .filter((l) => l.getAttribute("href") === "/auth/register");
      expect(registerLinks.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Hero section", () => {
    it("renders the primary headline", async () => {
      await renderPage();
      expect(screen.getByRole("heading", { level: 1 })).toBeDefined();
    });

    it("renders amber accent text in headline", async () => {
      await renderPage();
      const matches = screen.getAllByText(/get paid faster/i);
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it("renders hero subheading copy", async () => {
      await renderPage();
      expect(screen.getByText(/showcase your work/i)).toBeDefined();
    });

    it("renders Start for free CTA linking to /auth/register", async () => {
      await renderPage();
      const ctaLinks = screen
        .getAllByRole("link")
        .filter((l) => l.getAttribute("href") === "/auth/register");
      expect(ctaLinks.length).toBeGreaterThanOrEqual(1);
      const texts = ctaLinks.map((l) => l.textContent ?? "");
      expect(texts.some((t) => /start for free/i.test(t))).toBe(true);
    });
  });

  describe("Social proof bar", () => {
    it("renders trusted tradesmen count", async () => {
      await renderPage();
      expect(screen.getByText(/trusted by 500\+ tradesmen/i)).toBeDefined();
    });

    it("renders council consent badge", async () => {
      await renderPage();
      expect(screen.getByText(/council consent ready/i)).toBeDefined();
    });

    it("renders mobile-first badge", async () => {
      await renderPage();
      expect(screen.getByText(/mobile-first design/i)).toBeDefined();
    });
  });

  describe("Features section", () => {
    it("renders the features heading", async () => {
      await renderPage();
      expect(
        screen.getByRole("heading", { name: /everything you need to run your trade business/i })
      ).toBeDefined();
    });

    it("renders Project Showcase card", async () => {
      await renderPage();
      expect(screen.getByText("Project Showcase")).toBeDefined();
    });

    it("renders Quotes & Invoices card", async () => {
      await renderPage();
      expect(screen.getByText("Quotes & Invoices")).toBeDefined();
    });

    it("renders Council Consents card", async () => {
      await renderPage();
      expect(screen.getByText("Council Consents")).toBeDefined();
    });

    it("renders Customer Messaging card", async () => {
      await renderPage();
      expect(screen.getByText("Customer Messaging")).toBeDefined();
    });

    it("renders Find Customers card", async () => {
      await renderPage();
      expect(screen.getByText("Find Customers")).toBeDefined();
    });

    it("renders Business Dashboard card", async () => {
      await renderPage();
      expect(screen.getByText("Business Dashboard")).toBeDefined();
    });
  });

  describe("Testimonials section", () => {
    it("renders section heading", async () => {
      await renderPage();
      expect(
        screen.getByRole("heading", { name: /trusted by tradesmen across nz/i })
      ).toBeDefined();
    });

    it("renders John Doe testimonial", async () => {
      await renderPage();
      expect(screen.getByText("John Doe")).toBeDefined();
      expect(screen.getByText(/construction contractor, auckland/i)).toBeDefined();
    });

    it("renders Sarah Johnson testimonial", async () => {
      await renderPage();
      expect(screen.getByText("Sarah Johnson")).toBeDefined();
      expect(screen.getByText(/kitchen remodeler, wellington/i)).toBeDefined();
    });
  });

  describe("CTA section", () => {
    it("renders final CTA heading", async () => {
      await renderPage();
      expect(
        screen.getByRole("heading", { name: /ready to grow your trade business/i })
      ).toBeDefined();
    });

    it("renders Create free account CTA", async () => {
      await renderPage();
      const ctaLinks = screen
        .getAllByRole("link")
        .filter((l) => l.getAttribute("href") === "/auth/register");
      const texts = ctaLinks.map((l) => l.textContent ?? "");
      expect(texts.some((t) => /create free account/i.test(t))).toBe(true);
    });
  });

  describe("Footer", () => {
    it("renders Sign in and Sign up footer links when logged out", async () => {
      await renderPage();
      const signInFooter = screen
        .getAllByRole("link")
        .filter((l) => l.getAttribute("href") === "/auth/signin");
      expect(signInFooter.length).toBeGreaterThanOrEqual(1);
    });

    it("renders copyright with current year", async () => {
      await renderPage();
      const year = new Date().getFullYear().toString();
      expect(screen.getByText(new RegExp(year))).toBeDefined();
    });
  });

  describe("Design tokens", () => {
    it("root element uses white background", async () => {
      const { container } = await renderPage();
      const root = container.firstElementChild as HTMLElement;
      expect(root.className).toContain("bg-white");
    });

    it("header uses white background", async () => {
      const { container } = await renderPage();
      const header = container.querySelector("header");
      expect(header?.className).toContain("bg-white");
    });

    it("hero section has amber gradient", async () => {
      const { container } = await renderPage();
      const hero = container.querySelector("section");
      expect(hero?.innerHTML).toContain("amber");
    });
  });
});
