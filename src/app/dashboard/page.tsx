"use client";

import { FormEvent, useState } from "react";

type JobStatus = "On track" | "Needs decision" | "Blocked";
type Visibility = "Client-visible" | "Internal only";

interface TimelineItem {
  time: string;
  title: string;
  body: string;
  visibility: Visibility;
}

interface Job {
  id: string;
  title: string;
  client: string;
  site: string;
  trade: string;
  status: JobStatus;
  nextAction: string;
  due: string;
  clientUpdates: number;
  partsWaiting: number;
  timeline: TimelineItem[];
}

const jobs: Job[] = [
  {
    id: "kowhai-deck",
    title: "Kowhai Street deck rebuild",
    client: "Maya Rangi",
    site: "18 Kowhai Street",
    trade: "Carpentry",
    status: "Needs decision",
    nextAction: "Approve spotted gum upgrade before the supplier cut-off.",
    due: "Today 3:00pm",
    clientUpdates: 2,
    partsWaiting: 1,
    timeline: [
      { time: "07:35", title: "Old joists removed", body: "Crew cleared rot and photographed bearer condition for the client record.", visibility: "Client-visible" },
      { time: "10:10", title: "Material choice pending", body: "Supplier has spotted gum in stock; treated pine ETA slips two working days.", visibility: "Internal only" },
      { time: "12:45", title: "Site left safe", body: "Temporary rail and weather cover installed before lunch break.", visibility: "Client-visible" },
    ],
  },
  {
    id: "harbour-bath",
    title: "Harbour Road bathroom rough-in",
    client: "Aroha & Ben Lee",
    site: "42 Harbour Road",
    trade: "Plumbing",
    status: "On track",
    nextAction: "Upload wall cavity photos after the pressure test.",
    due: "Today 5:00pm",
    clientUpdates: 1,
    partsWaiting: 0,
    timeline: [
      { time: "08:20", title: "Pressure test passed", body: "Hot and cold feeds held pressure for 30 minutes.", visibility: "Client-visible" },
      { time: "09:50", title: "Inspector window booked", body: "Council inspection requested for tomorrow morning.", visibility: "Internal only" },
    ],
  },
  {
    id: "elm-switchboard",
    title: "Elm Lane switchboard upgrade",
    client: "Tui Bakery",
    site: "7 Elm Lane",
    trade: "Electrical",
    status: "Blocked",
    nextAction: "Waiting for network isolation confirmation.",
    due: "Tomorrow 8:30am",
    clientUpdates: 0,
    partsWaiting: 2,
    timeline: [
      { time: "06:55", title: "Van loaded", body: "Board, breakers, conduit, and labels checked off.", visibility: "Internal only" },
      { time: "11:30", title: "Network hold", body: "Lines company pushed isolation response to tomorrow.", visibility: "Client-visible" },
    ],
  },
];

const statusStyles: Record<JobStatus, string> = {
  "On track": "border-emerald-700 bg-emerald-50 text-emerald-950 dark:border-emerald-300 dark:bg-emerald-950 dark:text-emerald-100",
  "Needs decision": "border-amber-700 bg-amber-100 text-amber-950 dark:border-amber-300 dark:bg-amber-950 dark:text-amber-100",
  Blocked: "border-red-700 bg-red-50 text-red-950 dark:border-red-300 dark:bg-red-950 dark:text-red-100",
};

function StatusChip({ status }: { status: JobStatus }) {
  return (
    <span className={`inline-flex min-h-8 items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${statusStyles[status]}`}>
      Status: {status}
    </span>
  );
}

function MetricCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <article className="rounded-[var(--radius-3xl)] border border-[var(--workshop-line)] bg-[var(--workshop-card)] p-5 shadow-[var(--workshop-shadow)]">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--workshop-rust)]">{label}</p>
      <strong className="mt-3 block text-4xl font-black leading-none text-[var(--workshop-ink)] dark:text-white">{value}</strong>
      <span className="mt-2 block text-sm text-slate-600 dark:text-slate-300">{note}</span>
    </article>
  );
}

