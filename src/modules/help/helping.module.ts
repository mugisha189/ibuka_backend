import { Module } from '@nestjs/common';
import { DonorRepository } from './model/donor.repository';
import { HelpingRepository } from './model/helping.repository';
import { HelpingService } from './helping.service';
import { HelpingController } from './helping.controller';
import { DonorEntity } from './model/donor.entity';
import { HelpingEntity } from './model/helping.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyRepository } from '../family/models/family.repository';
import { MembersRepository } from '../member/models/members.repository';

@Module({
    imports: [TypeOrmModule.forFeature([DonorEntity, HelpingEntity])],
    controllers: [HelpingController],
    providers: [DonorRepository, HelpingRepository, HelpingService, MembersRepository, FamilyRepository],
    exports: [HelpingService]
})
export class HelpingModule {}