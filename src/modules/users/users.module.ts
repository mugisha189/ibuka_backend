import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from './model/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleRepository } from '../roles/model/role.repository';
import { UserRepository } from './model/user.repository';
import { ResetPasswordService } from '../reset-password/reset-password.service';
import { OTPModule } from '../otp/otp.module';
import { ResetPasswordModule } from '../reset-password/reset-password.module';
import { MailerService } from 'src/shared/mailer/mailer.service';
import { TokensModule } from '../tokens/token.module';
import { FilesModule } from '../files/files.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    OTPModule,
    TokensModule,
    ResetPasswordModule,
    FilesModule
  ],
  controllers: [UsersController],
  providers: [UsersService, RoleRepository, ResetPasswordService, UserRepository, MailerService],
  exports: [UsersService, UserRepository]
})
export class UsersModule {};