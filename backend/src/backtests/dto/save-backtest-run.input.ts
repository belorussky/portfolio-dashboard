import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SaveBacktestRunInput {
  @Field(() => Int)
  assetId: number;

  @Field(() => Int)
  strategyId: number;

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
}
