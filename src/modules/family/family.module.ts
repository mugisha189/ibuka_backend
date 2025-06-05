import { Module } from '@nestjs/common';
import { FamilyController } from './family.controller';
import { FamilyService } from './family.service';
import { MembersRepository } from './models/members.repository';
import { FamilyRepository } from './models/family.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyEntity } from './models/family.entity';
import { MembersEntity } from './models/members.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FilesModule } from '../files/files.module';

@Module({
    imports: [TypeOrmModule.forFeature([FamilyEntity, MembersEntity]), FilesModule],
    controllers: [FamilyController],
    providers: [FamilyService, MembersRepository, FamilyRepository,  CloudinaryService],
    exports: [FamilyService]
})
export class FamilyModule {}