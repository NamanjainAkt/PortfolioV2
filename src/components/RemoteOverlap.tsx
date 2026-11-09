import { useEffect, useMemo, useState } from 'react';

const HOME_ZONE = 'Asia/Kolkata';
const WORK_HOURS = 9;

const REGIONS = [
  { label: 'Europe', timeZone: 'Europe/Berlin' },
  { label: 'US East', timeZone: 'America/New_York' },
  { label: 'APAC', timeZone: 'Asia/Singapore' },
] as const;

const zoneOffset = (timeZone: string, at: Date) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(at);

  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0);
  const asUtc = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute'),
    get('second')
  );

  return (asUtc - Math.floor(at.getTime() / 1000) * 1000) / 3_600_000;
};

const overlapHours = (timeZone: string, at: Date) => {
  const delta = Math.abs(zoneOffset(timeZone, at) - zoneOffset(HOME_ZONE, at));
  return Math.max(0, Math.min(WORK_HOURS, WORK_HOURS - delta));
};

const RemoteOverlap = () => {
  const [now, setNow] = useState(() => new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 15 * 60 * 1000);
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => {
      clearInterval(timer);
      cancelAnimationFrame(frame);
    };
  }, []);

  const rows = useMemo(
    () =>
      REGIONS.map((region) => {
        const hours = Math.round(overlapHours(region.timeZone, now) * 2) / 2;
        return { ...region, hours, value: hours > 0 ? `${hours}h` : 'async' };
      }),
    [now]
  );

  return (
    <div className="mt-6 border-t border-line pt-4">
      <div className="flex items-baseline justify-between gap-4">
        <span className="mono-label">Overlap with your team</span>
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-tertiary">
          09–18 IST
        </span>
      </div>

      <ul className="mt-3 space-y-2.5">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center gap-3">
            <span className="w-[62px] shrink-0 text-[12px] text-secondary">{row.label}</span>
            <span
              className="h-1 flex-1 overflow-hidden bg-surface"
              aria-hidden="true"
            >
              <span
                className="block h-full bg-primary transition-[width] duration-700 ease-smooth"
                style={{ width: mounted ? `${(row.hours / WORK_HOURS) * 100}%` : 0 }}
              />
            </span>
            <span className="w-11 text-right font-mono text-[10px] tabular-nums text-tertiary">
              {row.value}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-tertiary">
        Open to remote roles · any timezone
      </p>
    </div>
  );
};

export default RemoteOverlap;
