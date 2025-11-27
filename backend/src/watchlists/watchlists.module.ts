import { Module } from '@nestjs/common';
import { WatchlistsResolver } from './watchlists.resolver';
import { WatchlistsService } from './watchlists.service';

@Module({
  providers: [WatchlistsResolver, WatchlistsService]
})
export class WatchlistsModule {}
