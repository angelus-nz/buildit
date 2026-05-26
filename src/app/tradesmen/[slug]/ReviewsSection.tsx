"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

interface Review {
  id: string;
  rating: number;
  body: string | null;
  reply: string | null;
  replyAt: string | null;
  createdAt: string;
  authorId: string;
  author: {
    name: string | null;
    image: string | null;
  };
}

interface Props {
  readonly businessId: string;
  readonly businessUserId: string;
  readonly initialReviews: Review[];
  readonly avgRating: number | null;
}

function StarPicker({
  value,
  onChange,
}: {
  readonly value: number;
  readonly onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="text-2xl leading-none focus:outline-none"
          aria-label={`${star} star`}
        >
          <span className={(hovered || value) >= star ? "text-yellow-400" : "text-gray-300"}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

function StarDisplay({ rating }: { readonly rating: number }) {
  return (
    <span className="text-sm">
      <span className="text-yellow-400">{"★".repeat(rating)}</span>
      <span className="text-gray-300">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ReviewsSection({
  businessId,
  businessUserId,
  initialReviews,
  avgRating: initialAvg,
}: Props) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyError, setReplyError] = useState<Record<string, string>>({});

  const currentUserId = session?.user?.id ?? null;
  const isOwner = currentUserId === businessUserId;
  const alreadyReviewed = reviews.some((r) => r.authorId === currentUserId);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : initialAvg;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, rating, body: body.trim() || undefined }),
      });
      const json = await res.json();
      if (!res.ok) {
        setSubmitError(json.error ?? "Failed to submit review");
        return;
      }
      setReviews([json, ...reviews]);
      setBody("");
      setRating(5);
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(reviewId: string) {
    if (!confirm("Delete your review?")) return;
    const res = await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
    if (res.ok) {
      setReviews(reviews.filter((r) => r.id !== reviewId));
    }
  }

  async function handleReply(reviewId: string) {
    const text = replyText[reviewId]?.trim();
    if (!text) return;
    setReplyError((prev) => ({ ...prev, [reviewId]: "" }));
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: text }),
      });
      const json = await res.json();
      if (!res.ok) {
        setReplyError((prev) => ({ ...prev, [reviewId]: json.error ?? "Failed to post reply" }));
        return;
      }
      setReviews(reviews.map((r) =>
        r.id === reviewId ? { ...r, reply: json.reply as string, replyAt: json.replyAt as string } : r
      ));
      setReplyingTo(null);
      setReplyText((prev) => ({ ...prev, [reviewId]: "" }));
    } catch {
      setReplyError((prev) => ({ ...prev, [reviewId]: "Network error. Please try again." }));
    }
  }

  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Reviews</h2>
        {avgRating !== null && (
          <span className="text-sm text-gray-500">
            <span className="text-yellow-400">★</span> {avgRating.toFixed(1)} ({reviews.length}{" "}
            {reviews.length === 1 ? "review" : "reviews"})
          </span>
        )}
      </div>

      {session && !isOwner && !alreadyReviewed && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-200 p-5 mb-6 space-y-4"
        >
          <p className="text-sm font-medium text-gray-900">Leave a review</p>
          <StarPicker value={rating} onChange={setRating} />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            maxLength={2000}
            placeholder="Share your experience (optional)"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          {submitError && <p className="text-xs text-red-600">{submitError}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? "Submitting…" : "Submit review"}
          </button>
        </form>
      )}

      {!session && (
        <p className="text-sm text-gray-500 mb-6">
          <a href="/auth/signin" className="text-blue-600 hover:underline">Sign in</a> to leave a review.
        </p>
      )}

      {session && !isOwner && alreadyReviewed && (
        <p className="text-sm text-gray-500 mb-6">You have already reviewed this business.</p>
      )}

      {reviews.length === 0 && (
        <p className="text-sm text-gray-400">No reviews yet. Be the first!</p>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-sm flex-shrink-0">
                  {review.author.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={review.author.image}
                      alt={review.author.name ?? ""}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{review.author.name?.[0] ?? "?"}</span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {review.author.name ?? "Anonymous"}
                  </p>
                  <div className="flex items-center gap-2">
                    <StarDisplay rating={review.rating} />
                    <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                  </div>
                </div>
              </div>
              {currentUserId === review.authorId && (
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-xs text-red-500 hover:text-red-700 transition-colors"
                  aria-label="Delete review"
                >
                  Delete
                </button>
              )}
            </div>

            {review.body && (
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">{review.body}</p>
            )}

            {review.reply ? (
              <div className="mt-3 ml-4 pl-4 border-l-2 border-gray-100">
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  Owner replied{review.replyAt ? ` · ${formatDate(review.replyAt)}` : ""}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">{review.reply}</p>
              </div>
            ) : (
              isOwner && (
                <div className="mt-3 ml-4">
                  {replyingTo === review.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={replyText[review.id] ?? ""}
                        onChange={(e) =>
                          setReplyText((prev) => ({ ...prev, [review.id]: e.target.value }))
                        }
                        rows={2}
                        maxLength={2000}
                        placeholder="Write a public reply…"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                      {replyError[review.id] && (
                        <p className="text-xs text-red-600">{replyError[review.id]}</p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReply(review.id)}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                        >
                          Post reply
                        </button>
                        <button
                          onClick={() => setReplyingTo(null)}
                          className="rounded-lg px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setReplyingTo(review.id)}
                      className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Reply to this review
                    </button>
                  )}
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
