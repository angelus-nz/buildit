"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import councilsData from "@/data/councils.json";

type FormData = Record<string, string>;

interface Template {
  id: string;
  name: string;
  consentTypeId: string | null;
  formData: FormData;
}

interface TemplateSection {
  title: string;
  fields: string[];
}

function getTemplateSections(consentTypeId: string): TemplateSection[] {
  const templateId = councilsData.councils
    .flatMap((c) => c.consentTypes)
    .find((ct) => ct.id === consentTypeId)?.templateId;
  if (!templateId) return [];
  return councilsData.templates.find((t) => t.id === templateId)?.sections ?? [];
}

export default function NewConsentApplicationPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);

  const [councilId, setCouncilId] = useState("");
  const [consentTypeId, setConsentTypeId] = useState("");
  const [title, setTitle] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [formData, setFormData] = useState<FormData>({});

  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadTemplateId, setLoadTemplateId] = useState("");
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchTemplates = useCallback(async () => {
    try {
      const res = await fetch("/api/consents/templates");
      if (res.ok) {
        const data = (await res.json()) as { templates: Template[] };
        setTemplates(data.templates);
      }
    } catch {
      // non-fatal
    }
  }, []);

  useEffect(() => {
    void fetchTemplates();
  }, [fetchTemplates]);

  const selectedCouncil = councilsData.councils.find((c) => c.id === councilId);
  const availableTypes = selectedCouncil?.consentTypes ?? [];
  const consentTypeName =
    councilsData.councils.flatMap((c) => c.consentTypes).find((ct) => ct.id === consentTypeId)
      ?.name ?? "";
  const sections = getTemplateSections(consentTypeId);
  const relevantTemplates = templates.filter(
    (t) => t.consentTypeId === null || t.consentTypeId === consentTypeId,
  );

  function setField(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function applyTemplate() {
    const tpl = templates.find((t) => t.id === loadTemplateId);
    if (!tpl) return;
    setFormData((prev) => ({ ...prev, ...tpl.formData }));
    setLoadTemplateId("");
  }

  async function handleSubmit() {
    setError("");
    setSubmitting(true);

    try {
      if (saveAsTemplate && templateName.trim()) {
        await fetch("/api/consents/templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: templateName.trim(),
            consentTypeId: consentTypeId || null,
            formData,
          }),
        });
      }

      const res = await fetch("/api/consents/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ councilId, consentTypeId, title, siteAddress, formData }),
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
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-slate-900 dark:text-slate-50">BuildIt</Link>
          <Link href="/consents/tracker" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50">
            My Applications
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
          <Link href="/consents" className="hover:underline">Council Consents</Link>
          <span>/</span>
          <Link href="/consents/tracker" className="hover:underline">My Applications</Link>
          <span>/</span>
          <span>New</span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8">
          {([1, 2] as const).map((n) => (
            <div key={n} className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition ${
                  step === n
                    ? "bg-amber-500 text-white"
                    : step > n
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                }`}
              >
                {step > n ? "✓" : n}
              </span>
              <span className={`text-sm ${step === n ? "font-medium text-slate-900 dark:text-slate-50" : "text-slate-400 dark:text-slate-500"}`}>
                {n === 1 ? "Choose consent type" : "Fill in details"}
              </span>
              {n < 2 && <span className="text-slate-300 dark:text-slate-600 ml-1">→</span>}
            </div>
          ))}
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          {step === 1 ? "New consent application" : `${consentTypeName} application`}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
          {step === 1
            ? "Select the council and consent type to get started."
            : "Fill in the details below. Use a saved template to auto-fill common fields."}
        </p>

        {/* Step 1 */}
        {step === 1 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-5 shadow-sm">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Council <span className="text-red-500">*</span>
              </label>
              <select
                value={councilId}
                onChange={(e) => {
                  setCouncilId(e.target.value);
                  setConsentTypeId("");
                }}
                className="w-full text-sm border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select council…</option>
                {councilsData.councils.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Consent type <span className="text-red-500">*</span>
              </label>
              <select
                value={consentTypeId}
                onChange={(e) => setConsentTypeId(e.target.value)}
                disabled={!councilId}
                className="w-full text-sm border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
              >
                <option value="">Select consent type…</option>
                {availableTypes.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              {consentTypeId && selectedCouncil && (
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {selectedCouncil.consentTypes.find((t) => t.id === consentTypeId)?.feeEstimate}
                  {" — "}
                  {selectedCouncil.consentTypes.find((t) => t.id === consentTypeId)?.processingTime}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!councilId || !consentTypeId}
                className="bg-amber-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-amber-600 transition disabled:opacity-50"
              >
                Next: Fill in details →
              </button>
              <Link
                href="/consents/tracker"
                className="text-sm text-slate-500 dark:text-slate-400 px-5 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                Cancel
              </Link>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-5">
            {error && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {/* Template loader */}
            <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-50 mb-3">
                Load from a saved template
              </p>
              {relevantTemplates.length > 0 ? (
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={loadTemplateId}
                    onChange={(e) => setLoadTemplateId(e.target.value)}
                    className="flex-1 min-w-0 text-sm border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Select a template…</option>
                    {relevantTemplates.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={applyTemplate}
                    disabled={!loadTemplateId}
                    className="text-sm bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 disabled:opacity-50 transition whitespace-nowrap"
                  >
                    Apply template
                  </button>
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  No templates yet.{" "}
                  <Link href="/consents/templates/my" className="font-medium text-amber-600 dark:text-amber-400 underline">
                    Create one after this application
                  </Link>
                  {" "}to auto-fill next time.
                </p>
              )}
              <div className="mt-2 flex justify-end">
                <Link href="/consents/templates/my" className="text-xs text-amber-600 dark:text-amber-400 hover:underline">
                  Manage my templates →
                </Link>
              </div>
            </div>

            {/* Title */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700 pb-2">
                Application overview
              </h2>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Application title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. New dwelling — 45 Example Street"
                  className="w-full text-sm border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Site address</label>
                <input
                  type="text"
                  value={siteAddress}
                  onChange={(e) => setSiteAddress(e.target.value)}
                  placeholder="e.g. 45 Example Street, Nelson 7010"
                  className="w-full text-sm border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Template sections */}
            {sections.map((section) => (
              <div key={section.title} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <div className="bg-slate-50 dark:bg-slate-700 px-5 py-3 border-b border-slate-200 dark:border-slate-600">
                  <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{section.title}</h2>
                </div>
                <div className="p-5 grid gap-4 sm:grid-cols-2">
                  {section.fields.map((field) => (
                    <div key={field}>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{field}</label>
                      <input
                        type="text"
                        value={formData[field] ?? ""}
                        onChange={(e) => setField(field, e.target.value)}
                        placeholder={`Enter ${field.toLowerCase()}…`}
                        className="w-full text-sm border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Save as template */}
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900 rounded-xl p-4">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={saveAsTemplate}
                  onChange={(e) => setSaveAsTemplate(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-amber-500 accent-amber-500"
                />
                <span className="text-sm font-medium text-amber-900 dark:text-amber-300">
                  Save these details as a reusable template
                </span>
              </label>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 ml-6">
                Saves your filled-in details so you can auto-fill future applications in one click.
              </p>
              {saveAsTemplate && (
                <div className="mt-3 ml-6">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Template name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="e.g. My Building Consent Defaults"
                    className="w-full max-w-sm text-sm border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-slate-500 dark:text-slate-400 px-5 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-600"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !title}
                className="bg-amber-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-amber-600 transition disabled:opacity-50"
              >
                {submitting ? "Creating…" : "Create application"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
