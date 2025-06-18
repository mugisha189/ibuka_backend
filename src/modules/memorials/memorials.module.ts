import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemorialsService } from './memorials.service';
import { MemorialsController } from './memorials.controller';
import { MemorialsRepository } from './models/memorials.repository';
import { MemorialsEntity } from './models/memorials.entity';


@Module({
  imports: [TypeOrmModule.forFeature([MemorialsEntity])],
  controllers: [MemorialsController],
  providers: [MemorialsService, MemorialsRepository],
  exports: [MemorialsService, MemorialsRepository],
})
export class MemorialsModule {} 