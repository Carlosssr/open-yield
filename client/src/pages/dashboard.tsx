import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioCards, HealthFactorCard } from "@/components/portfolio-cards";
import { AssetTable } from "@/components/asset-table";
import { PositionsSummary } from "@/components/positions-summary";
import { TransactionModal } from "@/components/transaction-modal";
import { ConnectPrompt } from "@/components/connect-prompt";
import { useWallet } from "@/lib/wallet-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type {
  MarketData,
  UserPosition,
  PortfolioSummary,
  TransactionType,
  TransactionState,
  TransactionPreview,
} from "@shared/schema";
import { assets } from "@shared/schema";

export default function Dashboard() {
  const { wallet, selectedNetwork } = useWallet();
  const { toast } = useToast();

  const [transactionModal, setTransactionModal] = useState<{
    isOpen: boolean;
    type: TransactionType;
    asset: string;
    assetName: string;
  }>({
    isOpen: false,
    type: "supply",
    asset: "",
    assetName: "",
  });
  const [transactionState, setTransactionState] = useState<TransactionState>("idle");
  const [txHash, setTxHash] = useState<string | undefined>();
  const [txError, setTxError] = useState<string | undefined>();
  const [modalAmount, setModalAmount] = useState("");
  const debouncedAmount = useDebounce(modalAmount, 300);

  const { data: markets, isLoading: isLoadingMarkets } = useQuery<MarketData[]>({
    queryKey: ["/api/markets", selectedNetwork.id],
    queryFn: async () => {
      const res = await fetch(`/api/markets?networkId=${selectedNetwork.id}`);
      if (!res.ok) throw new Error("Failed to fetch markets");
      return res.json();
    },
    enabled: wallet.isConnected,
  });

  const { data: positions, isLoading: isLoadingPositions } = useQuery<UserPosition[]>({
    queryKey: ["/api/positions", selectedNetwork.id, wallet.address],
    queryFn: async () => {
      const res = await fetch(`/api/positions?networkId=${selectedNetwork.id}&address=${wallet.address}`);
      if (!res.ok) throw new Error("Failed to fetch positions");
      return res.json();
    },
    enabled: wallet.isConnected && !!wallet.address,
  });

  const { data: summary, isLoading: isLoadingSummary } = useQuery<PortfolioSummary>({
    queryKey: ["/api/portfolio", selectedNetwork.id, wallet.address],
    queryFn: async () => {
      const res = await fetch(`/api/portfolio?networkId=${selectedNetwork.id}&address=${wallet.address}`);
      if (!res.ok) throw new Error("Failed to fetch portfolio");
      return res.json();
    },
    enabled: wallet.isConnected && !!wallet.address,
  });

  const { data: preview } = useQuery<TransactionPreview>({
    queryKey: ["/api/preview", transactionModal.type, transactionModal.asset, selectedNetwork.id, debouncedAmount, wallet.address],
    queryFn: async () => {
      const res = await fetch(`/api/preview?type=${transactionModal.type}&asset=${transactionModal.asset}&networkId=${selectedNetwork.id}&amount=${debouncedAmount}&address=${wallet.address}`);
      if (!res.ok) throw new Error("Failed to fetch preview");
      return res.json();
    },
    enabled: transactionModal.isOpen && !!transactionModal.asset && !!wallet.address,
  });

  const transactionMutation = useMutation({
    mutationFn: async (data: {
      type: TransactionType;
      asset: string;
      amount: string;
      usePermit: boolean;
    }) => {
      const response = await apiRequest("POST", "/api/transaction", {
        ...data,
        networkId: selectedNetwork.id,
        address: wallet.address,
      });
      return response;
    },
    onMutate: () => {
      setTransactionState("signing");
    },
    onSuccess: (data: { hash: string }) => {
      setTxHash(data.hash);
      setTransactionState("pending");
      
      setTimeout(() => {
        setTransactionState("success");
        queryClient.invalidateQueries({ queryKey: ["/api/positions"] });
        queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
        queryClient.invalidateQueries({ queryKey: ["/api/markets"] });
        
        toast({
          title: "Transaction Successful",
          description: `Your ${transactionModal.type} transaction has been confirmed.`,
        });
      }, 2000);
    },
    onError: (error: Error) => {
      setTxError(error.message);
      setTransactionState("error");
    },
  });

  const handleAction = (asset: string, action: TransactionType) => {
    const assetInfo = assets.find((a) => a.symbol === asset);
    setTransactionModal({
      isOpen: true,
      type: action,
      asset,
      assetName: assetInfo?.name || asset,
    });
    setTransactionState("idle");
    setTxHash(undefined);
    setTxError(undefined);
    setModalAmount("");
  };

  const handleCloseModal = () => {
    setTransactionModal((prev) => ({ ...prev, isOpen: false }));
    setTransactionState("idle");
  };

  const handleConfirmTransaction = (amount: string, usePermit: boolean) => {
    transactionMutation.mutate({
      type: transactionModal.type,
      asset: transactionModal.asset,
      amount,
      usePermit,
    });
  };

  if (!wallet.isConnected) {
    return <ConnectPrompt />;
  }

  const isLoading = isLoadingMarkets || isLoadingPositions || isLoadingSummary;
  const assetInfo = assets.find((a) => a.symbol === transactionModal.asset);
  const position = positions?.find((p) => p.symbol === transactionModal.asset);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2" data-testid="text-dashboard-title">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage your DeFi positions on {selectedNetwork.name}
        </p>
      </div>

      <div className="space-y-6">
        <PortfolioCards summary={summary || null} isLoading={isLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PositionsSummary
              type="supply"
              positions={positions || []}
              isLoading={isLoading}
              onAction={handleAction}
            />
            <PositionsSummary
              type="borrow"
              positions={positions || []}
              isLoading={isLoading}
              onAction={handleAction}
            />
          </div>
          <div>
            <HealthFactorCard
              healthFactor={summary?.healthFactor ?? Infinity}
              isLoading={isLoading}
            />
          </div>
        </div>

        <Tabs defaultValue="supply" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="supply" data-testid="tab-supply">
              Supply Markets
            </TabsTrigger>
            <TabsTrigger value="borrow" data-testid="tab-borrow">
              Borrow Markets
            </TabsTrigger>
          </TabsList>
          <TabsContent value="supply" className="mt-6">
            <AssetTable
              title="Assets to Supply"
              type="supply"
              markets={markets || []}
              positions={positions}
              isLoading={isLoading}
              onAction={handleAction}
            />
          </TabsContent>
          <TabsContent value="borrow" className="mt-6">
            <AssetTable
              title="Assets to Borrow"
              type="borrow"
              markets={markets || []}
              positions={positions}
              isLoading={isLoading}
              onAction={handleAction}
            />
          </TabsContent>
        </Tabs>
      </div>

      <TransactionModal
        isOpen={transactionModal.isOpen}
        onClose={handleCloseModal}
        type={transactionModal.type}
        asset={transactionModal.asset}
        assetName={transactionModal.assetName}
        walletBalance={wallet.balance?.[transactionModal.asset] || "0"}
        currentPosition={
          transactionModal.type === "withdraw"
            ? position?.suppliedAmount
            : transactionModal.type === "repay"
            ? position?.borrowedAmount
            : undefined
        }
        preview={preview || null}
        supportsPermit={assetInfo?.supportsPermit}
        onConfirm={handleConfirmTransaction}
        onAmountChange={setModalAmount}
        transactionState={transactionState}
        txHash={txHash}
        error={txError}
      />
    </div>
  );
}
