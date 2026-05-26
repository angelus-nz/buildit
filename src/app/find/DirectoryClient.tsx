"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";

const CATEGORIES = [
  { label: "All trades", value: "" },
  { label: "Plumbing", value: "PLUMBING" },
  { label: "Electrical", value: "ELECTRICAL" },
  { label: "Carpentry", value: "CARPENTRY" },
  { label: "Painting", value: "PAINTING" },
  { label: "Roofing", value: "ROOFING" },
  { label: "Landscaping", value: "LANDSCAPING" },
  { label: "HVAC", value: "HVAC" },
  { label: "Masonry", value: "MASONRY" },
  { label: "Tiling", value: "TILING" },
  { label: "General", value: "GENERAL" },
  { label: "Other", value: "OTHER" },
] as const;

interface Business {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  category: string;
  suburb: string | null;
  city: string | null;
  logoUrl: string | null;
  isVerified: boolean;
  reviewCount: number;
  projectCount: number;
  avgRating: number | null;
}

interface Props {
  initialBusinesses: Business[];
  initialTotal: number;
  initialPages: number;
  initialPage: number;
}

function StarRating({ rating }: { readonly rating: number }) {
  return (
    <span className="text-amber-400">
      {"★".repeat(Math.round(rating))}
      {"☆".repeat(5 - Math.round(rating))}
    </span>
  );
}

function BusinessCard({ business }: { readonly business: Business }) {
  const location = [business.suburb, business.city].filter(Boolean).join(", ");
  return (
    <Link
      href={`/tradesmen/${business.slug}`}
      className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 transition hover:border-amber-400 hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        {business.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={business.logoUrl}
            alt={business.name}
            className="h-14 w-14 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 text-2xl font-bold text-slate-400">
            {business.name[0]}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold text-slate-900">
              {business.name}
            </h3>
            {business.isVerified && (
              <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                Verified
              </span>
            )}
          </div>
          <p className="text-sm capitalize text-slate-500">
            {business.category.toLowerCase().replace("_", " ")}
            {location && ` · ${location}`}
          </p>
        </div>
      </div>

      {business.bio && (
        <p className="line-clamp-2 text-sm text-slate-600">{business.bio}</p>
      )}

      <div className="flex items-center gap-4 text-sm text-slate-500">
        {business.avgRating !== null && (
          <span className="flex items-center gap-1">
            <StarRating rating={business.avgRating} />
            <span>
              {business.avgRating.toFixed(1)} ({business.reviewCount})
            </span>
          </span>
        )}
        {business.projectCount > 0 && (
          <span>{business.projectCount} projects</span>
        )}
      </div>
    </Link>
  );
}

export default function DirectoryClient({
  initialBusinesses,
  initialTotal,
  initialPages,
  initialPage,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [location, setLocation] = useState(searchParams.get("location") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");

  function applyFilters(newParams: {
    location?: string;
    category?: string;
    page?: number;
  }) {
    const params = new URLSearchParams();
    const loc = newParams.location ?? location;
    const cat = newParams.category ?? category;
    if (loc) params.set("location", loc);
    if (cat) params.set("category", cat);
    if (newParams.page && newParams.page > 1)
      params.set("page", String(newParams.page));
    startTransition(() => {
      router.push(`/find?${params.toString()}`);
    });
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    applyFilters({ page: 1 });
  }

  return (
    <div>
      {/* Filters */}
      <form
        onSubmit={handleSearch}
        className="mb-8 flex flex-col gap-3 sm:flex-row"
      >
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Suburb or city"
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-amber-400 focus:outline-none"
        />
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            applyFilters({ category: e.target.value, page: 1 });
          }}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-amber-400 focus:outline-none"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-amber-500 px-6 py-2.5 font-semibold text-white hover:bg-amber-600"
        >
          Search
        </button>
      </form>

      {/* Results count */}
      <p className="mb-4 text-sm text-slate-500">
        {initialTotal === 0
          ? "No tradesmen found"
          : `${initialTotal} tradesman${initialTotal !== 1 ? "s" : ""} found`}
      </p>

      {/* Results grid */}
      {initialBusinesses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {initialBusinesses.map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>

          {/* Pagination */}
          {initialPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: initialPages }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => applyFilters({ page: p })}
                    className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                      p === initialPage
                        ? "bg-amber-500 text-white"
                        : "border border-slate-300 text-slate-600 hover:border-amber-400"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
            </div>
          )}
        </>
      ) : (
        <div className="py-16 text-center text-slate-500">
          <p className="mb-2 text-lg">No tradesmen match your search.</p>
          <p className="text-sm">Try a different location or trade category.</p>
        </div>
      )}
    </div>
  );
}
