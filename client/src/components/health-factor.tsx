import { cn } from "@/lib/utils";

interface HealthFactorProps {
  value: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  showChange?: boolean;
  previousValue?: number;
}

function getHealthFactorStatus(value: number): {
  label: string;
  color: string;
  bgColor: string;
  barColor: string;
} {
  if (value >= 2) {
    return {
      label: "Safe",
      color: "text-success",
      bgColor: "bg-success/10",
      barColor: "bg-success",
    };
  }
  if (value >= 1.5) {
    return {
      label: "Stable",
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
      barColor: "bg-chart-2",
    };
  }
  if (value >= 1.2) {
    return {
      label: "At Risk",
      color: "text-warning",
      bgColor: "bg-warning/10",
      barColor: "bg-warning",
    };
  }
  return {
    label: "Danger",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    barColor: "bg-destructive",
  };
}

function getBarWidth(value: number): number {
  if (value <= 0) return 0;
  if (value >= 3) return 100;
  return Math.min((value / 3) * 100, 100);
}

export function HealthFactor({
  value,
  showLabel = true,
  size = "md",
  showChange = false,
  previousValue,
}: HealthFactorProps) {
  const status = getHealthFactorStatus(value);
  const barWidth = getBarWidth(value);
  const hasChange = showChange && previousValue !== undefined && previousValue !== value;
  const isImproving = hasChange && value > previousValue!;

  const sizeClasses = {
    sm: {
      container: "gap-2",
      value: "text-lg font-semibold tabular-nums",
      bar: "h-1.5",
      label: "text-xs",
    },
    md: {
      container: "gap-3",
      value: "text-2xl font-semibold tabular-nums",
      bar: "h-2",
      label: "text-sm",
    },
    lg: {
      container: "gap-4",
      value: "text-3xl font-bold tabular-nums",
      bar: "h-2.5",
      label: "text-base",
    },
  };

  const classes = sizeClasses[size];

  if (value === Infinity || isNaN(value)) {
    return (
      <div className={cn("flex flex-col", classes.container)}>
        <div className="flex items-baseline gap-2">
          <span className={cn(classes.value, "text-muted-foreground")}>N/A</span>
          {showLabel && (
            <span className={cn(classes.label, "text-muted-foreground")}>
              No active borrows
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", classes.container)} data-testid="health-factor-display">
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className={cn(classes.value, status.color)} data-testid="text-health-factor-value">
          {value.toFixed(2)}
        </span>
        {showLabel && (
          <span className={cn(classes.label, status.color, "font-medium")} data-testid="text-health-factor-label">
            {status.label}
          </span>
        )}
        {hasChange && (
          <span
            className={cn(
              classes.label,
              isImproving ? "text-success" : "text-destructive"
            )}
          >
            {isImproving ? "+" : ""}
            {(value - previousValue!).toFixed(2)}
          </span>
        )}
      </div>

      <div className="relative w-full max-w-40">
        <div className={cn("w-full rounded-full bg-muted", classes.bar)}>
          <div
            className={cn("rounded-full transition-all duration-500", classes.bar, status.barColor)}
            style={{ width: `${barWidth}%` }}
          />
        </div>
        <div
          className="absolute top-0 h-full w-0.5 bg-destructive"
          style={{ left: `${(1 / 3) * 100}%` }}
          title="Liquidation threshold (1.0)"
        />
      </div>

      {value < 1.2 && (
        <p className="text-xs text-destructive">
          Warning: Your position is at risk of liquidation
        </p>
      )}
    </div>
  );
}

export function HealthFactorBadge({ value }: { value: number }) {
  const status = getHealthFactorStatus(value);

  if (value === Infinity || isNaN(value)) {
    return null;
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1",
        status.bgColor
      )}
    >
      <div className={cn("h-1.5 w-1.5 rounded-full", status.barColor)} />
      <span className={cn("text-xs font-medium tabular-nums", status.color)}>
        {value.toFixed(2)}
      </span>
    </div>
  );
}
