type CircularProgressProps = {
  value: number; // 0–100
  size?: number;
  strokeWidth?: number;
  className?: string;
  trackClassName?: string;
};

export function CircularProgress({
  value,
  size = 32,
  strokeWidth = 3,
  className = "",
  trackClassName = "",
}: CircularProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const center = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`${Math.round(clamped)}% complete`}
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        className={trackClassName || "stroke-beige-panel"}
      />
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${center} ${center})`}
        style={{ transition: "stroke-dashoffset 500ms ease" }}
        className={className || "stroke-teal-deep"}
      />
    </svg>
  );
}
