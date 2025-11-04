import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource, { ormconfig } from './ormconfig';
import { TasksModule } from './tasks/tasks.module';
import { ObjectIdScalar } from './common/mongo-id.scalar';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ormconfig,
      dataSourceFactory: async () => dataSource.initialize(),
    }),
    TasksModule, 
  ],
  providers: [ObjectIdScalar],
})
export class AppModule {}
