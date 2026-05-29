"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthForm } from "@/app/(auth)/layout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, this would be an actual forgot password call
      console.log("Forgot password attempt for:", email);
      setSuccess(true);
    } catch (err) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      title="Reset your password"
      description="Enter your email address and we'll send you a link to reset your password"
      footerLinkText="Back to sign in"
      footerLinkHref="/login"
    >
      {success ? (
        <div className="text-center">
          <p className="text-green-600 mb-4">
            If an account exists with that email, you&apos;ll receive a password reset link.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Please check your inbox and follow the instructions.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending reset link..." : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthForm>
  );
}