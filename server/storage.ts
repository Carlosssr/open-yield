import type {
  MarketData,
  UserPosition,
  PortfolioSummary,
  TransactionPreview,
  TransactionResponse,
} from "@shared/schema";

export interface IStorage {
  getMarkets(networkId: number): Promise<MarketData[]>;
  getPositions(networkId: number, address: string): Promise<UserPosition[]>;
  getPortfolioSummary(networkId: number, address: string): Promise<PortfolioSummary>;
  getTransactionPreview(
    type: string,
    asset: string,
    amount: string,
    networkId: number,
    address: string
  ): Promise<TransactionPreview>;
  executeTransaction(
    type: string,
    asset: string,
    amount: string,
    networkId: number,
    address: string,
    usePermit: boolean
  ): Promise<TransactionResponse>;
}

const mockMarkets: MarketData[] = [
  {
    symbol: "ETH",
    name: "Ethereum",
    supplyAPY: 2.45,
    borrowAPY: 3.82,
    totalSupply: "125000",
    totalBorrow: "45000",
    availableLiquidity: "80000",
    utilizationRate: 36,
    collateralFactor: 0.8,
    liquidationThreshold: 0.85,
    priceUSD: 2245.50,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    supplyAPY: 4.12,
    borrowAPY: 5.67,
    totalSupply: "8500000",
    totalBorrow: "3200000",
    availableLiquidity: "5300000",
    utilizationRate: 37.6,
    collateralFactor: 0.85,
    liquidationThreshold: 0.9,
    priceUSD: 1.0,
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    supplyAPY: 3.89,
    borrowAPY: 5.23,
    totalSupply: "4200000",
    totalBorrow: "1800000",
    availableLiquidity: "2400000",
    utilizationRate: 42.8,
    collateralFactor: 0.82,
    liquidationThreshold: 0.87,
    priceUSD: 1.0,
  },
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    supplyAPY: 1.23,
    borrowAPY: 2.45,
    totalSupply: "850",
    totalBorrow: "220",
    availableLiquidity: "630",
    utilizationRate: 25.9,
    collateralFactor: 0.75,
    liquidationThreshold: 0.8,
    priceUSD: 43250.00,
  },
];

function getAssetPrice(symbol: string): number {
  const market = mockMarkets.find(m => m.symbol === symbol);
  return market?.priceUSD || 1;
}

function getCollateralFactor(symbol: string): number {
  const market = mockMarkets.find(m => m.symbol === symbol);
  return market?.collateralFactor || 0.75;
}

export class MemStorage implements IStorage {
  private positions: Map<string, UserPosition[]>;

  constructor() {
    this.positions = new Map();
    const defaultAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f8c2B1".toLowerCase();
    const defaultPositions: UserPosition[] = [
      {
        symbol: "ETH",
        name: "Ethereum",
        suppliedAmount: "1.5",
        suppliedValueUSD: 3368.25,
        borrowedAmount: "0",
        borrowedValueUSD: 0,
        isCollateral: true,
        supplyAPY: 2.45,
        borrowAPY: 3.82,
      },
      {
        symbol: "USDC",
        name: "USD Coin",
        suppliedAmount: "5000",
        suppliedValueUSD: 5000,
        borrowedAmount: "1500",
        borrowedValueUSD: 1500,
        isCollateral: true,
        supplyAPY: 4.12,
        borrowAPY: 5.67,
      },
      {
        symbol: "DAI",
        name: "Dai Stablecoin",
        suppliedAmount: "0",
        suppliedValueUSD: 0,
        borrowedAmount: "0",
        borrowedValueUSD: 0,
        isCollateral: false,
        supplyAPY: 3.89,
        borrowAPY: 5.23,
      },
      {
        symbol: "WBTC",
        name: "Wrapped Bitcoin",
        suppliedAmount: "0.05",
        suppliedValueUSD: 2162.50,
        borrowedAmount: "0",
        borrowedValueUSD: 0,
        isCollateral: true,
        supplyAPY: 1.23,
        borrowAPY: 2.45,
      },
    ];
    // Initialize positions for all networks for demo account
    [1, 42161, 10, 8453].forEach(networkId => {
      this.positions.set(`${networkId}:${defaultAddress}`, JSON.parse(JSON.stringify(defaultPositions)));
    });
  }

  private getPositionsKey(networkId: number, address: string): string {
    return `${networkId}:${address.toLowerCase()}`;
  }

  async getMarkets(networkId: number): Promise<MarketData[]> {
    const networkMultiplier = 1 + (networkId % 10) * 0.02;
    return mockMarkets.map((market) => ({
      ...market,
      supplyAPY: parseFloat((market.supplyAPY * networkMultiplier).toFixed(2)),
      borrowAPY: parseFloat((market.borrowAPY * networkMultiplier).toFixed(2)),
    }));
  }

