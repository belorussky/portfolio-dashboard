import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BacktestRun } from './models/backtest-run.model';
import { BacktestsService } from './backtests.service';
import { SaveBacktestRunInput } from './dto/save-backtest-run.input';

@Resolver(() => BacktestRun)
export class BacktestsResolver {
    constructor(private readonly backtestsService: BacktestsService) {}

    @Query(() => [BacktestRun])
    async backtestRuns(@Args('limit', { type: () => Int, defaultValue: 20 }) limit: number): Promise<BacktestRun[]> {
        const runs = await this.backtestsService.listLatest(limit);
        return runs.map(run => ({
            ...run,
            strategy: {
                ...run.strategy,
                shortWindow: run.strategy.shortWindow ?? undefined,
                longWindow: run.strategy.longWindow ?? undefined,
            },
        }));
    }

    @Mutation(() => BacktestRun)
    async saveBacktestRun(@Args('input') input: SaveBacktestRunInput): Promise<BacktestRun> {
        const run = await this.backtestsService.save(input);
        return {
            ...run,
            strategy: {
                ...run.strategy,
                shortWindow: run.strategy.shortWindow ?? undefined,
                longWindow: run.strategy.longWindow ?? undefined,
            },
        };
    }
}
