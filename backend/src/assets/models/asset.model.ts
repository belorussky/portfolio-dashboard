import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Asset {
    @Field(() => Int)
    id: number;

    @Field(() => String)
    name: string;

    @Field(() => String)
    symbol: string;
}