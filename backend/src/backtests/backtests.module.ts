import { Module } from '@nestjs/common';
import { BacktestsResolver } from './backtests.resolver';
import { BacktestsService } from './backtests.service';

@Module({
  providers: [BacktestsResolver, BacktestsService]
})
export class BacktestsModule {}
