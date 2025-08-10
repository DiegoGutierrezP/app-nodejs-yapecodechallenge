import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from '../../shared/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.dbHost,
      port: envs.dbPort,
      username: envs.dbUsername,
      password: envs.dbPassword,
      database: envs.dbName,
      synchronize: true, // watch out!
      autoLoadEntities: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class DatabaseModule {}
