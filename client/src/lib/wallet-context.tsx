import { createContext, useContext, useState, useCallback } from "react";
import type { WalletState, Network } from "@shared/schema";
import { networks } from "@shared/schema";

interface WalletContextType {
  wallet: WalletState;
  selectedNetwork: Network;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (networkId: number) => void;
  isConnecting: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const initialWalletState: WalletState = {
  isConnected: false,
  address: null,
  networkId: null,
  balance: {},
};

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>(initialWalletState);
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(networks[0]);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const mockAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f8c2B1";
    
    setWallet({
      isConnected: true,
      address: mockAddress,
      networkId: selectedNetwork.id,
      balance: {
        ETH: "2.5431",
        USDC: "15420.00",
        DAI: "8750.00",
        WBTC: "0.1234",
      },
    });
    
    setIsConnecting(false);
  }, [selectedNetwork]);

  const disconnectWallet = useCallback(() => {
    setWallet(initialWalletState);
  }, []);

  const switchNetwork = useCallback((networkId: number) => {
    const network = networks.find((n) => n.id === networkId);
    if (network) {
      setSelectedNetwork(network);
      if (wallet.isConnected) {
        setWallet((prev) => ({ ...prev, networkId }));
      }
    }
  }, [wallet.isConnected]);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        selectedNetwork,
        connectWallet,
        disconnectWallet,
        switchNetwork,
        isConnecting,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
