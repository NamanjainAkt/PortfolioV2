import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Github } from 'lucide-react';

type Activity = {
  date: string;
  count: number;
  level: number;
};

type HoverState = {
  activity: Activity;
  weekIndex: number;
  dayIndex: number;
};

const API_BASE =
  (import.meta.env.VITE_GITHUB_CONTRIBUTIONS_API_URL as string | undefined) ??
  'https://github-contributions-api.jogruber.de/v4';
const USERNAME = 'namanjainakt';
const PROFILE_URL = 'https://github.com/namanjainakt/';
const CACHE_KEY = `gh-contributions:${USERNAME}`;
const CACHE_TTL = 6 * 60 * 60 * 1000;

const BLOCK = 10;
const GAP = 2;
const LABEL_HEIGHT = 18;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const longDate = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const parseDay = (value: string) => new Date(`${value}T00:00:00`);

const buildWeeks = (days: Activity[]) => {
  const weeks: Array<Array<Activity | undefined>> = [];
  if (days.length === 0) return weeks;

  let week: Array<Activity | undefined> = [];
  const leading = parseDay(days[0].date).getDay();
  for (let i = 0; i < leading; i += 1) week.push(undefined);

  days.forEach((day) => {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });

  if (week.length > 0) {
    while (week.length < 7) week.push(undefined);
    weeks.push(week);
  }

  return weeks;
};

