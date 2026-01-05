import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Strategy {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  type: string; // "MA_CROSS" | "BUY_HOLD"

  @Field(() => Int, { nullable: true })
  shortWindow?: number;

  @Field(() => Int, { nullable: true })
  longWindow?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
