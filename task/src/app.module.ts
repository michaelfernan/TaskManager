// src/app.module.ts
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
      useFactory: async () => ormconfig, // opções do DataSource
      dataSourceFactory: async () => dataSource.initialize(), // instancia e conecta
    }),
    TasksModule, // <- depende do TypeOrmModule acima
  ],
  providers: [ObjectIdScalar],
})
export class AppModule {}
