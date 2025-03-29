import { Module } from '@nestjs/common';
import { DonorRepository } from './model/donor.repository';
import { HelpingRepository } from './model/helping.repository';
import { HelpingService } from './helping.service';
import { HelpingController } from './helping.controller';
import { DonorEntity } from './model/donor.entity';
import { HelpingEntity } from './model/helping.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([DonorEntity, HelpingEntity])],
    controllers: [HelpingController],
    providers: [DonorRepository, HelpingRepository, HelpingService],
    exports: [HelpingService]
})
export class HelpingModule {}