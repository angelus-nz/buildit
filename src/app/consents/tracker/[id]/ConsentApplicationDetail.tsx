"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ConsentStatus = "DRAFT" | "SUBMITTED" | "PROCESSING" | "APPROVED" | "DECLINED";

interface CorrespondenceLog {
  id: string;
  date: string;
  summary: string;
  createdAt: string;
}

interface Application {
  id: string;
  title: string;
  councilId: string;
  consentTypeId: string;
  status: ConsentStatus;
  description: string | null;
  siteAddress: string | null;
  referenceNumber: string | null;
  notes: string | null;
  submittedAt: string | null;
  decidedAt: string | null;
  createdAt: string;
  updatedAt: string;
  correspondenceLogs: CorrespondenceLog[];
}

interface Props {
  readonly application: Application;
  readonly councilName: string;
  readonly councilConsentPage?: string;
  readonly consentTypeName: string;
  readonly consentTypeTemplateId?: string;
}

const STATUS_OPTIONS: ReadonlyArray<{ value: ConsentStatus; label: string; className: string }> = [
  { value: "DRAFT", label: "Draft", className: "bg-gray-100 text-gray-600" },
  { value: "SUBMITTED", label: "Submitted", className: "bg-blue-100 text-blue-700" },
  { value: "PROCESSING", label: "Processing", className: "bg-yellow-100 text-yellow-700" },
  { value: "APPROVED", label: "Approved", className: "bg-green-100 text-green-700" },
  { value: "DECLINED", label: "Declined", className: "bg-red-100 text-red-700" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ConsentApplicationDetail({
  application: initial,
  councilName,
  councilConsentPage,
  consentTypeName,
  consentTypeTemplateId,
}: Props) {
  const router = useRouter();
  const [app, setApp] = useState(initial);
  const [editingStatus, setEditingStatus] = useState(false);
  const [editingDetails, setEditingDetails] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);

  const [draftStatus, setDraftStatus] = useState<ConsentStatus>(initial.status);
  const [draftRef, setDraftRef] = useState(initial.referenceNumber ?? "");
  const [draftNotes, setDraftNotes] = useState(initial.notes ?? "");

  const [logDate, setLogDate] = useState("");
  const [logSummary, setLogSummary] = useState("");
  const [addingLog, setAddingLog] = useState(false);
  const [logError, setLogError] = useState("");

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === app.status) ?? STATUS_OPTIONS[0];

  async function saveStatus() {
    setSavingStatus(true);
    try {
      const res = await fetch(`/api/consents/applications/${app.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: draftStatus }),
      });
      const data = (await res.json()) as { application?: Application };
      if (data.application) {
        setApp((prev) => ({ ...prev, status: data.application!.status }));
        setEditingStatus(false);
      }
    } finally {
      setSavingStatus(false);
    }
  }

  async function saveDetails() {
    setSavingDetails(true);
    try {
      const res = await fetch(`/api/consents/applications/${app.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referenceNumber: draftRef, notes: draftNotes }),
      });
      const data = (await res.json()) as { application?: Application };
      if (data.application) {
        setApp((prev) => ({
          ...prev,
          referenceNumber: data.application!.referenceNumber,
          notes: data.application!.notes,
        }));
        setEditingDetails(false);
      }
    } finally {
      setSavingDetails(false);
    }
  }

  async function addLog(e: React.FormEvent) {
    e.preventDefault();
    setLogError("");
    setAddingLog(true);
    try {
      const res = await fetch(`/api/consents/applications/${app.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add_log", date: logDate, summary: logSummary }),
      });
      const data = (await res.json()) as { log?: CorrespondenceLog; error?: string };
      if (!res.ok) {
        setLogError(data.error ?? "Failed to add log entry");
        return;
      }
      if (data.log) {
        setApp((prev) => ({
          ...prev,
          correspondenceLogs: [data.log!, ...prev.correspondenceLogs],
        }));
        setLogDate("");
        setLogSummary("");
      }
    } catch {
      setLogError("Network error — please try again");
    } finally {
      setAddingLog(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left: main info */}
      <div className="lg:col-span-2 space-y-5">
        {/* Header card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{app.title}</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {councilName} · {consentTypeName}
              </p>
              {app.siteAddress && (
                <p className="text-xs text-gray-400 mt-0.5">{app.siteAddress}</p>
              )}
            </div>

            {editingStatus ? (
              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={draftStatus}
                  onChange={(e) => setDraftStatus(e.target.value as ConsentStatus)}
                  className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <button
                  onClick={saveStatus}
                  disabled={savingStatus}
                  className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {savingStatus ? "Saving…" : "Save"}
                </button>
                <button
                  onClick={() => setEditingStatus(false)}
                  className="text-xs text-gray-500 px-2 py-1.5 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingStatus(true)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full ${currentStatus.className} hover:opacity-80 transition`}
              >
                {currentStatus.label} ▾
              </button>
            )}
          </div>

          {app.description && (
            <p className="text-sm text-gray-600 mt-3">{app.description}</p>
          )}
        </div>

        {/* Details card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700">Application details</h2>
            {!editingDetails ? (
              <button onClick={() => setEditingDetails(true)} className="text-xs text-blue-600 hover:underline">
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={saveDetails}
                  disabled={savingDetails}
                  className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {savingDetails ? "Saving…" : "Save"}
                </button>
                <button onClick={() => setEditingDetails(false)} className="text-xs text-gray-500 hover:text-gray-700">
                  Cancel
                </button>
              </div>
            )}
          </div>

          {editingDetails ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Council reference number
                </label>
                <input
                  type="text"
                  value={draftRef}
                  onChange={(e) => setDraftRef(e.target.value)}
                  placeholder="e.g. BC-2026-01234"
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
                <textarea
                  value={draftNotes}
                  onChange={(e) => setDraftNotes(e.target.value)}
                  rows={4}
                  placeholder="Internal notes about this application…"
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          ) : (
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs font-medium text-gray-500">Council reference</dt>
                <dd className="mt-0.5 font-mono text-gray-900">
                  {app.referenceNumber ?? (
                    <span className="font-sans text-gray-400">Not yet assigned</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">Notes</dt>
                <dd className="mt-0.5 text-gray-700 whitespace-pre-wrap">
                  {app.notes ?? <span className="text-gray-400">No notes</span>}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500">Created</dt>
                <dd className="mt-0.5 text-gray-700">{formatDate(app.createdAt)}</dd>
              </div>
            </dl>
          )}
        </div>

        {/* Correspondence log */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Correspondence log</h2>

          <form onSubmit={addLog} className="mb-5 border border-gray-200 rounded-lg p-4 bg-gray-50">
            <p className="text-xs font-medium text-gray-600 mb-3">Add correspondence entry</p>
            {logError && <p className="text-xs text-red-600 mb-2">{logError}</p>}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Date</label>
                <input
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  required
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Summary</label>
                <input
                  type="text"
                  value={logSummary}
                  onChange={(e) => setLogSummary(e.target.value)}
                  required
                  placeholder="e.g. Submitted application online"
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={addingLog}
              className="mt-3 text-xs bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {addingLog ? "Adding…" : "Add entry"}
            </button>
          </form>

          {app.correspondenceLogs.length === 0 ? (
            <p className="text-sm text-gray-400">No correspondence logged yet.</p>
          ) : (
            <ol className="relative border-l border-gray-200 ml-2 space-y-4">
              {app.correspondenceLogs.map((log) => (
                <li key={log.id} className="ml-4">
                  <span className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-blue-200 border border-white" />
                  <p className="text-xs font-medium text-gray-500">{formatDate(log.date)}</p>
                  <p className="text-sm text-gray-800 mt-0.5">{log.summary}</p>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      {/* Right sidebar */}
      <div className="space-y-5">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Status timeline</h2>
          <ol className="space-y-2">
            {STATUS_OPTIONS.map((s) => {
              const statusOrder = STATUS_OPTIONS.map((x) => x.value);
              const currentIdx = statusOrder.indexOf(app.status);
              const thisIdx = statusOrder.indexOf(s.value);
              const isPast = thisIdx < currentIdx;
              const isCurrent = s.value === app.status;
              return (
                <li key={s.value} className="flex items-center gap-2.5 text-sm">
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      isCurrent ? "bg-blue-500" : isPast ? "bg-gray-300" : "bg-gray-200"
                    }`}
                  />
                  <span className={isCurrent ? "font-medium text-gray-900" : "text-gray-400"}>
                    {s.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Quick links</h2>
          <ul className="space-y-2 text-sm">
            {consentTypeTemplateId && (
              <li>
                <Link
                  href={`/consents/templates?type=${consentTypeTemplateId.replace("-application", "")}`}
                  className="text-blue-600 hover:underline"
                >
                  Application guide →
                </Link>
              </li>
            )}
            {councilConsentPage && (
              <li>
                <a
                  href={councilConsentPage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {councilName} consents page →
                </a>
              </li>
            )}
            <li>
              <Link href="/consents" className="text-gray-500 hover:text-gray-700">
                All consent types
              </Link>
            </li>
          </ul>
        </div>

        <button
          onClick={() => router.push("/consents/tracker")}
          className="w-full text-sm text-gray-500 border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition"
        >
          ← Back to all applications
        </button>
      </div>
    </div>
  );
}
