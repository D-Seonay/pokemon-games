const RADIUS = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const COLORS = {
  normal: "var(--accent-2)",
  warn: "var(--warn)",
  danger: "var(--danger)",
} as const;

export function Timer({
  remainingMs,
  totalMs,
}: {
  /** `null` quand la manche est sans limite de temps : il n'y a rien à décompter. */
  remainingMs: number | null;
  totalMs: number;
}) {
  // Un anneau plein et figé plutôt qu'un chrono absent : la place reste occupée, et le
  // joueur voit qu'il n'y a pas de compte à rebours au lieu de croire qu'il n'a pas chargé.
  if (remainingMs === null) {
    return (
      <div className="flex items-center justify-center my-1">
        <span
          role="img"
          aria-label="Pas de limite de temps"
          className="mono flex h-12 w-12 items-center justify-center rounded-full border-4 text-xl bg-[var(--surface)] shadow-inner"
          style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}
        >
          ∞
        </span>
      </div>
    );
  }

  const clamped = Math.max(0, Math.min(remainingMs, totalMs));
  const seconds = Math.ceil(clamped / 1000);
  const state = clamped <= 2000 ? "danger" : clamped <= 5000 ? "warn" : "normal";
  const ratio = totalMs > 0 ? clamped / totalMs : 0;

  return (
    <div data-state={state} className="flex items-center justify-center my-1">
      {/* Le chrono n'est pas dans une région live : seul le seuil des 5 s est annoncé. */}
      {state === "warn" && (
        <span aria-live="assertive" className="sr-only">
          5 secondes restantes
        </span>
      )}
      <svg
        width={48}
        height={48}
        viewBox="0 0 44 44"
        aria-hidden="true"
        className="transition-transform duration-200"
      >
        <circle cx="22" cy="22" r={RADIUS} fill="none" stroke="var(--surface-2)" strokeWidth="4" />
        <circle
          cx="22"
          cy="22"
          r={RADIUS}
          fill="none"
          stroke={COLORS[state]}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - ratio)}
          transform="rotate(-90 22 22)"
          style={{
            transition: "stroke-dashoffset 0.1s linear, stroke 0.3s ease",
            filter:
              state === "danger"
                ? "drop-shadow(0 0 6px var(--danger))"
                : state === "warn"
                ? "drop-shadow(0 0 6px var(--warn))"
                : "drop-shadow(0 0 4px rgba(61, 123, 255, 0.4))",
          }}
        />
        <text
          x="22"
          y="27"
          textAnchor="middle"
          className="mono font-bold"
          fill="var(--text)"
          fontSize="14"
        >
          {seconds}
        </text>
      </svg>
    </div>
  );
}
