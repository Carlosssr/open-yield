import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { transactionRequestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/markets", async (req, res) => {
    try {
      const networkId = parseInt(req.query.networkId as string) || 1;
      const markets = await storage.getMarkets(networkId);
      res.json(markets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch markets" });
    }
  });

  app.get("/api/positions", async (req, res) => {
    try {
      const networkId = parseInt(req.query.networkId as string) || 1;
      const address = (req.query.address as string) || "";
      
      if (!address) {
        return res.status(400).json({ error: "Address is required" });
      }
      
      const positions = await storage.getPositions(networkId, address);
      res.json(positions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch positions" });
    }
  });

  app.get("/api/portfolio", async (req, res) => {
    try {
      const networkId = parseInt(req.query.networkId as string) || 1;
      const address = (req.query.address as string) || "";
      
      if (!address) {
        return res.status(400).json({ error: "Address is required" });
      }
      
      const summary = await storage.getPortfolioSummary(networkId, address);
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch portfolio summary" });
    }
  });

  app.get("/api/preview", async (req, res) => {
    try {
      const type = req.query.type as string;
      const asset = req.query.asset as string;
      const amount = req.query.amount as string || "0";
      const networkId = parseInt(req.query.networkId as string) || 1;
      const address = req.query.address as string;
      
      if (!type || !asset) {
        return res.status(400).json({ error: "Type and asset are required" });
      }
      
      if (!address) {
        return res.status(400).json({ error: "Address is required" });
      }
      
      const preview = await storage.getTransactionPreview(type, asset, amount, networkId, address);
      res.json(preview);
    } catch (error) {
      res.status(500).json({ error: "Failed to get transaction preview" });
    }
  });

  app.post("/api/transaction", async (req, res) => {
    try {
      const parsed = transactionRequestSchema.safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid transaction request", details: parsed.error.errors });
      }
      
      const { type, asset, amount, networkId, usePermit } = parsed.data;
      const address = req.body.address as string;
      
      if (!address) {
        return res.status(400).json({ error: "Address is required" });
      }
      
      const result = await storage.executeTransaction(
        type,
        asset,
        amount,
        networkId,
        address,
        usePermit || false
      );
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Transaction failed" });
    }
  });

  return httpServer;
}
