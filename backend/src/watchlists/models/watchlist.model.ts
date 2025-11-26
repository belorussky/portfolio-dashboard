import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Asset } from '../../assets/models/asset.model';

@ObjectType()
export class WatchlistItem {
  @Field(() => ID)
  id: number;

  @Field(() => Asset)
  asset: Asset;
}

@ObjectType()
export class Watchlist {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field(() => [WatchlistItem])
  items: WatchlistItem[];
}
