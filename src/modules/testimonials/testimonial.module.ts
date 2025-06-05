import { Module } from '@nestjs/common';
import { TestimonialController } from './testimonial.controller';
import { TestimonialService } from './testimonial.service';
import { FilesModule } from '../files/files.module';
import { TestimonialsEntity } from './models/testimonials.entity';
import { TestimonialsRepository } from './models/testimonials.repository';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([TestimonialsEntity]), FilesModule],
    controllers: [TestimonialController],
    providers: [TestimonialService,  TestimonialsRepository,  CloudinaryService],
    exports: [TestimonialService]
})
export class TestimonialModule {}