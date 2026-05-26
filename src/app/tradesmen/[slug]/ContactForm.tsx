"use client";

import { useState } from "react";

interface Props {
  businessId: string;
  businessName: string;
}

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function ContactForm({ businessId, businessName }: Props) {
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function update(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, ...form }),
      });

      if (res.status === 429) {
        const data = await res.json();
        setErrorMsg(data.error ?? "Too many requests. Please try again later.");
        setStatus("error");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setErrorMsg("Network error. Please check your connection.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <p className="text-green-800 font-medium">Message sent!</p>
        <p className="text-green-700 text-sm mt-1">
          {businessName} will be in touch soon.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm text-green-700 underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Contact {businessName}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="inq-name" className="block text-sm font-medium text-gray-700 mb-1">
            Your name
          </label>
          <input
            id="inq-name"
            type="text"
            required
            maxLength={100}
            value={form.name}
            onChange={update("name")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label htmlFor="inq-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            id="inq-email"
            type="email"
            required
            value={form.email}
            onChange={update("email")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="jane@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="inq-subject" className="block text-sm font-medium text-gray-700 mb-1">
          Subject
        </label>
        <input
          id="inq-subject"
          type="text"
          required
          maxLength={200}
          value={form.subject}
          onChange={update("subject")}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Bathroom renovation quote"
        />
      </div>

      <div>
        <label htmlFor="inq-message" className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          id="inq-message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          value={form.message}
          onChange={update("message")}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Describe your project or question..."
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{form.message.length}/2000</p>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors"
      >
        {status === "loading" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
