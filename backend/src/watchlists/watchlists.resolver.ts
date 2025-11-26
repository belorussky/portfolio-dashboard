import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Watchlist } from './models/watchlist.model';
import { WatchlistsService } from './watchlists.service';

@Resolver(() => Watchlist)
export class WatchlistsResolver {
    constructor(private readonly watchlistsService: WatchlistsService) {}

    @Query(() => [Watchlist], { name: 'watchlists' })
    async findAll(): Promise<Watchlist[]> {
        return this.watchlistsService.findAll();
    }

    @Mutation(() => Watchlist)
    async addWatchlistItem(
        @Args('watchlistId', { type: () => Int }) watchlistId: number,
        @Args('assetId', { type: () => Int }) assetId: number,
    ): Promise<Watchlist> {
        return this.watchlistsService.addItemToWatchlist(watchlistId, assetId);
    }

    @Mutation(() => Watchlist)
    async removeWatchlistItem(
        @Args('itemId', { type: () => Int }) itemId: number,
    ): Promise<Watchlist> {
        return this.watchlistsService.removeItemFromWatchlist(itemId);
    }
}
