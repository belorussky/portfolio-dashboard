import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { CandlesService } from './candles.service';
import { PriceCandle } from './models/price-candle.model';

@Resolver(() => PriceCandle)
export class CandlesResolver {
  constructor(private readonly candlesService: CandlesService) {}

  @Query(() => [PriceCandle])
  async priceCandles(
    @Args('assetId', { type: () => Int }) assetId: number,
    @Args('timeframe', { type: () => String, defaultValue: '1D' }) timeframe: string,
    @Args('limit', { type: () => Int, defaultValue: 200 }) limit: number,
  ) {
    return this.candlesService.getCandles({ assetId, timeframe, limit });
  }
}
