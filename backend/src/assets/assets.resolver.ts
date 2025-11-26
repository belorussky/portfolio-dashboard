import { Resolver, Query } from '@nestjs/graphql';
import { Asset } from './models/asset.model';
import { AssetsService } from './assets.service';

@Resolver(() => Asset)
export class AssetsResolver {
    constructor(private readonly assetsService: AssetsService) {}

    @Query(() => [Asset], { name: 'assets' })
    async findAll(): Promise<Asset[]> {
        return this.assetsService.findAll();
    }
}
