import { Field, Int, ObjectType } from '@nestjs/graphql';
import { WatchlistItem } from 'src/watchlists/models/watchlist.model';

@ObjectType()
export class Asset {
    @Field(() => Int)
    id: number;

    @Field(() => String)
    name: string;

    @Field(() => String)
    symbol: string;
}