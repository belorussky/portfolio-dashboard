import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Asset {
    @Field(() => ID)
    id: string;

    @Field(() => String)
    name: string;

    @Field(() => String)
    symbol: string;
}