  async getPositions(networkId: number, address: string): Promise<UserPosition[]> {
    const key = this.getPositionsKey(networkId, address);
    const positions = this.positions.get(key);
    if (!positions) {
      return mockMarkets.map((market) => ({
        symbol: market.symbol,
        name: market.name,
        suppliedAmount: "0",
        suppliedValueUSD: 0,
        borrowedAmount: "0",
        borrowedValueUSD: 0,
        isCollateral: false,
        supplyAPY: market.supplyAPY,
        borrowAPY: market.borrowAPY,
      }));
    }
    return positions;
  }

  private calculateHealthFactor(positions: UserPosition[]): number {
    let totalCollateralValue = 0;
    let totalBorrowedUSD = 0;

    positions.forEach((pos) => {
      if (pos.isCollateral && pos.suppliedValueUSD > 0) {
        const collateralFactor = getCollateralFactor(pos.symbol);
        totalCollateralValue += pos.suppliedValueUSD * collateralFactor;
      }
      totalBorrowedUSD += pos.borrowedValueUSD;
    });

    if (totalBorrowedUSD === 0) return Infinity;
    return totalCollateralValue / totalBorrowedUSD;
  }

  async getPortfolioSummary(
    networkId: number,
    address: string
  ): Promise<PortfolioSummary> {
    const positions = await this.getPositions(networkId, address);

    let totalSuppliedUSD = 0;
    let totalBorrowedUSD = 0;
    let weightedSupplyAPY = 0;
    let weightedBorrowAPY = 0;
    let totalCollateralValue = 0;

    positions.forEach((pos) => {
      totalSuppliedUSD += pos.suppliedValueUSD;
      totalBorrowedUSD += pos.borrowedValueUSD;
      weightedSupplyAPY += pos.suppliedValueUSD * pos.supplyAPY;
      weightedBorrowAPY += pos.borrowedValueUSD * pos.borrowAPY;
      
      if (pos.isCollateral && pos.suppliedValueUSD > 0) {
        const collateralFactor = getCollateralFactor(pos.symbol);
        totalCollateralValue += pos.suppliedValueUSD * collateralFactor;
      }
    });

    const avgSupplyAPY = totalSuppliedUSD > 0 ? weightedSupplyAPY / totalSuppliedUSD : 0;
    const avgBorrowAPY = totalBorrowedUSD > 0 ? weightedBorrowAPY / totalBorrowedUSD : 0;
    const netAPY = totalSuppliedUSD > 0
      ? ((avgSupplyAPY * totalSuppliedUSD - avgBorrowAPY * totalBorrowedUSD) / totalSuppliedUSD)
      : 0;

    const healthFactor = this.calculateHealthFactor(positions);
    const maxBorrowUSD = Math.max(0, totalCollateralValue - totalBorrowedUSD);
    const borrowingPower = totalCollateralValue > 0 ? (maxBorrowUSD / totalCollateralValue) * 100 : 0;

    return {
      totalSuppliedUSD: parseFloat(totalSuppliedUSD.toFixed(2)),
      totalBorrowedUSD: parseFloat(totalBorrowedUSD.toFixed(2)),
      netAPY: parseFloat(netAPY.toFixed(2)),
      healthFactor: healthFactor === Infinity ? Infinity : parseFloat(healthFactor.toFixed(2)),
      borrowingPower: parseFloat(borrowingPower.toFixed(2)),
      maxBorrowUSD: parseFloat(maxBorrowUSD.toFixed(2)),
    };
  }

