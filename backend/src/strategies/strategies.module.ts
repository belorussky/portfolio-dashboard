import { Module } from '@nestjs/common';
import { StrategiesResolver } from './strategies.resolver';
import { StrategiesService } from './strategies.service';

@Module({
  providers: [StrategiesResolver, StrategiesService]
})
export class StrategiesModule {}
