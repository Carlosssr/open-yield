import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { AssetIcon } from "@/components/icons/asset-icons";
import { HealthFactor } from "@/components/health-factor";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  AlertTriangle,
  Wallet,
  ArrowRight,
} from "lucide-react";
import type { TransactionType, TransactionState, TransactionPreview } from "@shared/schema";
import { cn } from "@/lib/utils";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: TransactionType;
  asset: string;
  assetName: string;
  walletBalance: string;
  currentPosition?: string;
  preview: TransactionPreview | null;
  supportsPermit?: boolean;
  onConfirm: (amount: string, usePermit: boolean) => void;
  onAmountChange?: (amount: string) => void;
  transactionState: TransactionState;
  txHash?: string;
  error?: string;
}

const typeLabels: Record<TransactionType, { title: string; action: string; description: string }> = {
  supply: {
    title: "Supply",
    action: "Supply",
    description: "Deposit assets to earn interest",
  },
  withdraw: {
    title: "Withdraw",
    action: "Withdraw",
    description: "Remove your deposited assets",
  },
  borrow: {
    title: "Borrow",
    action: "Borrow",
    description: "Borrow assets against your collateral",
  },
  repay: {
    title: "Repay",
    action: "Repay",
    description: "Repay your borrowed assets",
  },
};

function formatAmount(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return "0";
  return num.toLocaleString("en-US", { maximumFractionDigits: 6 });
}

