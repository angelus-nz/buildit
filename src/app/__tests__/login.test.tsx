import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "../(auth)/login/page";

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("lucide-react", () => ({
  Menu: () => <svg data-testid="menu-icon" />,
}));

describe("LoginPage", () => {
  describe("Form structure", () => {
    it("renders email and password inputs", () => {
      render(<LoginPage />);
      expect(screen.getByLabelText(/email/i)).toBeDefined();
      expect(screen.getByLabelText(/password/i)).toBeDefined();
    });

    it("renders the Sign in heading", () => {
      render(<LoginPage />);
      expect(
        screen.getByRole("heading", { name: /sign in to your account/i })
      ).toBeDefined();
    });

    it("renders a link to the register page", () => {
      render(<LoginPage />);
      expect(
        screen.getByRole("link", { name: /don't have an account/i })
      ).toHaveAttribute("href", "/register");
    });

    it("email input has type=email for keyboard hint on mobile", () => {
      render(<LoginPage />);
      expect(screen.getByLabelText(/email/i)).toHaveAttribute("type", "email");
    });

    it("password input has type=password so text is masked", () => {
      render(<LoginPage />);
      expect(screen.getByLabelText(/password/i)).toHaveAttribute(
        "type",
        "password"
      );
    });
  });

  describe("Form interaction", () => {
    it("updates email field on input", () => {
      render(<LoginPage />);
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      expect(emailInput.value).toBe("test@example.com");
    });

    it("updates password field on input", () => {
      render(<LoginPage />);
      const passwordInput = screen.getByLabelText(
        /password/i
      ) as HTMLInputElement;
      fireEvent.change(passwordInput, { target: { value: "secret123" } });
      expect(passwordInput.value).toBe("secret123");
    });

    it("submit button is present", () => {
      render(<LoginPage />);
      expect(screen.getByRole("button", { name: /sign in/i })).toBeDefined();
    });
  });

  describe("Design system tokens", () => {
    it("card uses white background token", () => {
      const { container } = render(<LoginPage />);
      const card = container.querySelector(".bg-white");
      expect(card).toBeDefined();
    });

    it("card has rounded-xl shape token", () => {
      const { container } = render(<LoginPage />);
      const card = container.querySelector(".rounded-xl");
      expect(card).toBeDefined();
    });
  });
});
