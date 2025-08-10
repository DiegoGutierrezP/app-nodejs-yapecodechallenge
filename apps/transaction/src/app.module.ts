import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PresentationLayerModule } from './presentation/presentation.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PresentationLayerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
