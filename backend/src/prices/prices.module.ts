import { Module } from '@nestjs/common';
import { PricesGateway } from './prices.gateway';
import { PricesService } from './prices.service';

@Module({
    providers: [PricesService, PricesGateway],
})
export class PricesModule {}
