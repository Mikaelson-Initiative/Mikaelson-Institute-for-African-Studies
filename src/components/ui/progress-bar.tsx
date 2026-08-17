type ProgressBarProps = {
  value: number; // 0–100
  className?: string;
};

export function ProgressBar({ value, className = "" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`h-2 w-full overflow-hidden rounded-full bg-beige-panel ${className}`}
    >
      <div
        className="h-full rounded-full bg-teal-deep transition-all duration-500"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
