"use client";

import { useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";

interface UploadedPhoto {
  url: string;
  caption: string;
  preview: string;
}

export default function NewUpdatePage() {
  const router = useRouter();
  const { projectId } = useParams<{ projectId: string }>();

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    if (photos.length + files.length > 10) {
      setError("Maximum 10 photos per update");
      return;
    }

    setUploading(true);
    setError(null);

    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/uploads/project-photo", { method: "POST", body: fd });
      if (!res.ok) {
        setError("Failed to upload one or more photos");
        continue;
      }
      const { url } = await res.json();
      setPhotos((prev) => [
        ...prev,
        { url, caption: "", preview: URL.createObjectURL(file) },
      ]);
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  function updateCaption(index: number, caption: string) {
    setPhotos((prev) => prev.map((p, i) => (i === index ? { ...p, caption } : p)));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      body: form.get("body") as string,
      photoUrls: photos.map((p) => p.url),
      photoCaptions: photos.map((p) => p.caption),
    };

    const res = await fetch(`/api/projects/${projectId}/updates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error?.message ?? "Something went wrong");
      setPending(false);
      return;
    }

    router.push("/dashboard/projects");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <a href="/dashboard" className="text-lg font-semibold text-gray-900 hover:opacity-80">
          BuildIt
        </a>
        <a href="/dashboard/projects" className="text-sm text-gray-500 hover:text-gray-700">
          ← Projects
        </a>
      </header>

      <main className="max-w-xl mx-auto px-4 py-10">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Post update</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-200 p-6 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="body">
              What&apos;s new? <span className="text-red-500">*</span>
            </label>
            <textarea
              id="body"
              name="body"
              rows={5}
              required
              minLength={1}
              maxLength={5000}
              placeholder="Describe the progress, what was done, what comes next…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos{" "}
              <span className="text-gray-400 font-normal">(optional, up to 10)</span>
            </label>

            {photos.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-3">
                {photos.map((photo, i) => (
                  <div
                    key={photo.url}
                    className="relative rounded-lg overflow-hidden border border-gray-200"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.preview}
                      alt={`Upload ${i + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hover:bg-black/80"
                    >
                      ×
                    </button>
                    <input
                      type="text"
                      value={photo.caption}
                      onChange={(e) => updateCaption(i, e.target.value)}
                      placeholder="Caption…"
                      maxLength={200}
                      className="w-full border-t border-gray-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </div>
                ))}
              </div>
            )}

            {photos.length < 10 && (
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg py-6 cursor-pointer hover:border-blue-400 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  className="sr-only"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                <span className="text-sm text-gray-500">
                  {uploading ? "Uploading…" : "Click to add photos"}
                </span>
              </label>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={pending || uploading}
              className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {pending ? "Posting…" : "Post update"}
            </button>
            <a
              href="/dashboard/projects"
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </a>
          </div>
        </form>
      </main>
    </div>
  );
}
