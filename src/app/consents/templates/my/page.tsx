"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import councilsData from "@/data/councils.json";

type FormData = Record<string, string>;

interface Template {
  id: string;
  name: string;
  consentTypeId: string | null;
  formData: FormData;
  updatedAt: string;
}

const consentTypeNameMap = Object.fromEntries(
  councilsData.councils.flatMap((c) => c.consentTypes.map((t) => [t.id, t.name])),
);

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function TemplateCard({
  template,
  onDelete,
  onRename,
}: {
  template: Template;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(template.name);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);

  async function save() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/consents/templates/${template.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (res.ok) {
        onRename(template.id, name.trim());
        setEditing(false);
      }
    } finally {
      setSaving(false);
    }
  }

  const filledFields = Object.entries(template.formData).filter(([, v]) => v);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && void save()}
                  autoFocus
                  className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => void save()}
                  disabled={saving || !name.trim()}
                  className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "…" : "Save"}
                </button>
                <button
                  onClick={() => { setName(template.name); setEditing(false); }}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <h3 className="font-medium text-gray-900 truncate">{template.name}</h3>
            )}
            <p className="text-xs text-gray-400 mt-0.5">
              {template.consentTypeId
                ? (consentTypeNameMap[template.consentTypeId] ?? template.consentTypeId)
                : "All consent types"}
              {" · "}{filledFields.length} field{filledFields.length !== 1 ? "s" : ""} saved
              {" · "}Updated {formatDate(template.updatedAt)}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setEditing(true)}
              className="text-xs text-gray-400 hover:text-blue-600 px-2 py-1 rounded hover:bg-gray-50"
            >
              Rename
            </button>
            <button
              onClick={() => onDelete(template.id)}
              className="text-xs text-gray-400 hover:text-red-500 px-2 py-1 rounded hover:bg-gray-50"
            >
              Delete
            </button>
          </div>
        </div>

        {filledFields.length > 0 && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-3 text-xs text-blue-600 hover:underline"
          >
            {expanded ? "Hide fields ▲" : `Show ${filledFields.length} saved field${filledFields.length !== 1 ? "s" : ""} ▼`}
          </button>
        )}
      </div>

      {expanded && filledFields.length > 0 && (
        <div className="border-t border-gray-100 px-5 pb-5 pt-4">
          <dl className="grid gap-2 sm:grid-cols-2">
            {filledFields.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-gray-400">{k}</dt>
                <dd className="text-sm text-gray-700 truncate">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}

export default function MyTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/consents/templates");
      if (res.ok) {
        const data = (await res.json()) as { templates: Template[] };
        setTemplates(data.templates);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTemplates();
  }, [fetchTemplates]);

  async function confirmDelete(id: string) {
    const res = await fetch(`/api/consents/templates/${id}`, { method: "DELETE" });
    if (res.ok) setTemplates((prev) => prev.filter((t) => t.id !== id));
    setDeleteId(null);
  }

  function handleRename(id: string, newName: string) {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, name: newName } : t)));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-gray-900">BuildIt</Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/consents/tracker" className="text-gray-600 hover:text-gray-900">
              My Applications
            </Link>
            <Link href="/consents/tracker/new" className="text-blue-600 font-medium hover:underline">
              + New application
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/consents" className="hover:underline">Council Consents</Link>
          <span>/</span>
          <span>My Templates</span>
        </div>

        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">My application templates</h1>
            <p className="text-gray-500 text-sm max-w-xl">
              Templates store your common details so you can auto-fill future consent applications in one click.
              Create a template the next time you fill out an application.
            </p>
          </div>
          <Link
            href="/consents/tracker/new"
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-blue-700 transition whitespace-nowrap shrink-0"
          >
            + New application
          </Link>
        </div>

        {loading ? (
          <div className="text-sm text-gray-400 py-12 text-center">Loading…</div>
        ) : templates.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-sm mb-2">No templates saved yet.</p>
            <p className="text-gray-400 text-xs mb-6 max-w-sm mx-auto">
              When filling out a new application, tick &ldquo;Save these details as a reusable
              template&rdquo; to auto-fill next time.
            </p>
            <Link
              href="/consents/tracker/new"
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              Start a new application →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {templates.map((tpl) => (
              <TemplateCard
                key={tpl.id}
                template={tpl}
                onDelete={(id) => setDeleteId(id)}
                onRename={handleRename}
              />
            ))}
          </div>
        )}
      </main>

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl p-6 max-w-sm w-full">
            <h2 className="text-base font-semibold text-gray-900 mb-2">Delete template?</h2>
            <p className="text-sm text-gray-500 mb-6">
              This will permanently delete the template. Existing applications are unaffected.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => void confirmDelete(deleteId)}
                className="bg-red-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="text-sm text-gray-500 px-5 py-2.5 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
