import { Module } from '@nestjs/common';
import { FamilyController } from './family.controller';
import { FamilyService } from './family.service';
import { MembersRepository } from './models/members.repository';
import { FamilyRepository } from './models/family.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyEntity } from './models/family.entity';
import { MembersEntity } from './models/members.entity';
import { TestimonialsEntity } from './models/testimonials.entity';
import { TestimonialsRepository } from './models/testimonials.repository';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MemorialsEntity } from './models/memorials.entity';
import { MemorialsRepository } from './models/memorials.repository';

@Module({
    imports: [TypeOrmModule.forFeature([FamilyEntity, MembersEntity, TestimonialsEntity, MemorialsEntity])],
    controllers: [FamilyController],
    providers: [FamilyService, MembersRepository, FamilyRepository, TestimonialsRepository, CloudinaryService, MemorialsRepository],
    exports: [FamilyService]
})
export class FamilyModule {}