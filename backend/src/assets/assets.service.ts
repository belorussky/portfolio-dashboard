import { Injectable } from '@nestjs/common';
import { Asset } from './models/asset.model';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AssetsService {
    constructor(private readonly prisma: PrismaService) {}
    
    async findAll(): Promise<Asset[]> {
        const assets = this.prisma.asset.findMany({
            orderBy: {
                symbol: 'asc',
            },
        });

        return assets as unknown as Asset[];
    }
}
