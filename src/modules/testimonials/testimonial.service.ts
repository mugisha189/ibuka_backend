import { Injectable } from '@nestjs/common';
import { CreateTestimonialsDto } from './dto/create-testimonials.dto';
import { ResponseDto } from 'src/common/dtos';
import { TestimonialsRepository } from './models/testimonials.repository';
import { CustomException } from 'src/common/http/exceptions/custom.exception';
import { ResponseService } from 'src/shared/response/response.service';
import { TestimonialMapper } from './testimonial.mapper';
import { Logger } from '@nestjs/common';
import { TestimonialsDto } from './dto/testimonials.dto';
import { FilesService } from '../files/files.service';

@Injectable()
export class TestimonialService {

    constructor(
        private readonly responseService: ResponseService,
        private readonly testimonialsRepository: TestimonialsRepository,
        private readonly filesService: FilesService,
    ) { }

    private readonly logger = new Logger(TestimonialService.name);

    /**
     * Helper method to resolve testimonial files from file IDs to URLs
     * @param testimonials Array of testimonials with testimonial_files field
     */
    private async resolveTestimonialFiles(testimonials: any[]): Promise<void> {
        if (!testimonials || testimonials.length === 0) return;

        await Promise.all(
            testimonials.map(async (testimonial) => {
                if (testimonial.testimonial_files && testimonial.testimonial_files.length > 0) {
                    try {
                        // Resolve each file ID to URL
                        const fileUrls = await Promise.all(
                            testimonial.testimonial_files.map(async (fileId) => {
                                try {
                                    const fileRes = await this.filesService.getFileById(fileId, true) as any;
                                    if (fileRes && typeof fileRes === 'object' && 'url' in fileRes) {
                                        return fileRes.url;
                                    }
                                    return null;
                                } catch (e) {
                                    this.logger.warn(`Failed to resolve file ID ${fileId}: ${e.message}`);
                                    return null;
                                }
                            })
                        );
                        
                        // Filter out null values and update testimonial files
                        testimonial.testimonial_files = fileUrls.filter(url => url !== null);
                    } catch (e) {
                        this.logger.warn(`Failed to resolve files for testimonial ${testimonial.id}: ${e.message}`);
                        testimonial.testimonial_files = [];
                    }
                }
            })
        );
    }

    async createTestimonial(
        dto: CreateTestimonialsDto
    ): Promise<ResponseDto<string>> {
        try {
            const testimonial = TestimonialMapper.toCreateTestimonialsEntity(dto);
            await this.testimonialsRepository.save(testimonial);
            return this.responseService.makeResponse({
                message: `Your testimonial has been added`,
                payload: null
            })
        } catch (error) {
            console.log("the error stack is: " + error.stack);
            throw new CustomException(error);
        }
    }

    async getTestimonialsByFamily(
        familyId: string
    ): Promise<ResponseDto<TestimonialsDto[]>> {
        try {
            const testimonials = await this.testimonialsRepository.find({
                where: { familyId }
            })
            if (!testimonials) {
                return this.responseService.makeResponse({
                    message: `No testimonials found for this family`,
                    payload: []
                })
            }

            // Resolve testimonial files from file IDs to URLs
            await this.resolveTestimonialFiles(testimonials);

            const testimonialDtos = TestimonialMapper.toTestimonialsDtoList(testimonials);
            return this.responseService.makeResponse({
                message: `Testimonials retrieved`,
                payload: testimonialDtos
            })
        } catch (error) {
            throw new CustomException(error);
        }
    }

    async getTestimonialsByMember(
        id: string
    ): Promise<ResponseDto<TestimonialsDto[]>> {
        try {
            const testimonials = await this.testimonialsRepository.find({
                where: { memberId: id }
            })
            if (!testimonials) {
                return this.responseService.makeResponse({
                    message: `No testimonials found for this member`,
                    payload: []
                })
            }

            // Resolve testimonial files from file IDs to URLs
            await this.resolveTestimonialFiles(testimonials);

            const testimonialDtos = TestimonialMapper.toTestimonialsDtoList(testimonials);
            return this.responseService.makeResponse({
                message: `Testimonials retrieved`,
                payload: testimonialDtos
            })
        } catch (error) {
            throw new CustomException(error);
        }
    }

    /**
     * Get all testimonials with pagination
     * @param page Page number (default: 1)
     * @param limit Number of items per page (default: 10)
     * @param search Optional search keyword
     * @returns Paginated list of testimonials
     */
    async findAll(page = 1, limit = 10, search?: string): Promise<ResponseDto<{ data: TestimonialsDto[]; total: number; page: number; limit: number }>> {
        try {
            const queryBuilder = this.testimonialsRepository.createQueryBuilder('testimonial');
            if (search) {
                queryBuilder.where(
                    'testimonial.title ILIKE :search OR testimonial.description ILIKE :search OR testimonial.testimonial_names ILIKE :search',
                    { search: `%${search}%` }
                );
            }
            queryBuilder.orderBy('testimonial.createdAt', 'DESC');
            queryBuilder.skip((page - 1) * limit).take(limit);
            const [result, total] = await queryBuilder.getManyAndCount();
            
            // Resolve testimonial files from file IDs to URLs
            await this.resolveTestimonialFiles(result);
            
            const testimonialDtos = TestimonialMapper.toTestimonialsDtoList(result);
            return this.responseService.makeResponse({
                message: 'Testimonials retrieved',
                payload: { data: testimonialDtos, total, page, limit },
            });
        } catch (error) {
            throw new CustomException(error);
        }
    }

    /**
     * Get a single testimonial by ID
     * @param id Testimonial ID
     * @returns TestimonialDto
     */
    async findOne(id: string): Promise<ResponseDto<TestimonialsDto>> {
        try {
            const testimonial = await this.testimonialsRepository.findOne({ where: { id } });
            if (!testimonial) {
                throw new CustomException('Testimonial not found');
            }

            // Resolve testimonial files from file IDs to URLs
            await this.resolveTestimonialFiles([testimonial]);

            const testimonialDto = TestimonialMapper.toTestimonialsDto(testimonial);
            return this.responseService.makeResponse({
                message: 'Testimonial retrieved',
                payload: testimonialDto,
            });
        } catch (error) {
            throw new CustomException(error);
        }
    }

    /**
     * Update a testimonial by ID
     * @param id Testimonial ID
     * @param updateDto UpdateTestimonialDto
     * @returns Success message
     */
    async update(id: string, updateDto: any): Promise<ResponseDto<string>> {
        try {
            const testimonial = await this.testimonialsRepository.findOne({ where: { id } });
            if (!testimonial) {
                throw new CustomException('Testimonial not found');
            }
            await this.testimonialsRepository.update(id, updateDto);
            return this.responseService.makeResponse({
                message: 'Testimonial updated successfully',
                payload: null,
            });
        } catch (error) {
            throw new CustomException(error);
        }
    }

    /**
     * Delete a testimonial by ID
     * @param id Testimonial ID
     * @returns Success message
     */
    async remove(id: string): Promise<ResponseDto<string>> {
        try {
            const testimonial = await this.testimonialsRepository.findOne({ where: { id } });
            if (!testimonial) {
                throw new CustomException('Testimonial not found');
            }
            await this.testimonialsRepository.delete(id);
            return this.responseService.makeResponse({
                message: 'Testimonial deleted successfully',
                payload: null,
            });
        } catch (error) {
            throw new CustomException(error);
        }
    }

}