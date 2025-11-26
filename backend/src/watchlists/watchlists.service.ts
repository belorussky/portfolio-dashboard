import { Injectable } from '@nestjs/common';
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
}
