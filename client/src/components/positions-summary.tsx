import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AssetIcon } from "@/components/icons/asset-icons";
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react";
import type { UserPosition } from "@shared/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PositionsSummaryProps {
  type: "supply" | "borrow";
  positions: UserPosition[];
  isLoading?: boolean;
  onAction: (asset: string, action: "supply" | "withdraw" | "borrow" | "repay") => void;
}

function formatAmount(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return "0";
  if (num < 0.01 && num > 0) return "<0.01";
  return num.toLocaleString("en-US", { maximumFractionDigits: 4 });
}

function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function PositionsSummary({
  type,
  positions,
  isLoading,
  onAction,
}: PositionsSummaryProps) {
  const Icon = type === "supply" ? ArrowUpRight : ArrowDownRight;
  const iconColor = type === "supply" ? "text-success" : "text-chart-3";
  const title = type === "supply" ? "Your Supplies" : "Your Borrows";
  const emptyMessage =
    type === "supply"
      ? "You haven't supplied any assets yet"
      : "You haven't borrowed any assets yet";

  const filteredPositions = positions.filter((p) => {
    const amount =
      type === "supply" ? parseFloat(p.suppliedAmount) : parseFloat(p.borrowedAmount);
    return amount > 0;
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid={`card-${type}-positions`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${iconColor}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredPositions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 rounded-full bg-muted p-3">
              <Icon className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPositions.map((position) => {
              const amount =
                type === "supply"
                  ? position.suppliedAmount
                  : position.borrowedAmount;
              const valueUSD =
                type === "supply"
                  ? position.suppliedValueUSD
                  : position.borrowedValueUSD;
              const apy =
                type === "supply" ? position.supplyAPY : position.borrowAPY;

              return (
                <div
                  key={position.symbol}
                  className="flex items-center gap-4 rounded-lg p-3 hover-elevate"
                  data-testid={`position-${type}-${position.symbol.toLowerCase()}`}
                >
                  <AssetIcon symbol={position.symbol} className="h-10 w-10" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">{position.symbol}</p>
                      {type === "supply" && position.isCollateral && (
                        <Badge variant="outline" className="text-xs">
                          Collateral
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground tabular-nums">
                      {formatAmount(amount)} ({formatUSD(valueUSD)})
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="secondary"
                      className={
                        type === "supply"
                          ? "bg-success/10 text-success"
                          : "bg-chart-3/10 text-chart-3"
                      }
                    >
                      {apy.toFixed(2)}%
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        data-testid={`button-position-menu-${position.symbol.toLowerCase()}`}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          onAction(
                            position.symbol,
                            type === "supply" ? "supply" : "borrow"
                          )
                        }
                      >
                        {type === "supply" ? "Supply More" : "Borrow More"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onAction(
                            position.symbol,
                            type === "supply" ? "withdraw" : "repay"
                          )
                        }
                      >
                        {type === "supply" ? "Withdraw" : "Repay"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
