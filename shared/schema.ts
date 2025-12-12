import { z } from "zod";

// Supported networks
export const networks = [
  { id: 1, name: "Ethereum", symbol: "ETH", icon: "ethereum" },
  { id: 42161, name: "Arbitrum", symbol: "ARB", icon: "arbitrum" },
  { id: 10, name: "Optimism", symbol: "OP", icon: "optimism" },
  { id: 8453, name: "Base", symbol: "BASE", icon: "base" },
] as const;

export type Network = typeof networks[number];

// Supported assets
export const assets = [
  { symbol: "ETH", name: "Ethereum", decimals: 18, supportsPermit: false },
  { symbol: "USDC", name: "USD Coin", decimals: 6, supportsPermit: true },
  { symbol: "DAI", name: "Dai Stablecoin", decimals: 18, supportsPermit: true },
  { symbol: "WBTC", name: "Wrapped Bitcoin", decimals: 8, supportsPermit: false },
] as const;

export type Asset = typeof assets[number];

// Market data for an asset
export const marketDataSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  supplyAPY: z.number(),
  borrowAPY: z.number(),
  totalSupply: z.string(),
  totalBorrow: z.string(),
  availableLiquidity: z.string(),
  utilizationRate: z.number(),
  collateralFactor: z.number(),
  liquidationThreshold: z.number(),
  priceUSD: z.number(),
});

export type MarketData = z.infer<typeof marketDataSchema>;

// User position for an asset
export const userPositionSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  suppliedAmount: z.string(),
  suppliedValueUSD: z.number(),
  borrowedAmount: z.string(),
  borrowedValueUSD: z.number(),
  isCollateral: z.boolean(),
  supplyAPY: z.number(),
  borrowAPY: z.number(),
});

export type UserPosition = z.infer<typeof userPositionSchema>;

// Portfolio summary
export const portfolioSummarySchema = z.object({
  totalSuppliedUSD: z.number(),
  totalBorrowedUSD: z.number(),
  netAPY: z.number(),
  healthFactor: z.number(),
  borrowingPower: z.number(),
  maxBorrowUSD: z.number(),
});

export type PortfolioSummary = z.infer<typeof portfolioSummarySchema>;

// Transaction types
export type TransactionType = "supply" | "withdraw" | "borrow" | "repay";

export type TransactionState = "idle" | "confirming" | "signing" | "pending" | "success" | "error";

export const transactionRequestSchema = z.object({
  type: z.enum(["supply", "withdraw", "borrow", "repay"]),
  asset: z.string(),
  amount: z.string(),
  networkId: z.number(),
  usePermit: z.boolean().optional(),
});

export type TransactionRequest = z.infer<typeof transactionRequestSchema>;

export const transactionResponseSchema = z.object({
  hash: z.string(),
  status: z.enum(["pending", "success", "failed"]),
  type: z.enum(["supply", "withdraw", "borrow", "repay"]),
  asset: z.string(),
  amount: z.string(),
  timestamp: z.number(),
});

export type TransactionResponse = z.infer<typeof transactionResponseSchema>;

// Preview transaction impact
export const transactionPreviewSchema = z.object({
  currentHealthFactor: z.number(),
  newHealthFactor: z.number(),
  currentBorrowingPower: z.number(),
  newBorrowingPower: z.number(),
  estimatedGas: z.string(),
  gasUSD: z.number(),
});

export type TransactionPreview = z.infer<typeof transactionPreviewSchema>;

// Wallet connection state
export const walletStateSchema = z.object({
  isConnected: z.boolean(),
  address: z.string().nullable(),
  networkId: z.number().nullable(),
  balance: z.record(z.string(), z.string()).optional(),
});

export type WalletState = z.infer<typeof walletStateSchema>;
