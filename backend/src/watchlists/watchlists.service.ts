import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Watchlist } from './models/watchlist.model';

@Injectable()
export class WatchlistsService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<Watchlist[]> {
        const watchlists = await this.prisma.watchlist.findMany({
            include: {
                items: {
                    include: {
                        asset: true,
                    },
                },
            },
            orderBy: { id: 'asc' },
        });
        // Return as-is; field names align with our GraphQL models
        return watchlists as unknown as Watchlist[];
    }

    async addItemToWatchlist(watchlistId: number, assetId: number): Promise<Watchlist> {
        // avoid duplicates (optional but nice)
        const existing = await this.prisma.watchlistItem.findFirst({
          where: { watchlistId, assetId },
        });
    
        if (!existing) {
          await this.prisma.watchlistItem.create({
            data: {
              watchlistId,
              assetId,
            },
          });
        }
    
        const watchlist = await this.prisma.watchlist.findUnique({
          where: { id: watchlistId },
          include: {
            items: {
              include: { asset: true },
            },
          },
        });
    
        if (!watchlist) {
          throw new NotFoundException('Watchlist not found');
        }
    
        return watchlist as unknown as Watchlist;
    }

    async removeItemFromWatchlist(itemId: number): Promise<Watchlist> {
        const item = await this.prisma.watchlistItem.findUnique({
          where: { id: itemId },
        });
    
        if (!item) {
          throw new NotFoundException('Watchlist item not found');
        }
    
        await this.prisma.watchlistItem.delete({
          where: { id: itemId },
        });
    
        const watchlist = await this.prisma.watchlist.findUnique({
          where: { id: item.watchlistId },
          include: {
            items: {
              include: { asset: true },
            },
          },
        });
    
        if (!watchlist) {
          throw new NotFoundException('Watchlist not found');
        }
    
        return watchlist as unknown as Watchlist;
    }
}
