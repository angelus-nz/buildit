import Link from "next/link";
import type { Metadata } from "next";
import councilsData from "@/data/councils.json";

export const metadata: Metadata = {
  title: "Council Consents — BuildIt",
  description:
    "Navigate NZ council consent processes in Nelson and Tasman. Understand consent types, fees, and required documents.",
};

const TYPE_BADGE: Record<string, string> = {
  "building-consent": "bg-blue-100 text-blue-800",
  "resource-consent": "bg-green-100 text-green-800",
  "lim-report": "bg-yellow-100 text-yellow-800",
  "certificate-of-acceptance": "bg-purple-100 text-purple-800",
};

export default function ConsentsPage() {
  const { councils } = councilsData;

  const uniqueConsentTypes = Array.from(
    new Map(
      councils.flatMap((c) => c.consentTypes).map((t) => [t.id, t]),
    ).values(),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-gray-900">
            BuildIt
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/consents/tracker" className="text-blue-600 font-medium hover:underline">
              My Applications
            </Link>
            <Link href="/consents/templates" className="text-gray-600 hover:text-gray-900">
              Templates
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Breadcrumb + hero */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span>Council Consents</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            NZ Council Consent Helper
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Navigate the council consent process in Nelson and Tasman. Understand which consent
            you need, what it costs, and what documents to prepare — then track your application
            through to approval.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/consents/tracker/new"
              className="inline-block bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition"
            >
              Track a new application
            </Link>
            <Link
              href="/consents/templates"
              className="inline-block bg-white border border-gray-300 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-50 transition"
            >
              View application guides
            </Link>
          </div>
        </div>

        {/* Consent type directory */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold text-gray-900 mb-5">Common consent types</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {uniqueConsentTypes.map((type) => (
              <div
                key={type.id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug">{type.name}</h3>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
                      TYPE_BADGE[type.id] ?? "bg-gray-100 text-gray-600"
                    }`}
                  >
                    ≤ 20 days
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">{type.description}</p>
                <p className="text-xs text-gray-500 mb-3">
                  <span className="font-medium text-gray-700">Who needs it: </span>
                  {type.whoNeedsIt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded">
                    {type.feeEstimate}
                  </span>
                  <Link
                    href={`/consents/templates?type=${type.id}`}
                    className="text-xs text-blue-600 font-medium hover:underline"
                  >
                    Application guide →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Fee comparison table */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold text-gray-900 mb-5">Fee comparison by council</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Consent type</th>
                  {councils.map((c) => (
                    <th key={c.id} className="text-left py-3 px-4 font-semibold text-gray-700">
                      {c.shortName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {uniqueConsentTypes.map((type, i) => (
                  <tr
                    key={type.id}
                    className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                  >
                    <td className="py-3 px-4 font-medium text-gray-900">{type.name}</td>
                    {councils.map((council) => {
                      const ct = council.consentTypes.find((t) => t.id === type.id);
                      return (
                        <td key={council.id} className="py-3 px-4 text-gray-600">
                          {ct?.feeEstimate ?? "—"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Fees are indicative. Always confirm the current schedule with your council before applying.
          </p>
        </section>

        {/* Council contacts */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-5">Council contacts</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {councils.map((council) => (
              <div key={council.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-3">{council.name}</h3>
                <dl className="space-y-1.5 text-sm text-gray-600">
                  <div className="flex gap-2">
                    <dt className="font-medium text-gray-700 w-20 shrink-0">Phone</dt>
                    <dd>
                      <a href={`tel:${council.phone}`} className="hover:text-blue-600">
                        {council.phone}
                      </a>
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-medium text-gray-700 w-20 shrink-0">Email</dt>
                    <dd>
                      <a href={`mailto:${council.email}`} className="hover:text-blue-600">
                        {council.email}
                      </a>
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-medium text-gray-700 w-20 shrink-0">Address</dt>
                    <dd>{council.address}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-medium text-gray-700 w-20 shrink-0">Hours</dt>
                    <dd>{council.buildingOfficeHours}</dd>
                  </div>
                </dl>
                <div className="mt-4 flex gap-3">
                  <a
                    href={council.consentPage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-blue-600 hover:underline"
                  >
                    Consents page →
                  </a>
                  <a
                    href={council.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-500 hover:underline"
                  >
                    Council website
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
