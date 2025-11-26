import { Field, ID, ObjectType } from '@nestjs/graphql';
import { WatchlistItem } from 'src/watchlists/models/watchlist.model';

@ObjectType()
export class Asset {
    @Field(() => ID)
    id: number;

    @Field(() => String)
    name: string;

    @Field(() => String)
    symbol: string;

    @Field(() => [WatchlistItem])
    watchlistItems: WatchlistItem[];
}