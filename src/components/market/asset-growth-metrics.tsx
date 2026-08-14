import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Shared 3Y / 5Y / Demand block for trading surfaces. */
export function AssetGrowthMetrics({
  project,
  className,
  compact,
}: {
  project: Project;
  className?: string;
  compact?: boolean;
}) {
  const has3y = project.growth3yPct != null;
  const has5y = project.growth5yPct != null;
  const demand = project.demandLevel?.toUpperCase() || null;

  return (
    <div
      className={cn(
        "rounded-xl border border-border/70 bg-muted/35",
        compact ? "space-y-2 p-3 text-[13px]" : "space-y-2.5 p-3.5 text-sm",
        className
      )}
    >
      {has3y ? (
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-muted-foreground">3Y Growth</span>
          <span className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
            +{project.growth3yPct!.toFixed(1)}%
          </span>
        </div>
      ) : (
        <div>
          <p className="font-medium">TradeLands Opportunity Score</p>
          <p className="text-[11px] leading-snug text-muted-foreground">
            Shown until verified historical market data exists
          </p>
        </div>
      )}

      {has5y ? (
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-muted-foreground">5Y Growth</span>
          <span className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
            +{project.growth5yPct!.toFixed(1)}%
          </span>
        </div>
      ) : (
        <div>
          <p className="font-medium">Indicative Market Influence</p>
          <p className="text-[11px] leading-snug text-muted-foreground">
            Guidance only — not audited market history
          </p>
        </div>
      )}

      <div className="flex items-baseline justify-between gap-3">
        <span className="text-muted-foreground">Demand</span>
        <span className="font-semibold tracking-[0.08em] uppercase">
          {demand || "—"}
        </span>
      </div>

      {project.investmentHorizon ? (
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-muted-foreground">Horizon</span>
          <span className="font-medium">{project.investmentHorizon}</span>
        </div>
      ) : null}

      {project.growthPotentialPct != null ? (
        <div className="flex items-baseline justify-between gap-3 border-t border-border/60 pt-2">
          <span className="text-muted-foreground">Growth potential</span>
          <span className="font-semibold tabular-nums">
            +{project.growthPotentialPct.toFixed(1)}%
          </span>
        </div>
      ) : null}
    </div>
  );
}
