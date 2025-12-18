import { Module } from '@nestjs/common';
import { CandlesResolver } from './candles.resolver';
import { CandlesService } from './candles.service';

@Module({
  providers: [CandlesResolver, CandlesService]
})
export class CandlesModule {}
