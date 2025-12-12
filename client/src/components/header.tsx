import { Moon, Sun, ChevronDown, Wallet, LogOut, Copy, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/lib/theme";
import { useWallet } from "@/lib/wallet-context";
import { networks } from "@shared/schema";
import { NetworkIcon } from "@/components/icons/network-icons";
import { useToast } from "@/hooks/use-toast";

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { wallet, selectedNetwork, connectWallet, disconnectWallet, switchNetwork, isConnecting } =
    useWallet();
  const { toast } = useToast();

  const copyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <span className="text-sm font-bold text-primary-foreground">OY</span>
            </div>
            <span className="text-lg font-semibold" data-testid="text-logo">
              OpenYield
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="default"
                className="gap-2"
                data-testid="button-network-selector"
              >
                <NetworkIcon network={selectedNetwork.name} className="h-5 w-5" />
                <span className="hidden sm:inline">{selectedNetwork.name}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {networks.map((network) => (
                <DropdownMenuItem
                  key={network.id}
                  onClick={() => switchNetwork(network.id)}
                  className="gap-3"
                  data-testid={`menu-network-${network.name.toLowerCase()}`}
                >
                  <NetworkIcon network={network.name} className="h-5 w-5" />
                  <span>{network.name}</span>
                  {selectedNetwork.id === network.id && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-success" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {wallet.isConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  className="gap-2"
                  data-testid="button-wallet-connected"
                >
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <span className="font-mono text-sm">
                    {formatAddress(wallet.address!)}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-xs text-muted-foreground">Connected Wallet</p>
                  <p className="font-mono text-sm">{formatAddress(wallet.address!)}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={copyAddress} className="gap-3" data-testid="menu-copy-address">
                  <Copy className="h-4 w-4" />
                  Copy Address
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-3" data-testid="menu-view-explorer">
                  <ExternalLink className="h-4 w-4" />
                  View on Explorer
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={disconnectWallet}
                  className="gap-3 text-destructive focus:text-destructive"
                  data-testid="menu-disconnect"
                >
                  <LogOut className="h-4 w-4" />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={connectWallet}
              disabled={isConnecting}
              className="gap-2"
              data-testid="button-connect-wallet"
            >
              {isConnecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wallet className="h-4 w-4" />
              )}
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
