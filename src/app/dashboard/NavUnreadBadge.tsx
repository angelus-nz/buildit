"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Polls unread message count every 30s and shows a badge in the nav.
export function NavUnreadBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchCount() {
      const res = await fetch("/api/messages/unread-count").catch(() => null);
      if (!res?.ok || cancelled) return;
      const data = await res.json();
      setCount(data.count ?? 0);
    }

    fetchCount();
    const interval = setInterval(fetchCount, 30_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <Link
      href="/messages"
      className="relative inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
    >
      Messages
      {count > 0 && (
        <span className="absolute -top-1.5 -right-3 min-w-[1.1rem] h-[1.1rem] text-[10px] font-bold bg-blue-600 text-white rounded-full flex items-center justify-center px-0.5">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
