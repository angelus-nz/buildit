import Link from "next/link";
import type { Metadata } from "next";
import councilsData from "@/data/councils.json";

export const metadata: Metadata = {
  title: "Application Guides & Templates — Council Consents — BuildIt",
  description:
    "Step-by-step application guides for building consents, resource consents, LIM reports, and certificates of acceptance in Nelson and Tasman.",
};

interface SearchParams {
  type?: string;
}

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { type: activeTypeId } = await searchParams;
  const { templates, councils } = councilsData;

  const activeTemplate = activeTypeId
    ? (templates.find((t) => t.id === `${activeTypeId}-application`) ?? templates[0])
    : templates[0];

  const councilLinks = councils.flatMap((council) =>
    council.consentTypes
      .filter((ct) => ct.templateId === activeTemplate?.id)
      .flatMap((ct) => ct.usefulLinks.map((link) => ({ ...link, council: council.shortName }))),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-gray-900">
            BuildIt
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/consents" className="text-gray-600 hover:text-gray-900">
              Consent types
            </Link>
            <Link href="/consents/tracker" className="text-blue-600 font-medium hover:underline">
              My Applications
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href="/consents" className="hover:underline">Council Consents</Link>
          <span>/</span>
          <span>Application Guides</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Guides</h1>
        <p className="text-gray-600 mb-8">
          Use these guides to prepare your documents before lodging with Nelson or Tasman council.
          Select a consent type to see the full checklist and required information.
        </p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-56 shrink-0">
            <nav className="space-y-1">
              {templates.map((tpl) => {
                const typeId = tpl.id.replace("-application", "");
                const isActive = activeTemplate?.id === tpl.id;
                return (
                  <Link
                    key={tpl.id}
                    href={`/consents/templates?type=${typeId}`}
                    className={`block text-sm px-3 py-2 rounded-lg transition ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {tpl.name.replace(" Guide", "").replace(" Application", "")}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Content */}
          {activeTemplate && (
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  {activeTemplate.name}
                </h2>
                <p className="text-sm text-gray-500 mb-6">{activeTemplate.description}</p>

                {activeTemplate.sections.map((section) => (
                  <div key={section.title} className="mb-5 last:mb-0">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 border-b border-gray-100 pb-1">
                      {section.title}
                    </h3>
                    <ul className="space-y-1.5">
                      {section.fields.map((field) => (
                        <li key={field} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="mt-0.5 w-4 h-4 shrink-0 rounded border border-gray-300 inline-flex" />
                          {field}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5">
                <p className="text-sm text-blue-800 font-medium mb-1">
                  Save this guide as a PDF
                </p>
                <p className="text-xs text-blue-600">
                  Press Ctrl+P (Windows) or Cmd+P (Mac) and choose &ldquo;Save as PDF&rdquo; to
                  download a printable copy of this application guide.
                </p>
              </div>

              {councilLinks.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Official council forms &amp; information
                  </h3>
                  <ul className="space-y-2">
                    {councilLinks.map((link, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-xs font-medium bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          {link.council}
                        </span>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
