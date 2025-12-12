import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWallet } from "@/lib/wallet-context";
import { Wallet, Shield, TrendingUp, Zap, Loader2 } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Earn Yield",
    description: "Supply assets and earn competitive interest rates",
  },
  {
    icon: Shield,
    title: "Secure Collateral",
    description: "Use your deposits as collateral for borrowing",
  },
  {
    icon: Zap,
    title: "Multi-Chain",
    description: "Access liquidity across Ethereum, Arbitrum, Optimism & Base",
  },
];

export function ConnectPrompt() {
  const { connectWallet, isConnecting } = useWallet();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-lg text-center mb-8">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Wallet className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-3" data-testid="text-connect-title">
          Connect Your Wallet
        </h1>
        <p className="text-muted-foreground text-lg">
          Connect your wallet to start supplying assets, borrowing against your
          collateral, and managing your DeFi positions across multiple chains.
        </p>
      </div>

      <Button
        size="lg"
        onClick={connectWallet}
        disabled={isConnecting}
        className="gap-2 mb-12"
        data-testid="button-connect-wallet-main"
      >
        {isConnecting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Wallet className="h-5 w-5" />
        )}
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
        {features.map((feature) => (
          <Card key={feature.title} className="text-center">
            <CardContent className="pt-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <feature.icon className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
