import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Asset } from '../../assets/models/asset.model';

@ObjectType()
export class WatchlistItem {
  @Field(() => Int)
  id: number;

  @Field(() => Asset)
  asset: Asset;
}

@ObjectType()
export class Watchlist {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => [WatchlistItem])
  items: WatchlistItem[];
}
