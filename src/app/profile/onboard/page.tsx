"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORY_OPTIONS } from "@/lib/categories";

type Step = 1 | 2 | 3;

interface FormState {
  businessName: string;
  category: string;
  bio: string;
  phone: string;
  website: string;
  suburb: string;
  city: string;
  state: string;
}

const EMPTY_FORM: FormState = {
  businessName: "",
  category: "GENERAL",
  bio: "",
  phone: "",
  website: "",
  suburb: "",
  city: "",
  state: "",
};

export default function OnboardPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/profile/onboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessName: form.businessName,
        category: form.category,
        bio: form.bio || undefined,
        phone: form.phone || undefined,
        website: form.website || undefined,
        suburb: form.suburb || undefined,
        city: form.city || undefined,
        state: form.state || undefined,
        country: "NZ",
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong");
      return;
    }

    router.push("/profile/edit?onboarded=1");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-lg font-semibold text-gray-900">BuildIt</h1>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              {([1, 2, 3] as const).map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      s <= step
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`h-0.5 w-12 ${s < step ? "bg-blue-600" : "bg-gray-200"}`}
                    />
                  )}
                </div>
              ))}
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {step === 1 && "Business basics"}
              {step === 2 && "About your business"}
              {step === 3 && "Contact & location"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {step === 1 && "Tell us about your trade"}
              {step === 2 && "Help customers understand what you offer"}
              {step === 3 && "How customers can reach you"}
            </p>
          </div>

          <form onSubmit={step === 3 ? handleSubmit : undefined} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 border border-red-200">
                {error}
              </div>
            )}

            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.businessName}
                    onChange={(e) => set("businessName", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Smith Plumbing Ltd"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trade <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORY_OPTIONS.map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => set("category", value)}
                        className={`py-2.5 px-3 rounded-lg border-2 text-sm font-medium text-left transition-colors ${
                          form.category === value
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!form.businessName || !form.category}
                  onClick={() => setStep(2)}
                  className="w-full bg-blue-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Continue
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                    <span className="text-gray-400 font-normal ml-1">(optional)</span>
                  </label>
                  <textarea
                    rows={5}
                    value={form.bio}
                    onChange={(e) => set("bio", e.target.value)}
                    maxLength={1000}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Tell customers what makes your business special…"
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {form.bio.length}/1000
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="021 000 0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      type="url"
                      value={form.website}
                      onChange={(e) => set("website", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://smithplumbing.co.nz"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Suburb</label>
                    <input
                      type="text"
                      value={form.suburb}
                      onChange={(e) => set("suburb", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Grey Lynn"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => set("city", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Auckland"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Creating profile…" : "Create profile"}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