  async getTransactionPreview(
    type: string,
    asset: string,
    amount: string,
    networkId: number,
    address: string
  ): Promise<TransactionPreview> {
    const positions = await this.getPositions(networkId, address);
    const amountNum = parseFloat(amount) || 0;
    const assetPrice = getAssetPrice(asset);
    const amountUSD = amountNum * assetPrice;
    const collateralFactor = getCollateralFactor(asset);

    const currentHealthFactor = this.calculateHealthFactor(positions);
    
    const simulatedPositions = positions.map(p => {
      if (p.symbol !== asset) return { ...p };
      
      const pos = { ...p };
      switch (type) {
        case "supply":
          pos.suppliedAmount = (parseFloat(p.suppliedAmount) + amountNum).toString();
          pos.suppliedValueUSD = p.suppliedValueUSD + amountUSD;
          pos.isCollateral = true;
          break;
        case "withdraw":
          pos.suppliedAmount = Math.max(0, parseFloat(p.suppliedAmount) - amountNum).toString();
          pos.suppliedValueUSD = Math.max(0, p.suppliedValueUSD - amountUSD);
          break;
        case "borrow":
          pos.borrowedAmount = (parseFloat(p.borrowedAmount) + amountNum).toString();
          pos.borrowedValueUSD = p.borrowedValueUSD + amountUSD;
          break;
        case "repay":
          pos.borrowedAmount = Math.max(0, parseFloat(p.borrowedAmount) - amountNum).toString();
          pos.borrowedValueUSD = Math.max(0, p.borrowedValueUSD - amountUSD);
          break;
      }
      return pos;
    });

    const newHealthFactor = this.calculateHealthFactor(simulatedPositions);
    
    let totalCollateralValue = 0;
    let totalBorrowedUSD = 0;
    simulatedPositions.forEach((pos) => {
      if (pos.isCollateral && pos.suppliedValueUSD > 0) {
        totalCollateralValue += pos.suppliedValueUSD * getCollateralFactor(pos.symbol);
      }
      totalBorrowedUSD += pos.borrowedValueUSD;
    });
    const newBorrowingPower = totalCollateralValue > 0 
      ? ((totalCollateralValue - totalBorrowedUSD) / totalCollateralValue) * 100 
      : 0;

    let currentCollateralValue = 0;
    let currentBorrowedUSD = 0;
    positions.forEach((pos) => {
      if (pos.isCollateral && pos.suppliedValueUSD > 0) {
        currentCollateralValue += pos.suppliedValueUSD * getCollateralFactor(pos.symbol);
      }
      currentBorrowedUSD += pos.borrowedValueUSD;
    });
    const currentBorrowingPower = currentCollateralValue > 0 
      ? ((currentCollateralValue - currentBorrowedUSD) / currentCollateralValue) * 100 
      : 0;

    return {
      currentHealthFactor: currentHealthFactor === Infinity ? 99 : parseFloat(currentHealthFactor.toFixed(2)),
      newHealthFactor: newHealthFactor === Infinity ? 99 : parseFloat(newHealthFactor.toFixed(2)),
      currentBorrowingPower: parseFloat(currentBorrowingPower.toFixed(2)),
      newBorrowingPower: parseFloat(Math.max(0, newBorrowingPower).toFixed(2)),
      estimatedGas: "0.0025 ETH",
      gasUSD: 5.61,
    };
  }

  async executeTransaction(
    type: string,
    asset: string,
    amount: string,
    networkId: number,
    address: string,
    usePermit: boolean
  ): Promise<TransactionResponse> {
    const key = this.getPositionsKey(networkId, address);
    let positions = this.positions.get(key);
    
    if (!positions) {
      positions = mockMarkets.map((market) => ({
        symbol: market.symbol,
        name: market.name,
        suppliedAmount: "0",
        suppliedValueUSD: 0,
        borrowedAmount: "0",
        borrowedValueUSD: 0,
        isCollateral: false,
        supplyAPY: market.supplyAPY,
        borrowAPY: market.borrowAPY,
      }));
    }

    const amountNum = parseFloat(amount) || 0;
    const assetPrice = getAssetPrice(asset);
    const amountUSD = amountNum * assetPrice;

    const updatedPositions = positions.map(p => {
      if (p.symbol !== asset) return p;
      
      const pos = { ...p };
      switch (type) {
        case "supply":
          pos.suppliedAmount = (parseFloat(p.suppliedAmount) + amountNum).toString();
          pos.suppliedValueUSD = p.suppliedValueUSD + amountUSD;
          pos.isCollateral = true;
          break;
        case "withdraw":
          pos.suppliedAmount = Math.max(0, parseFloat(p.suppliedAmount) - amountNum).toString();
          pos.suppliedValueUSD = Math.max(0, p.suppliedValueUSD - amountUSD);
          if (parseFloat(pos.suppliedAmount) === 0) pos.isCollateral = false;
          break;
        case "borrow":
          pos.borrowedAmount = (parseFloat(p.borrowedAmount) + amountNum).toString();
          pos.borrowedValueUSD = p.borrowedValueUSD + amountUSD;
          break;
        case "repay":
          pos.borrowedAmount = Math.max(0, parseFloat(p.borrowedAmount) - amountNum).toString();
          pos.borrowedValueUSD = Math.max(0, p.borrowedValueUSD - amountUSD);
          break;
      }
      return pos;
    });

    this.positions.set(key, updatedPositions);

    const hash = `0x${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")}`;

    return {
      hash,
      status: "success",
      type: type as "supply" | "withdraw" | "borrow" | "repay",
      asset,
      amount,
      timestamp: Date.now(),
    };
  }
}

export const storage = new MemStorage();