function JobCard({ job, selected, onSelect }: { job: Job; selected: boolean; onSelect: () => void }) {
  return (
    <article className={`rounded-[var(--radius-3xl)] border bg-white/85 p-5 shadow-sm transition dark:bg-slate-900/80 ${selected ? "border-[var(--workshop-hi-vis)] ring-4 ring-amber-300/30" : "border-[var(--workshop-line)]"}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-black text-[var(--workshop-ink)] dark:text-white">{job.title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">{job.client} · {job.trade}</p>
        </div>
        <StatusChip status={job.status} />
      </div>
      <p className="mt-4 text-sm text-slate-700 dark:text-slate-200">{job.nextAction}</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Due: {job.due}</span>
        <button type="button" onClick={onSelect} className="min-h-12 rounded-full bg-[var(--workshop-ink)] px-5 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[var(--workshop-focus)] dark:bg-amber-400 dark:text-slate-950">
          View job
        </button>
      </div>
    </article>
  );
}

function TimelineEntry({ entry }: { entry: TimelineItem }) {
  return (
    <li className="rounded-2xl border border-dashed border-[var(--workshop-line)] bg-white/70 p-4 dark:bg-slate-900/70">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 className="font-black text-[var(--workshop-ink)] dark:text-white">{entry.title}</h4>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{entry.body}</p>
        </div>
        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{entry.time} · {entry.visibility}</span>
      </div>
    </li>
  );
}

function ActionQueue({ jobs }: { jobs: Job[] }) {
  return (
    <aside className="rounded-[var(--radius-3xl)] border border-[var(--workshop-line)] bg-[var(--workshop-card)] p-5 shadow-[var(--workshop-shadow)]">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--workshop-rust)]">ActionQueue</p>
      <h2 className="mt-1 text-2xl font-black text-[var(--workshop-ink)] dark:text-white">Today</h2>
      <ol className="mt-4 grid gap-3">
        {jobs.map((job) => (
          <li key={job.id} className="rounded-2xl border border-[var(--workshop-line)] bg-white/70 p-4 dark:bg-slate-900/70">
            <strong className="text-sm text-[var(--workshop-ink)] dark:text-white">{job.client}</strong>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{job.nextAction}</p>
          </li>
        ))}
      </ol>
    </aside>
  );
}

function MediaUploader() {
  return (
    <div className="rounded-3xl border-2 border-dashed border-amber-700/50 bg-[repeating-linear-gradient(135deg,rgba(245,158,11,0.18)_0_8px,rgba(255,255,255,0.8)_8px_18px)] p-4 dark:bg-none dark:bg-amber-950/30">
      <strong className="block text-sm text-[var(--workshop-ink)] dark:text-white">MediaUploader</strong>
      <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">Drag photos here or attach from the van camera roll.</p>
      <button type="button" className="mt-3 min-h-12 rounded-full border border-[var(--workshop-line)] bg-white px-4 text-sm font-black text-[var(--workshop-ink)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[var(--workshop-focus)] dark:bg-slate-900 dark:text-white">
        Choose files
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <section id="parts" className="rounded-[var(--radius-3xl)] border border-[var(--workshop-line)] bg-[var(--workshop-card)] p-5 shadow-[var(--workshop-shadow)]">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--workshop-rust)]">Parts</p>
      <h2 className="mt-1 text-2xl font-black text-[var(--workshop-ink)] dark:text-white">EmptyState: no urgent part requests</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">When a job blocks on stock, supplier ETA and owner appear here.</p>
    </section>
  );
}

function ReviewBanner() {
  return (
    <aside className="rounded-[var(--radius-3xl)] bg-[var(--workshop-ink)] p-5 text-white shadow-[var(--workshop-shadow)]">
      <strong className="text-lg text-[var(--workshop-hi-vis)]">ReviewBanner</strong>
      <p className="mt-2 text-sm text-amber-50">3 client-visible updates are ready to review before publishing.</p>
    </aside>
  );
}

export default function DashboardPage() {
  const [selectedJobId, setSelectedJobId] = useState(jobs[0].id);
  const [summary, setSummary] = useState("");
  const [visibility, setVisibility] = useState<"client-visible" | "internal-only">("client-visible");
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? jobs[0];
  const clientVisibleUpdates = jobs.reduce((total, job) => total + job.clientUpdates, 0);
  const partsWaiting = jobs.reduce((total, job) => total + job.partsWaiting, 0);

  function submitProgressUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = summary.trim();
    if (trimmed.length < 20) {
      setError("Write at least 20 characters so the update is useful to the workshop and client.");
      setResult("");
      return;
    }

    setError("");
    setResult(`Progress update added as ${visibility === "client-visible" ? "client-visible pending review" : "internal only"}.`);
    setSummary("");
  }

  return (
    <div className="min-h-screen bg-[var(--workshop-paper)] px-4 py-5 text-[var(--workshop-ink)] dark:bg-slate-950 dark:text-slate-50 sm:px-6 lg:px-8">
      <header className="rounded-[2rem] border border-[var(--workshop-line)] bg-[var(--workshop-card)] p-5 shadow-[var(--workshop-shadow)] lg:p-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_22rem] lg:items-stretch">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--workshop-rust)]">BuildIt tradesman platform</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black leading-[0.95] tracking-tight sm:text-6xl">Workshop Pulse</h1>
            <p className="mt-4 max-w-2xl text-base text-slate-700 dark:text-slate-200">Know which jobs need hands, parts, or client visibility before the first van leaves.</p>
          </div>
          <ReviewBanner />
        </div>
      </header>

      <section aria-label="Workshop metrics" className="mt-5 grid gap-4 md:grid-cols-3">
        <MetricCard label="Active Jobs" value={jobs.length.toString()} note="2 need action today" />
        <MetricCard label="Client Updates" value={clientVisibleUpdates.toString()} note="visibility state tracked" />
        <MetricCard label="Parts Waiting" value={partsWaiting.toString()} note="supplier ETA attached" />
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_22rem]">
        <section id="jobs" className="rounded-[var(--radius-3xl)] border border-[var(--workshop-line)] bg-[var(--workshop-card)] p-5 shadow-[var(--workshop-shadow)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--workshop-rust)]">JobCard</p>
              <h2 className="text-3xl font-black text-[var(--workshop-ink)] dark:text-white">Jobs</h2>
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300" role="status">{jobs.length} synthetic jobs loaded.</p>
          </div>
          <div className="mt-4 grid gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} selected={job.id === selectedJobId} onSelect={() => setSelectedJobId(job.id)} />
            ))}
          </div>
        </section>

        <ActionQueue jobs={jobs} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_26rem]">
        <section className="rounded-[var(--radius-3xl)] border border-[var(--workshop-line)] bg-[var(--workshop-card)] p-5 shadow-[var(--workshop-shadow)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--workshop-rust)]">Chronicle</p>
              <h2 className="text-3xl font-black text-[var(--workshop-ink)] dark:text-white">Job Detail</h2>
            </div>
            <StatusChip status={selectedJob.status} />
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {["Client", "Site", "Trade"].map((label) => (
              <div key={label} className="rounded-2xl bg-white/75 p-4 dark:bg-slate-900/75">
                <strong className="block text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{label}</strong>
                <span className="mt-1 block font-black">{label === "Client" ? selectedJob.client : label === "Site" ? selectedJob.site : selectedJob.trade}</span>
              </div>
            ))}
          </div>
          <h3 className="mt-6 text-xl font-black text-[var(--workshop-ink)] dark:text-white">Progress Timeline</h3>
          <ol className="mt-3 grid gap-3">
            {selectedJob.timeline.map((entry) => (
              <TimelineEntry key={`${entry.time}-${entry.title}`} entry={entry} />
            ))}
          </ol>
        </section>

        <aside className="rounded-[var(--radius-3xl)] border border-[var(--workshop-line)] bg-[var(--workshop-card)] p-5 shadow-[var(--workshop-shadow)]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--workshop-rust)]">Add Progress Update</p>
          <h2 className="mt-1 text-2xl font-black text-[var(--workshop-ink)] dark:text-white">Log the next workshop note</h2>
          <form className="mt-5 grid gap-4" noValidate onSubmit={submitProgressUpdate}>
            <label htmlFor="progress-summary" className="text-sm font-black text-[var(--workshop-ink)] dark:text-white">Plain-language update</label>
            <textarea id="progress-summary" value={summary} onChange={(event) => setSummary(event.target.value)} rows={5} required placeholder="Example: Framing passed inspection and roof trusses are staged for Friday." className="min-h-36 rounded-3xl border border-[var(--workshop-line)] bg-white p-4 text-sm text-[var(--workshop-ink)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[var(--workshop-focus)] dark:bg-slate-900 dark:text-white" />
            {error ? <p className="text-sm font-bold text-red-800 dark:text-red-200" role="alert">{error}</p> : null}

            <fieldset className="grid gap-2">
              <legend className="text-sm font-black text-[var(--workshop-ink)] dark:text-white">Client visibility</legend>
              <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-[var(--workshop-line)] bg-white/80 px-4 text-sm font-semibold dark:bg-slate-900/80">
                <input type="radio" name="visibility" value="client-visible" checked={visibility === "client-visible"} onChange={() => setVisibility("client-visible")} className="h-5 w-5" />
                Client-visible: publish after review
              </label>
              <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-[var(--workshop-line)] bg-white/80 px-4 text-sm font-semibold dark:bg-slate-900/80">
                <input type="radio" name="visibility" value="internal-only" checked={visibility === "internal-only"} onChange={() => setVisibility("internal-only")} className="h-5 w-5" />
                Internal only: workshop note
              </label>
            </fieldset>

            <MediaUploader />

            <button type="submit" className="min-h-12 rounded-full bg-[var(--workshop-sage)] px-5 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[var(--workshop-focus)]">
              Add progress update
            </button>
            <p className="min-h-5 text-sm font-bold text-emerald-800 dark:text-emerald-200" role="status" aria-live="polite">{result}</p>
          </form>
        </aside>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section id="clients" className="rounded-[var(--radius-3xl)] border border-[var(--workshop-line)] bg-[var(--workshop-card)] p-5 shadow-[var(--workshop-shadow)]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--workshop-rust)]">Clients</p>
          <h2 className="mt-1 text-2xl font-black text-[var(--workshop-ink)] dark:text-white">Client visibility queue</h2>
          <div className="mt-4 grid gap-3">
            {jobs.map((job) => (
              <article key={job.id} className="flex flex-col gap-1 rounded-2xl bg-white/75 p-4 dark:bg-slate-900/75 sm:flex-row sm:items-center sm:justify-between">
                <strong>{job.client}</strong>
                <span className="text-sm text-slate-600 dark:text-slate-300">{job.clientUpdates} visible update(s) · {job.due}</span>
              </article>
            ))}
          </div>
        </section>
        <EmptyState />
      </div>

      <section id="reports" className="mt-5 rounded-[var(--radius-3xl)] border border-[var(--workshop-line)] bg-[var(--workshop-card)] p-5 shadow-[var(--workshop-shadow)]">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--workshop-rust)]">Reports</p>
        <h2 className="mt-1 text-2xl font-black text-[var(--workshop-ink)] dark:text-white">Workshop confidence report</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Loading is represented by synthetic fixtures, empty parts state is renderable, form errors are inline, and reduced-motion mode disables non-essential animation.</p>
      </section>
    </div>
  );
}
