import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import DashboardPage from "../dashboard/page";

describe("DashboardPage", () => {
  it("renders the Workshop Pulse heading and workshop IA", () => {
    render(<DashboardPage />);

    expect(screen.getByRole("heading", { name: /workshop pulse/i })).toBeDefined();
    expect(screen.getByRole("heading", { name: /jobs/i })).toBeDefined();
    expect(screen.getByRole("heading", { name: /client visibility queue/i })).toBeDefined();
    expect(screen.getByRole("heading", { name: /emptystate: no urgent part requests/i })).toBeDefined();
    expect(screen.getByRole("heading", { name: /workshop confidence report/i })).toBeDefined();
  });

  it("renders required dashboard components from synthetic workshop data", () => {
    render(<DashboardPage />);

    expect(screen.getByText("ReviewBanner")).toBeDefined();
    expect(screen.getByText("ActionQueue")).toBeDefined();
    expect(screen.getByText("MediaUploader")).toBeDefined();
    expect(screen.getByText("Kowhai Street deck rebuild")).toBeDefined();
    expect(screen.getByText("Old joists removed")).toBeDefined();
    expect(screen.getAllByText(/status:/i).length).toBeGreaterThanOrEqual(3);
  });

  it("renders workshop metric cards", () => {
    render(<DashboardPage />);

    expect(screen.getByText("Active Jobs")).toBeDefined();
    expect(screen.getByText("Client Updates")).toBeDefined();
    expect(screen.getByText("Parts Waiting")).toBeDefined();
  });

  it("switches the job detail timeline when a job is selected", () => {
    render(<DashboardPage />);

    fireEvent.click(screen.getAllByRole("button", { name: /view job/i })[1]);
    expect(screen.getByText("Harbour Road bathroom rough-in")).toBeDefined();
    expect(screen.getByText("Pressure test passed")).toBeDefined();
  });

  it("validates short progress updates inline", () => {
    render(<DashboardPage />);

    fireEvent.change(screen.getByLabelText(/plain-language update/i), { target: { value: "Too short" } });
    fireEvent.click(screen.getByRole("button", { name: /add progress update/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(/at least 20 characters/i);
  });

  it("records explicit client visibility state for valid updates", () => {
    render(<DashboardPage />);

    fireEvent.change(screen.getByLabelText(/plain-language update/i), {
      target: { value: "Framing passed inspection and roof trusses are staged for Friday." },
    });
    fireEvent.click(screen.getByLabelText(/internal only/i));
    fireEvent.click(screen.getByRole("button", { name: /add progress update/i }));

    expect(screen.getByText(/progress update added as internal only/i)).toBeDefined();
  });

  it("uses tokenized workshop style hooks", () => {
    const { container } = render(<DashboardPage />);

    expect(container.innerHTML).toContain("var(--workshop-card)");
    expect(container.innerHTML).toContain("var(--workshop-focus)");
    expect(container.innerHTML).toContain("min-h-12");
  });
});
