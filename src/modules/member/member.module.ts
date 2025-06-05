import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { MembersRepository } from './models/members.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersEntity } from './models/members.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FilesModule } from '../files/files.module';

@Module({
    imports: [TypeOrmModule.forFeature([ MembersEntity]), FilesModule],
    controllers: [MemberController],
    providers: [MemberService, MembersRepository, CloudinaryService],
    exports: [MemberService]
})
export class MemberModule {}