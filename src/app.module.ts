import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { SharedModule } from './shared/shared.module';
import { LoggerMiddleware } from './middleware';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProfileModule } from './modules/profile/profile.module';
import { BullModule } from '@nestjs/bull';
import { HealthModule } from './modules/health/health.module';
import { ConfigService } from '@nestjs/config';
import { FamilyModule } from './modules/family/family.module';
import { HelpingModule } from './modules/help/helping.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RolesModule } from './modules/roles/roles.module';
import config from './config';
import { FilesModule } from './modules/files/files.module';
import { MemberModule } from './modules/member/member.module';
import { TestimonialModule } from './modules/testimonials/testimonial.module';
import { MemorialsModule } from './modules/memorials/memorials.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [...Object.values(config)],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST') || 'redis-14099.c10.us-east-1-2.ec2.redns.redis-cloud.com',
          port: parseInt(configService.get<string>('REDIS_PORT')!, 10) || 14099,
          password: configService.get<string>('REDIS_PASSWORD') || '5YgCbziHBoodq6q6RuYPz99MJGkcWNPq', // ✅ Add password
        },
      }),
      inject: [ConfigService],
    }),
    JwtModule.register({ global: true }),
    DatabaseModule,
    SharedModule,
    HealthModule,
    AuthModule,
    UsersModule,
    FamilyModule,
    MemberModule,
    TestimonialModule,
    MemorialsModule,
    ProfileModule,
    HelpingModule,
    CloudinaryModule,
    RolesModule,
    PermissionsModule,
    FilesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

