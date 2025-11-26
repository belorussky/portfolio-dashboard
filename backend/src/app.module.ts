import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssetsModule } from './assets/assets.module';
import { AssetsService } from './assets/assets.service';
import { AssetsResolver } from './assets/assets.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true, //code-first, schema generated automatically
      sortSchema: true,
      playground: true, //GraphQl playground at /graphql
    }),
    PrismaModule,
    AssetsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AssetsService,
    AssetsResolver,
  ],
})
export class AppModule {}
