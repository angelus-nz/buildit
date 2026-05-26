"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { type Business } from "@prisma/client";
import { CATEGORY_OPTIONS } from "@/lib/categories";

interface Props {
  business: Business;
}

export default function ProfileEditForm({ business }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    businessName: business.name,
    category: business.category as string,
    bio: business.bio ?? "",
    phone: business.phone ?? "",
    website: business.website ?? "",
    suburb: business.suburb ?? "",
    city: business.city ?? "",
    state: business.state ?? "",
    isPublished: business.isPublished,
  });

  const [logoUrl, setLogoUrl] = useState<string | null>(business.logoUrl);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/profile/photo", { method: "POST", body: formData });
    setUploading(false);

    if (!res.ok) {
      const data = await res.json();
      setUploadError(data.error ?? "Upload failed");
      return;
    }

    const data = await res.json();
    setLogoUrl(data.url);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaved(false);

    const res = await fetch("/api/profile", {
      method: "PUT",
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
        isPublished: form.isPublished,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setSaveError(data.error ?? "Save failed");
      return;
    }

    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Photo */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Profile photo</h3>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl text-gray-400">🔧</span>
            )}
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-sm border border-gray-300 text-gray-700 rounded-lg px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              {uploading ? "Uploading…" : "Change photo"}
            </button>
            <p className="text-xs text-gray-400 mt-1">JPEG, PNG, or WebP. Max 5 MB.</p>
            {uploadError && (
              <p className="text-xs text-red-600 mt-1">{uploadError}</p>
            )}
          </div>
        </div>
      </section>

      {/* Basics */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h3 className="text-base font-semibold text-gray-900">Business details</h3>

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
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Trade</label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORY_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => set("category", value)}
                className={`py-2 px-3 rounded-lg border-2 text-xs font-medium text-left transition-colors ${
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            rows={4}
            value={form.bio}
            onChange={(e) => set("bio", e.target.value)}
            maxLength={1000}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Tell customers about your business…"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{form.bio.length}/1000</p>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-base font-semibold text-gray-900">Contact & location</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => set("website", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://"
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
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Publish */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Publish profile</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {form.isPublished
                ? "Your profile is live and visible to customers."
                : "Your profile is hidden. Publish it to appear in search results."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => set("isPublished", !form.isPublished)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              form.isPublished ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                form.isPublished ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </section>

      {saveError && (
        <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 border border-red-200">
          {saveError}
        </div>
      )}

      {saved && (
        <div className="bg-green-50 text-green-700 text-sm rounded-lg px-4 py-3 border border-green-200">
          Profile saved.
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-blue-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
