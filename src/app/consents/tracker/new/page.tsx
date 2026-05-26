"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import councilsData from "@/data/councils.json";

export default function NewConsentApplicationPage() {
  const router = useRouter();
  const [councilId, setCouncilId] = useState("");
  const [consentTypeId, setConsentTypeId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedCouncil = councilsData.councils.find((c) => c.id === councilId);
  const availableTypes = selectedCouncil?.consentTypes ?? [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/consents/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ councilId, consentTypeId, title, description, siteAddress }),
      });

      const data = (await res.json()) as { id?: string; error?: string };

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }

      router.push(`/consents/tracker/${data.id}`);
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-gray-900">BuildIt</Link>
          <Link href="/consents/tracker" className="text-sm text-gray-600 hover:text-gray-900">
            My Applications
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/consents" className="hover:underline">Council Consents</Link>
          <span>/</span>
          <Link href="/consents/tracker" className="hover:underline">My Applications</Link>
          <span>/</span>
          <span>New</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">New consent application</h1>
        <p className="text-gray-500 text-sm mb-8">
          Record a new council consent application to track its progress and correspondence.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-200 p-6 space-y-5"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Council <span className="text-red-500">*</span>
            </label>
            <select
              value={councilId}
              onChange={(e) => {
                setCouncilId(e.target.value);
                setConsentTypeId("");
              }}
              required
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select council…</option>
              {councilsData.councils.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Consent type <span className="text-red-500">*</span>
            </label>
            <select
              value={consentTypeId}
              onChange={(e) => setConsentTypeId(e.target.value)}
              required
              disabled={!councilId}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">Select consent type…</option>
              {availableTypes.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            {consentTypeId && selectedCouncil && (
              <p className="text-xs text-gray-400 mt-1">
                {selectedCouncil.consentTypes.find((t) => t.id === consentTypeId)?.feeEstimate}
                {" — "}
                {selectedCouncil.consentTypes.find((t) => t.id === consentTypeId)?.processingTime}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Application title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. New dwelling — 45 Example Street"
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Site address</label>
            <input
              type="text"
              value={siteAddress}
              onChange={(e) => setSiteAddress(e.target.value)}
              placeholder="e.g. 45 Example Street, Nelson 7010"
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Brief description of the work or request…"
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create application"}
            </button>
            <Link
              href="/consents/tracker"
              className="text-sm text-gray-500 px-5 py-2.5 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
