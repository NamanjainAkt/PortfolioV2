import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { LeetCodeIcon } from './LeetCodeIcon';

type LeetCodeData = {
  totalSolved: number;
  totalQuestions: number;
  ranking: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
};

const API_BASE =
  (import.meta.env.VITE_LEETCODE_API_URL as string | undefined) ??
  'https://leetcode-api-faisalshohag.vercel.app';
const USERNAME = 'namanjainakt';
const PROFILE_URL = 'https://leetcode.com/u/namanjainakt/';
const CACHE_KEY = `leetcode:${USERNAME}`;
const CACHE_TTL = 6 * 60 * 60 * 1000;

const toNumber = (value: unknown) => (Number.isFinite(value) ? (value as number) : 0);

const normalize = (payload: Record<string, unknown>): LeetCodeData => ({
  totalSolved: toNumber(payload.totalSolved),
  totalQuestions: toNumber(payload.totalQuestions),
  ranking: toNumber(payload.ranking),
  easySolved: toNumber(payload.easySolved),
  totalEasy: toNumber(payload.totalEasy),
  mediumSolved: toNumber(payload.mediumSolved),
  totalMedium: toNumber(payload.totalMedium),
  hardSolved: toNumber(payload.hardSolved),
  totalHard: toNumber(payload.totalHard),
});

const LeetCodeStats = () => {
  const [data, setData] = useState<LeetCodeData | null>(null);
  const [failed, setFailed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as { savedAt: number; data: LeetCodeData };
          if (Date.now() - parsed.savedAt < CACHE_TTL && parsed.data) {
            if (!cancelled) setData(parsed.data);
            return;
          }
        }
      } catch {
        // A missing or unreadable cache is harmless; fall through to the network.
      }

      try {
        const res = await fetch(`${API_BASE}/${USERNAME}`);
        if (!res.ok) throw new Error(`LeetCode request failed: ${res.status}`);
        const payload = (await res.json()) as Record<string, unknown>;
        const next = normalize(payload);
        if (next.totalSolved <= 0) throw new Error('No LeetCode data returned');
        if (cancelled) return;

        setData(next);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data: next }));
        } catch {
          // Storage can be unavailable in private mode; the stats still render.
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!data) return;
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, [data]);

  const rows = useMemo(
    () =>
      data
        ? [
            { label: 'Easy', solved: data.easySolved, total: data.totalEasy },
            { label: 'Medium', solved: data.mediumSolved, total: data.totalMedium },
            { label: 'Hard', solved: data.hardSolved, total: data.totalHard },
          ]
        : [],
    [data]
  );

  if (failed) {
    return (
      <div className="flex flex-col items-start gap-3 border border-line bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2.5 text-sm text-secondary">
          <LeetCodeIcon size={14} className="text-tertiary" />
          LeetCode stats are unavailable right now.
        </p>
        <a
          href={PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline text-[12px] font-medium text-secondary transition-colors hover:text-primary"
        >
          See the profile
          <ArrowUpRight size={12} aria-hidden="true" />
        </a>
      </div>
    );
  }

  if (!data) {
    return (
      <div
        className="border border-line p-4 sm:p-5"
        aria-busy="true"
        aria-label="Loading LeetCode stats"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="h-3 w-40 animate-pulse rounded-sm bg-surface" />
          <div className="h-3 w-16 animate-pulse rounded-sm bg-surface" />
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-2.5 w-20 animate-pulse rounded-sm bg-surface" />
              <div className="h-1 w-full animate-pulse rounded-sm bg-surface" />
            </div>
          ))}
        </div>
        <div className="mt-5 h-2.5 w-32 animate-pulse rounded-sm bg-surface" />
      </div>
    );
  }

  return (
    <div className="border border-line">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <p className="flex items-center gap-2.5 text-[13px] text-secondary">
          <LeetCodeIcon size={14} className="text-tertiary" />
          <span>
            <span className="font-mono tabular-nums text-primary">{data.totalSolved}</span> problems
            solved
          </span>
        </p>
        <a
          href={PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline text-[12px] font-medium text-secondary transition-colors hover:text-primary"
        >
          LeetCode
          <ArrowUpRight size={12} aria-hidden="true" />
        </a>
      </div>

      <div className="grid gap-x-8 gap-y-4 px-4 py-4 sm:grid-cols-3 sm:px-5">
        {rows.map((row) => {
          const pct = row.total > 0 ? (row.solved / row.total) * 100 : 0;
          return (
            <div key={row.label}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="mono-label">{row.label}</span>
                <span className="font-mono text-[11px] tabular-nums text-secondary">
                  <span className="text-primary">{row.solved}</span>
                  <span className="text-tertiary"> / {row.total.toLocaleString('en-US')}</span>
                </span>
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden bg-surface">
                <div
                  className="h-full bg-primary transition-[width] duration-700 ease-smooth"
                  style={{ width: mounted ? `${Math.max(pct, row.solved > 0 ? 2 : 0)}%` : 0 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-tertiary sm:px-5">
        <span>
          Global rank{' '}
          <span className="tabular-nums text-secondary">{data.ranking.toLocaleString('en-US')}</span>
        </span>
        <span>{data.totalQuestions.toLocaleString('en-US')} problems on LeetCode</span>
      </div>
    </div>
  );
};

export default LeetCodeStats;