const GitHubContributions = () => {
  const [days, setDays] = useState<Activity[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [hover, setHover] = useState<HoverState | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as { savedAt: number; days: Activity[] };
          if (Date.now() - parsed.savedAt < CACHE_TTL && Array.isArray(parsed.days)) {
            if (!cancelled) setDays(parsed.days);
            return;
          }
        }
      } catch {
        // A missing or unreadable cache is harmless; fall through to the network.
      }

      try {
        const res = await fetch(`${API_BASE}/${USERNAME}?y=last`);
        if (!res.ok) throw new Error(`Contribution request failed: ${res.status}`);
        const payload = (await res.json()) as { contributions?: Activity[] };
        const next = (payload.contributions ?? []).filter(
          (day) => typeof day.date === 'string' && Number.isFinite(day.count)
        );
        if (next.length === 0) throw new Error('No contribution data returned');
        if (cancelled) return;

        setDays(next);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), days: next }));
        } catch {
          // Storage can be unavailable in private mode; the graph still renders.
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

  const weeks = useMemo(() => buildWeeks(days ?? []), [days]);

  const monthLabels = useMemo(() => {
    const labels: Array<{ label: string; weekIndex: number }> = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIndex) => {
      const first = week.find((day): day is Activity => Boolean(day));
      if (!first) return;
      const month = parseDay(first.date).getMonth();
      if (month === lastMonth) return;

      const previous = labels[labels.length - 1];
      if (!previous || weekIndex - previous.weekIndex >= 3) {
        labels.push({ label: MONTHS[month], weekIndex });
      }
      lastMonth = month;
    });

    return labels;
  }, [weeks]);

  const total = useMemo(() => (days ?? []).reduce((sum, day) => sum + day.count, 0), [days]);

  if (failed) {
    return (
      <div className="flex flex-col items-start gap-3 border border-line bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2.5 text-sm text-secondary">
          <Github size={15} className="text-tertiary" aria-hidden="true" />
          Activity is unavailable right now.
        </p>
        <a
          href={PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline text-[12px] font-medium text-secondary transition-colors hover:text-primary"
        >
          See it on GitHub
          <ArrowUpRight size={12} aria-hidden="true" />
        </a>
      </div>
    );
  }

  if (!days) {
    return (
      <div
        className="border border-line p-4 sm:p-5"
        aria-busy="true"
        aria-label="Loading GitHub activity"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="h-3 w-44 animate-pulse rounded-sm bg-surface" />
          <div className="h-3 w-20 animate-pulse rounded-sm bg-surface" />
        </div>
        <div className="mt-4 h-[106px] animate-pulse rounded-sm bg-surface" />
        <div className="mt-3 flex items-center justify-between gap-4">
          <div className="h-2.5 w-24 animate-pulse rounded-sm bg-surface" />
          <div className="h-2.5 w-28 animate-pulse rounded-sm bg-surface" />
        </div>
      </div>
    );
  }

  const width = weeks.length * (BLOCK + GAP) - GAP;
  const height = LABEL_HEIGHT + 7 * (BLOCK + GAP) - GAP;
  const tooltipAbove = (hover?.dayIndex ?? 0) >= 2;
  const tooltipLeft = hover
    ? Math.min(
        Math.max(hover.weekIndex * (BLOCK + GAP) + BLOCK / 2, 92),
        width - 92
      )
    : 0;

  return (
    <div className="border border-line">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <p className="text-[13px] text-secondary">
          <span className="font-mono tabular-nums text-primary">{total.toLocaleString('en-US')}</span>{' '}
          contributions in the last year
        </p>
        <a
          href={PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline text-[12px] font-medium text-secondary transition-colors hover:text-primary"
        >
          GitHub
          <ArrowUpRight size={12} aria-hidden="true" />
        </a>
      </div>

      <div className="relative px-4 py-4 sm:px-5">
        <div className="no-scrollbar relative overflow-x-auto overflow-y-hidden">
          <div className="relative" style={{ width }}>
            <svg
              width={width}
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              role="img"
              aria-label={`GitHub contributions for the last year: ${total} total`}
              className="block"
            >
              <g className="fill-current text-tertiary">
                {monthLabels.map(({ label, weekIndex }) => (
                  <text
                    key={`${label}-${weekIndex}`}
                    x={weekIndex * (BLOCK + GAP)}
                    y={0}
                    dominantBaseline="hanging"
                    className="font-mono text-[9px]"
                  >
                    {label}
                  </text>
                ))}
              </g>

              {weeks.map((week, weekIndex) =>
                week.map((day, dayIndex) => {
                  if (!day) return null;
                  return (
                    <rect
                      key={day.date}
                      x={weekIndex * (BLOCK + GAP)}
                      y={LABEL_HEIGHT + dayIndex * (BLOCK + GAP)}
                      width={BLOCK}
                      height={BLOCK}
                      rx={2}
                      data-level={day.level}
                      className="contrib-cell"
                      style={{ animationDelay: `${Math.min(weekIndex * 8, 420)}ms` }}
                      onMouseEnter={() => setHover({ activity: day, weekIndex, dayIndex })}
                      onMouseLeave={() => setHover(null)}
                    >
                      <title>{`${day.count} contribution${day.count === 1 ? '' : 's'} on ${longDate.format(parseDay(day.date))}`}</title>
                    </rect>
                  );
                })
              )}
            </svg>

            {hover && (
              <div
                className="pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-line bg-background px-2.5 py-1.5 font-mono text-[10px] text-primary shadow-sm"
                style={{
                  left: tooltipLeft,
                  top: tooltipAbove
                    ? LABEL_HEIGHT + hover.dayIndex * (BLOCK + GAP) - 6
                    : LABEL_HEIGHT + hover.dayIndex * (BLOCK + GAP) + BLOCK + 6,
                  transform: `translate(-50%, ${tooltipAbove ? '-100%' : '0'})`,
                }}
              >
                <span className="tabular-nums">{hover.activity.count}</span>
                {` contribution${hover.activity.count === 1 ? '' : 's'}`}
                <span className="text-tertiary"> · {longDate.format(parseDay(hover.activity.date))}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-tertiary sm:px-5">
        <span>Last 12 months</span>
        <span className="flex items-center gap-1.5">
          Less
          {[0, 1, 2, 3, 4].map((level) => (
            <span key={level} data-level={level} className="contrib-swatch" />
          ))}
          More
        </span>
      </div>
    </div>
  );
};

export default GitHubContributions;
