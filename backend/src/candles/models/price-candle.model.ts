import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PriceCandle {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  assetId: number;

  @Field()
  timeframe: string;

  @Field()
  time: Date;

  @Field(() => Float)
  open: number;

  @Field(() => Float)
  high: number;

  @Field(() => Float)
  low: number;

  @Field(() => Float)
  close: number;

  @Field(() => Float, { nullable: true })
  volume?: number;
}
