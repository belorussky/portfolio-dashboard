import { Resolver, Query } from '@nestjs/graphql';
import { Watchlist } from './models/watchlist.model';
import { WatchlistsService } from './watchlists.service';

@Resolver(() => Watchlist)
export class WatchlistsResolver {
    constructor(private readonly watchlistsService: WatchlistsService) {}

    @Query(() => [Watchlist], { name: 'watchlists' })
    async findAll(): Promise<Watchlist[]> {
        return this.watchlistsService.findAll();
    }
}
