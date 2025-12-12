import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { HealthFactor } from "@/components/health-factor";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Shield } from "lucide-react";
import type { PortfolioSummary } from "@shared/schema";

interface PortfolioCardsProps {
  summary: PortfolioSummary | null;
  isLoading?: boolean;
}

function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercentage(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function PortfolioCards({ summary, isLoading }: PortfolioCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Supplied",
      value: formatUSD(summary?.totalSuppliedUSD ?? 0),
      icon: ArrowUpRight,
      iconBg: "bg-success/10",
      iconColor: "text-success",
      subtitle: "Earning yield",
      testId: "card-total-supplied",
    },
    {
      title: "Total Borrowed",
      value: formatUSD(summary?.totalBorrowedUSD ?? 0),
      icon: ArrowDownRight,
      iconBg: "bg-chart-3/10",
      iconColor: "text-chart-3",
      subtitle: "Outstanding debt",
      testId: "card-total-borrowed",
    },
    {
      title: "Net APY",
      value: formatPercentage(summary?.netAPY ?? 0),
      icon: TrendingUp,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      subtitle: "Annualized return",
      testId: "card-net-apy",
    },
    {
      title: "Borrowing Power",
      value: formatUSD(summary?.maxBorrowUSD ?? 0),
      icon: Shield,
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
      subtitle: "Available to borrow",
      testId: "card-borrowing-power",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} data-testid={card.testId}>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`rounded-md p-2 ${card.iconBg}`}>
              <card.icon className={`h-4 w-4 ${card.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums" data-testid={`text-${card.testId}-value`}>
              {card.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function HealthFactorCard({
  healthFactor,
  isLoading,
}: {
  healthFactor: number;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-20 mb-2" />
          <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-health-factor">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Health Factor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <HealthFactor value={healthFactor} size="md" />
      </CardContent>
    </Card>
  );
}
