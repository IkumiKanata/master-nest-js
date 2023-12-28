import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  //InjectしたいRepositoryのEntityをここに入れる
  imports: [TypeOrmModule.forFeature([Event])],
})
export class EventsModule {}
