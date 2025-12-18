import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CandlesService {
  constructor(private readonly prisma: PrismaService) {}

  async getCandles(params: {
    assetId: number;
    timeframe: string;
    limit: number;
  }) {
    const { assetId, timeframe, limit } = params;

    return this.prisma.priceCandle.findMany({
      where: { assetId, timeframe },
      orderBy: { time: 'desc' },
      take: limit,
    });
  }
}

