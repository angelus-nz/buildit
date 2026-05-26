import { describe, it, expect } from "vitest";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["TRADESMAN", "CUSTOMER"]),
});

describe("register schema validation", () => {
  it("accepts a valid tradesman registration", () => {
    const result = registerSchema.safeParse({
      name: "Alice Builder",
      email: "alice@example.com",
      password: "securepassword",
      role: "TRADESMAN",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a valid customer registration", () => {
    const result = registerSchema.safeParse({
      name: "Bob Customer",
      email: "bob@example.com",
      password: "securepassword",
      role: "CUSTOMER",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = registerSchema.safeParse({
      name: "A",
      email: "a@example.com",
      password: "securepassword",
      role: "CUSTOMER",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = registerSchema.safeParse({
      name: "Alice",
      email: "not-an-email",
      password: "securepassword",
      role: "CUSTOMER",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = registerSchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      password: "short",
      role: "CUSTOMER",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid role", () => {
    const result = registerSchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      password: "securepassword",
      role: "ADMIN",
    });
    expect(result.success).toBe(false);
  });
});
