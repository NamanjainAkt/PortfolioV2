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
      <div className="flex flex-col items-start gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
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
      <div className="py-4" aria-busy="true" aria-label="Loading LeetCode stats">
        <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
          <div className="h-3 w-40 animate-pulse rounded-sm bg-surface" />
          <div className="h-3 w-16 animate-pulse rounded-sm bg-surface" />
        </div>
        <div className="mt-2 divide-y divide-line">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-2.5">
              <div className="h-2.5 w-16 animate-pulse rounded-sm bg-surface" />
              <div className="h-2.5 w-20 animate-pulse rounded-sm bg-surface" />
            </div>
          ))}
        </div>
        <div className="mt-1 h-2.5 w-32 animate-pulse rounded-sm bg-surface" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-3">
        <p className="flex items-center gap-2 text-[13px] text-secondary">
          <LeetCodeIcon size={14} className="text-tertiary" />
          <span>
            <span className="font-mono tabular-nums text-primary">{data.totalSolved}</span> solved
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

      <dl className="divide-y divide-line">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-3 py-2.5">
            <dt className="mono-label">{row.label}</dt>
            <dd className="font-mono text-[13px] tabular-nums">
              <span className="text-primary">{row.solved}</span>
              <span className="text-tertiary"> / {row.total.toLocaleString('en-US')}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-line pt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-tertiary">
        <span>
          Rank{' '}
          <span className="tabular-nums text-secondary">{data.ranking.toLocaleString('en-US')}</span>
        </span>
        <span>{data.totalQuestions.toLocaleString('en-US')} total</span>
      </div>
    </div>
  );
};

export default LeetCodeStats;
