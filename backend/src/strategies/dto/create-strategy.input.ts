import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateStrategyInput {
  @Field()
  name: string;

  @Field()
  type: string; // "MA_CROSS" | "BUY_HOLD"

  @Field(() => Int, { nullable: true })
  shortWindow?: number;

  @Field(() => Int, { nullable: true })
  longWindow?: number;
}
