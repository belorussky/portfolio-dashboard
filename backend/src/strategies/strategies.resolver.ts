import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Strategy } from './models/strategy.model';
import { StrategiesService } from './strategies.service';
import { CreateStrategyInput } from './dto/create-strategy.input';

@Resolver(() => Strategy)
export class StrategiesResolver {
    constructor(private readonly strategiesService: StrategiesService) {}

    @Query(() => [Strategy])
    async strategies(): Promise<Strategy[]> {
        const strategies = await this.strategiesService.list();
        return strategies.map(strategy => ({
            ...strategy,
            shortWindow: strategy.shortWindow ?? undefined,
            longWindow: strategy.longWindow ?? undefined,
        }));
    }

    @Mutation(() => Strategy)
    async createStrategy(@Args('input') input: CreateStrategyInput): Promise<Strategy> {
        const strategy = await this.strategiesService.create(input);
        return {
            ...strategy,
            shortWindow: strategy.shortWindow ?? undefined,
            longWindow: strategy.longWindow ?? undefined,
        };
    }

    @Mutation(() => Strategy)
    async removeStrategy(@Args('id', { type: () => Int }) id: number): Promise<Strategy> {
        const strategy = await this.strategiesService.remove(id);
        return {
            ...strategy,
            shortWindow: strategy.shortWindow ?? undefined,
            longWindow: strategy.longWindow ?? undefined,
        };
    }
}
