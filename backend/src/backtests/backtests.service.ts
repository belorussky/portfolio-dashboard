import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { SaveBacktestRunInput } from './dto/save-backtest-run.input';

@Injectable()
export class BacktestsService {
    constructor(private readonly prisma: PrismaService) {}

    async save(input: SaveBacktestRunInput) {
        return this.prisma.backtestRun.create({ 
            data: input,
            include: {
                asset: true,
                strategy: true,
            },
        });
    }

    async listLatest(limit: number = 20) {
        return this.prisma.backtestRun.findMany({ 
            orderBy: { createdAt: 'desc' },
            take: Math.min(Math.max(limit, 1), 100),
            include: {
                asset: true,
                strategy: true,
            },
        });
    }
}
