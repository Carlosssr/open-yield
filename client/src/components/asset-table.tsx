import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AssetIcon } from "@/components/icons/asset-icons";
import { ArrowUpRight, ArrowDownRight, Plus, Minus } from "lucide-react";
import type { MarketData, UserPosition } from "@shared/schema";

interface AssetTableProps {
  title: string;
  type: "supply" | "borrow";
  markets: MarketData[];
  positions?: UserPosition[];
  isLoading?: boolean;
  onAction: (asset: string, action: "supply" | "withdraw" | "borrow" | "repay") => void;
}

function formatAmount(value: string, decimals: number = 2): string {
  const num = parseFloat(value);
  if (isNaN(num)) return "0";
  if (num === 0) return "0";
  if (num < 0.01) return "<0.01";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function AssetTable({
  title,
  type,
  markets,
  positions = [],
  isLoading,
  onAction,
}: AssetTableProps) {
  const primaryAction = type === "supply" ? "supply" : "borrow";
  const secondaryAction = type === "supply" ? "withdraw" : "repay";
  const PrimaryIcon = type === "supply" ? Plus : ArrowDownRight;
  const SecondaryIcon = type === "supply" ? Minus : ArrowUpRight;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPosition = (symbol: string) =>
    positions.find((p) => p.symbol === symbol);

  return (
    <Card data-testid={`card-${type}-assets`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          {type === "supply" ? (
            <ArrowUpRight className="h-5 w-5 text-success" />
          ) : (
            <ArrowDownRight className="h-5 w-5 text-chart-3" />
          )}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-sm text-muted-foreground">
                <th className="px-6 py-3 font-medium">Asset</th>
                <th className="px-6 py-3 font-medium text-right">
                  {type === "supply" ? "Your Supply" : "Your Borrow"}
                </th>
                <th className="px-6 py-3 font-medium text-right">
                  {type === "supply" ? "Supply APY" : "Borrow APY"}
                </th>
                {type === "supply" && (
                  <th className="px-6 py-3 font-medium text-center">Collateral</th>
                )}
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {markets.map((market) => {
                const position = getPosition(market.symbol);
                const amount =
                  type === "supply"
                    ? position?.suppliedAmount
                    : position?.borrowedAmount;
                const valueUSD =
                  type === "supply"
                    ? position?.suppliedValueUSD
                    : position?.borrowedValueUSD;
                const apy =
                  type === "supply" ? market.supplyAPY : market.borrowAPY;
                const hasPosition = amount && parseFloat(amount) > 0;

                return (
                  <tr
                    key={market.symbol}
                    className="border-b border-border last:border-0 hover-elevate"
                    data-testid={`row-${type}-${market.symbol.toLowerCase()}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <AssetIcon symbol={market.symbol} className="h-8 w-8" />
                        <div>
                          <p className="font-medium">{market.symbol}</p>
                          <p className="text-sm text-muted-foreground">
                            {market.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {hasPosition ? (
                        <div>
                          <p className="font-medium tabular-nums">
                            {formatAmount(amount!)}
                          </p>
                          <p className="text-sm text-muted-foreground tabular-nums">
                            {formatUSD(valueUSD!)}
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
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
                    </td>
                    {type === "supply" && (
                      <td className="px-6 py-4 text-center">
                        {position?.isCollateral ? (
                          <Badge variant="outline" className="bg-primary/5">
                            Enabled
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant={type === "supply" ? "default" : "secondary"}
                          className="gap-1"
                          onClick={() => onAction(market.symbol, primaryAction)}
                          data-testid={`button-${primaryAction}-${market.symbol.toLowerCase()}`}
                        >
                          <PrimaryIcon className="h-3.5 w-3.5" />
                          {type === "supply" ? "Supply" : "Borrow"}
                        </Button>
                        {hasPosition && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="gap-1"
                            onClick={() =>
                              onAction(market.symbol, secondaryAction)
                            }
                            data-testid={`button-${secondaryAction}-${market.symbol.toLowerCase()}`}
                          >
                            <SecondaryIcon className="h-3.5 w-3.5" />
                            {type === "supply" ? "Withdraw" : "Repay"}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {markets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              {type === "supply" ? (
                <ArrowUpRight className="h-8 w-8 text-muted-foreground" />
              ) : (
                <ArrowDownRight className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <p className="text-muted-foreground">No assets available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
