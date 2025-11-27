import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface LivePrice {
  symbol: string;
  price: number;
}

@Injectable()
export class PricesService implements OnModuleInit {
  private readonly logger = new Logger(PricesService.name);
  private prices: Map<string, number> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    // Initialize prices from assets
    const assets = await this.prisma.asset.findMany();
    assets.forEach(asset => {
      // random base price for demo
      const base = 100 + Math.random() * 200;
      this.prices.set(asset.symbol, Number(base.toFixed(2)));
    });

    this.logger.log(`Initialized prices for ${this.prices.size} assets`);
  }

  getAllPrices(): LivePrice[] {
    return Array.from(this.prices.entries()).map(([symbol, price]) => ({
      symbol,
      price,
    }));
  }

  // Simulate random price changes
  tick(): LivePrice[] {
    const updated: LivePrice[] = [];

    this.prices.forEach((price, symbol) => {
      const delta = (Math.random() - 0.5) * 2; // -1..1
      const newPrice = Math.max(1, price + delta);
      const rounded = Number(newPrice.toFixed(2));
      this.prices.set(symbol, rounded);
      updated.push({ symbol, price: rounded });
    });

    return updated;
  }
}