export function TransactionModal({
  isOpen,
  onClose,
  type,
  asset,
  assetName,
  walletBalance,
  currentPosition = "0",
  preview,
  supportsPermit = false,
  onConfirm,
  onAmountChange,
  transactionState,
  txHash,
  error,
}: TransactionModalProps) {
  const [amount, setAmount] = useState("");
  const [usePermit, setUsePermit] = useState(true);
  const [sliderValue, setSliderValue] = useState([0]);

  const labels = typeLabels[type];
  const maxAmount =
    type === "withdraw" || type === "repay" ? currentPosition : walletBalance;
  const maxAmountNum = parseFloat(maxAmount) || 0;
  const amountNum = parseFloat(amount) || 0;

  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setSliderValue([0]);
    }
  }, [isOpen]);

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    const newAmount = ((value[0] / 100) * maxAmountNum).toFixed(6);
    const parsedAmount = parseFloat(newAmount).toString();
    setAmount(parsedAmount);
    onAmountChange?.(parsedAmount);
  };

  const handleAmountChange = (value: string) => {
    const sanitized = value.replace(/[^0-9.]/g, "");
    setAmount(sanitized);
    onAmountChange?.(sanitized);
    const num = parseFloat(sanitized) || 0;
    const percentage = maxAmountNum > 0 ? (num / maxAmountNum) * 100 : 0;
    setSliderValue([Math.min(percentage, 100)]);
  };

  const handleMaxClick = () => {
    setAmount(maxAmount);
    setSliderValue([100]);
    onAmountChange?.(maxAmount);
  };

  const isValidAmount = amountNum > 0 && amountNum <= maxAmountNum;
  const willLiquidate =
    preview && preview.newHealthFactor < 1 && preview.newHealthFactor > 0;
  const isRisky = preview && preview.newHealthFactor < 1.2 && preview.newHealthFactor >= 1;

  const renderContent = () => {
    switch (transactionState) {
      case "signing":
        return (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-6 rounded-full bg-primary/10 p-6">
              <Wallet className="h-12 w-12 text-primary animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Waiting for Signature</h3>
            <p className="text-muted-foreground max-w-sm">
              Please sign the transaction in your wallet to continue
            </p>
          </div>
        );

      case "pending":
        return (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-6 rounded-full bg-primary/10 p-6">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Transaction Pending</h3>
            <p className="text-muted-foreground max-w-sm mb-4">
              Your transaction is being processed on the blockchain
            </p>
            {txHash && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() =>
                  window.open(`https://etherscan.io/tx/${txHash}`, "_blank")
                }
              >
                View on Etherscan
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        );

      case "success":
        return (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-6 rounded-full bg-success/10 p-6">
              <CheckCircle2 className="h-12 w-12 text-success" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Transaction Successful</h3>
            <p className="text-muted-foreground max-w-sm mb-4">
              {labels.title} of {formatAmount(amount)} {asset} completed successfully
            </p>
            {txHash && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() =>
                  window.open(`https://etherscan.io/tx/${txHash}`, "_blank")
                }
              >
                View on Etherscan
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        );

      case "error":
        return (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-6 rounded-full bg-destructive/10 p-6">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Transaction Failed</h3>
            <p className="text-muted-foreground max-w-sm">
              {error || "An error occurred while processing your transaction"}
            </p>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-4">
              <AssetIcon symbol={asset} className="h-12 w-12" />
              <div>
                <p className="font-semibold text-lg">{asset}</p>
                <p className="text-sm text-muted-foreground">{assetName}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="amount">Amount</Label>
                <button
                  type="button"
                  onClick={handleMaxClick}
                  className="text-sm text-primary hover:underline"
                  data-testid="button-max-amount"
                >
                  Max: {formatAmount(maxAmount)} {asset}
                </button>
              </div>
              <div className="relative">
                <Input
                  id="amount"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="pr-16 text-lg font-medium tabular-nums"
                  data-testid="input-amount"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {asset}
                </span>
              </div>
              <Slider
                value={sliderValue}
                onValueChange={handleSliderChange}
                max={100}
                step={1}
                className="py-2"
                data-testid="slider-amount"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>

            {supportsPermit && (type === "supply" || type === "repay") && (
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                <div>
                  <p className="font-medium">Use Permit</p>
                  <p className="text-sm text-muted-foreground">
                    Save gas by signing instead of approving
                  </p>
                </div>
                <Switch
                  checked={usePermit}
                  onCheckedChange={setUsePermit}
                  data-testid="switch-permit"
                />
              </div>
            )}

            <Separator />

            {preview && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Transaction Impact
                </h4>

                <div className="space-y-3 rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Health Factor</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium tabular-nums">
                        {preview.currentHealthFactor.toFixed(2)}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <span
                        className={cn(
                          "font-medium tabular-nums",
                          willLiquidate && "text-destructive",
                          isRisky && "text-warning"
                        )}
                      >
                        {preview.newHealthFactor.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Est. Gas</span>
                    <span className="font-mono text-sm">
                      {preview.estimatedGas} (~${preview.gasUSD.toFixed(2)})
                    </span>
                  </div>
                </div>

                {willLiquidate && (
                  <div className="flex items-start gap-3 rounded-lg bg-destructive/10 p-4 text-destructive">
                    <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Liquidation Warning</p>
                      <p className="text-sm">
                        This transaction will put your position at risk of
                        liquidation. Please reduce the amount or add more
                        collateral.
                      </p>
                    </div>
                  </div>
                )}

                {isRisky && !willLiquidate && (
                  <div className="flex items-start gap-3 rounded-lg bg-warning/10 p-4 text-warning-foreground">
                    <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5 text-warning" />
                    <div>
                      <p className="font-medium">Low Health Factor</p>
                      <p className="text-sm text-muted-foreground">
                        Your health factor will be close to the liquidation
                        threshold. Consider a smaller amount.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
    }
  };

  const showFooter = transactionState === "idle" || transactionState === "confirming";

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AssetIcon symbol={asset} className="h-6 w-6" />
            {labels.title} {asset}
          </DialogTitle>
          <DialogDescription>{labels.description}</DialogDescription>
        </DialogHeader>

        {renderContent()}

        {showFooter && (
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={onClose} data-testid="button-cancel">
              Cancel
            </Button>
            <Button
              onClick={() => onConfirm(amount, usePermit)}
              disabled={!isValidAmount || willLiquidate || transactionState === "confirming"}
              data-testid="button-confirm"
            >
              {transactionState === "confirming" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Confirming...
                </>
              ) : (
                labels.action
              )}
            </Button>
          </DialogFooter>
        )}

        {(transactionState === "success" || transactionState === "error") && (
          <DialogFooter>
            <Button onClick={onClose} className="w-full" data-testid="button-done">
              Done
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
