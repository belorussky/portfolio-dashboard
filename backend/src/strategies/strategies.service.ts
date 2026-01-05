import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateStrategyInput } from './dto/create-strategy.input';

@Injectable()
export class StrategiesService {
    constructor(private readonly prisma: PrismaService) {}

    async list() {
        return this.prisma.strategy.findMany({ orderBy: { id: 'desc' } });
    }

    async create(input: CreateStrategyInput) {
        if (input.type === 'MA_CROSS') {
            if (!input.shortWindow || !input.longWindow) {
                throw new BadRequestException('MA_CROSS requires shortWindow and longWindow');
            }
            if (input.shortWindow >= input.longWindow) {
                throw new BadRequestException('shortWindow must be < longWindow');
            }
        }
        return this.prisma.strategy.create({ data: input });
    }

    async remove(id: number) {
        // delete related runs first (simple cascade behavior at app level)
        await this.prisma.backtestRun.deleteMany({ where: { strategyId: id } });
        return this.prisma.strategy.delete({ where: { id } });
    }
}


