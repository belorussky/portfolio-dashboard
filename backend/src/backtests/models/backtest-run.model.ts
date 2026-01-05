import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Strategy } from '../../strategies/models/strategy.model';
import { Asset } from '../../assets/models/asset.model';

@ObjectType()
export class BacktestRun {
  @Field(() => Int)
  id: number;

  @Field(() => Asset)
  asset: Asset;

  @Field(() => Strategy)
  strategy: Strategy;

  @Field()
  timeframe: string;

  @Field(() => Int)
  bars: number;

  @Field(() => Int)
  trades: number;

  @Field(() => Float)
  profit: number;

  @Field(() => Float)
  maxDrawdown: number;

  @Field()
  createdAt: Date;
}
